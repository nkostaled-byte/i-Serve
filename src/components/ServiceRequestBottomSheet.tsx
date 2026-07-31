import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, MapPin, CreditCard, Building2, Smartphone, ArrowRight, ShieldCheck, 
  Check, LocateFixed, Home, Briefcase, Heart, Loader2, Search, ArrowLeft, Navigation
} from 'lucide-react';
import { ServiceCategory, SubService, UserProfile, SavedLocation } from '../types';
import L from 'leaflet';
import { 
  fetchGooglePlacePredictions, 
  fetchGooglePlaceDetails, 
  reverseGeocodeGoogle, 
  GooglePlaceSuggestion 
} from '../utils/googleMaps';

interface ServiceRequestBottomSheetProps {
  category: ServiceCategory;
  subService?: SubService;
  user: UserProfile;
  onClose: () => void;
  onSubmitRequest: (details: { 
    address: string; 
    notes: string; 
    paymentMethod: 'paystack_card' | 'paystack_eft' | 'paystack_mobile' | 'apple_pay' | 'credit_card' | 'cash'; 
    amount: number;
    subServiceTitle?: string;
    coords?: { lat: number; lng: number };
    placeId?: string;
  }) => void;
}

interface AddressSuggestion {
  main: string;
  sub: string;
  address: string;
  coords: { lat: number; lng: number };
  distanceStr?: string;
}

// Distance calculation helper (Haversine formula in km)
const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Reverse geocode lat/lng to real formatted address string via Nominatim
const reverseGeocodeCoords = async (lat: number, lng: number): Promise<string> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        const addr = data.address || {};
        const house = addr.house_number || addr.building || '';
        const road = addr.road || addr.street || addr.pedestrian || addr.suburb || data.name || '';
        const suburb = addr.suburb || addr.neighbourhood || addr.district || '';
        const city = addr.city || addr.town || addr.municipality || addr.county || '';

        const primary = [house, road].filter(Boolean).join(' ');
        const secondary = [suburb, city].filter(s => s && s !== primary).join(', ');

        if (primary && secondary) return `${primary}, ${secondary}`;
        if (primary) return `${primary}, ${city || 'Metro Area'}`;
        return data.display_name.split(',').slice(0, 3).join(',').trim();
      }
    }
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
  }
  return `Pinned Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
};

// In-memory search predictions cache
const addressSearchCache = new Map<string, AddressSuggestion[]>();

// Helper to check if location is within South Africa
const isWithinSouthAfrica = (lat: number, lng: number, countryCode?: string, countryName?: string): boolean => {
  if (countryCode && countryCode.toLowerCase() === 'za') return true;
  if (countryName && countryName.toLowerCase().includes('south africa')) return true;
  // Bounding box fallback for South Africa: lat [-35, -22], lng [16, 33]
  if (lat >= -35.0 && lat <= -22.0 && lng >= 16.0 && lng <= 33.0) return true;
  return false;
};

// Calculate text relevance score for ranking (relevance first, distance second)
const calculateRelevanceScore = (
  query: string,
  main: string,
  sub: string,
  fullAddress: string,
  distKm: number
): number => {
  const qLower = query.toLowerCase().trim();
  const fullLower = fullAddress.toLowerCase();
  const mainLower = main.toLowerCase();
  const subLower = sub.toLowerCase();

  let score = 0;

  // 1. Exact full query match inside full address or main street
  if (fullLower.includes(qLower)) {
    score += 1000;
  }
  if (mainLower.startsWith(qLower)) {
    score += 800;
  }

  // 2. Token-by-token matching
  const tokens = qLower.split(/\s+/).filter(t => t.length > 0);
  let matchedTokensCount = 0;

  tokens.forEach((token) => {
    let tokenMatched = false;
    // House number check (numeric tokens like "62")
    if (/^\d+[a-z]?$/i.test(token)) {
      if (mainLower.startsWith(token) || mainLower.includes(` ${token} `) || mainLower.includes(` ${token}`)) {
        score += 500;
        tokenMatched = true;
      }
    }

    if (mainLower.includes(token)) {
      score += 200;
      tokenMatched = true;
    }
    if (subLower.includes(token)) {
      score += 150;
      tokenMatched = true;
    }

    if (tokenMatched) matchedTokensCount++;
  });

  // If all query tokens match in the address, give a massive boost
  if (tokens.length > 0 && matchedTokensCount === tokens.length) {
    score += 600;
  }

  // Distance penalty (subtract small distance weight so closer items win among equal text matches)
  score -= Math.min(distKm * 0.5, 300);

  return score;
};

// Live real-time address predictions fetch using Nominatim & Photon with strict location bias & country restriction
const fetchRealAddressPredictions = async (
  query: string, 
  userCoords?: { lat: number; lng: number },
  signal?: AbortSignal
): Promise<AddressSuggestion[]> => {
  const cleanQ = query.trim();
  if (!cleanQ || cleanQ.length < 2) return [];

  console.log('[AutoComplete Runtime] 1. Search triggered for query:', cleanQ);

  // Default fallback user location (Sandton / Johannesburg) if userCoords not available
  const refLat = userCoords?.lat ?? -26.1076;
  const refLng = userCoords?.lng ?? 28.0567;

  console.log('[AutoComplete Runtime] 2. Location bias reference coordinates:', { refLat, refLng });

  // Check in-memory cache
  const cacheKey = `${cleanQ.toLowerCase()}_${refLat.toFixed(2)}_${refLng.toFixed(2)}`;
  if (addressSearchCache.has(cacheKey)) {
    console.log('[AutoComplete Runtime] 3. Serving cached suggestions for key:', cacheKey);
    return addressSearchCache.get(cacheKey)!;
  }

  let candidates: (AddressSuggestion & { score: number; isZA: boolean })[] = [];

  // 1. Fetch from Nominatim (Strictly restricted to South Africa via countrycodes=za)
  try {
    const minLng = refLng - 2.0;
    const maxLng = refLng + 2.0;
    const minLat = refLat - 2.0;
    const maxLat = refLat + 2.0;

    const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQ)}&countrycodes=za&addressdetails=1&limit=15&viewbox=${minLng},${maxLat},${maxLng},${minLat}&bounded=0`;
    console.log('[AutoComplete Runtime] 4. Fetching Nominatim API endpoint:', nomUrl);
    
    const nomRes = await fetch(nomUrl, { 
      headers: { 'Accept-Language': 'en' },
      signal 
    });

    console.log('[AutoComplete Runtime] 5. Nominatim API HTTP Status:', nomRes.status);

    if (nomRes.ok) {
      const nomData = await nomRes.json();
      console.log('[AutoComplete Runtime] 6. Nominatim Raw Response Items Count:', Array.isArray(nomData) ? nomData.length : 0);
      if (Array.isArray(nomData)) {
        nomData.forEach((item: any) => {
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          const addr = item.address || {};
          const countryCode = (addr.country_code || '').toLowerCase();
          const countryName = (addr.country || '').toLowerCase();

          // Strict validation: Must be within South Africa
          const isZA = isWithinSouthAfrica(lat, lng, countryCode, countryName);
          if (!isZA) return;

          const house = addr.house_number || addr.building || '';
          const road = addr.road || addr.street || addr.pedestrian || addr.suburb || item.name || item.display_name.split(',')[0];
          const main = [house, road].filter(Boolean).join(' ') || item.name || 'Location';

          const suburb = addr.suburb || addr.neighbourhood || addr.quarter || addr.subdistrict || '';
          const city = addr.city || addr.town || addr.municipality || addr.county || addr.state || '';

          const subParts = [suburb, city, 'South Africa'].filter(Boolean);
          const uniqueSubParts = subParts.filter(p => !main.toLowerCase().includes(p.toLowerCase()));
          const sub = uniqueSubParts.join(', ');

          const fullAddress = `${main}${sub ? ', ' + sub : ''}`;

          const distKm = calculateDistanceKm(refLat, refLng, lat, lng);
          const distanceStr = distKm < 1 ? `${Math.round(distKm * 1000)}m` : `${distKm.toFixed(1)}km`;
          const score = calculateRelevanceScore(cleanQ, main, sub, fullAddress, distKm);

          candidates.push({
            main,
            sub,
            address: fullAddress,
            coords: { lat, lng },
            distanceStr,
            score,
            isZA: true
          });
        });
      }
    }
  } catch (err: any) {
    if (err.name !== 'AbortError') {
      console.warn('[AutoComplete Runtime] Nominatim error:', err);
    }
  }

  // 2. ONLY if Nominatim returned ZERO South African matches, try Photon with strict ZA filter
  if (candidates.length === 0) {
    console.log('[AutoComplete Runtime] 7. Nominatim yielded 0 ZA matches. Attempting Photon fallback...');
    try {
      const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQ)}&lat=${refLat}&lon=${refLng}&location_bias_scale=0.95&limit=10`;
      console.log('[AutoComplete Runtime] 8. Fetching Photon API endpoint:', photonUrl);
      const photonRes = await fetch(photonUrl, { signal });
      
      if (photonRes.ok) {
        const photonData = await photonRes.json();
        if (photonData && Array.isArray(photonData.features)) {
          photonData.features.forEach((feat: any) => {
            const props = feat.properties || {};
            const geom = feat.geometry || {};
            if (!geom.coordinates || geom.coordinates.length < 2) return;

            const [lng, lat] = geom.coordinates;
            const countryCode = (props.countrycode || '').toLowerCase();
            const countryName = (props.country || '').toLowerCase();

            // Strict validation: Must be within South Africa unless query explicitly requests another country
            const isExplicitInternational = /australia|canada|united kingdom|united states|uk|usa/i.test(cleanQ);
            const isZA = isWithinSouthAfrica(lat, lng, countryCode, countryName);
            
            if (!isZA && !isExplicitInternational) return; // DISCARD NON-ZA RESULTS

            const house = props.housenumber || '';
            const street = props.street || props.name || '';
            let main = [house, street].filter(Boolean).join(' ');
            if (!main) main = props.name || props.city || 'Location';

            const subParts = [props.district, props.city, props.state, props.country].filter(Boolean);
            const uniqueSub = subParts.filter(p => !main.toLowerCase().includes(p.toLowerCase()));
            const sub = uniqueSub.join(', ');
            const fullAddress = `${main}${sub ? ', ' + sub : ''}`;

            const distKm = calculateDistanceKm(refLat, refLng, lat, lng);
            const distanceStr = distKm < 1 ? `${Math.round(distKm * 1000)}m` : `${distKm.toFixed(1)}km`;
            const score = calculateRelevanceScore(cleanQ, main, sub, fullAddress, distKm);

            candidates.push({
              main,
              sub: sub || props.country || 'Location',
              address: fullAddress,
              coords: { lat, lng },
              distanceStr,
              score,
              isZA
            });
          });
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('[AutoComplete Runtime] Photon error:', err);
      }
    }
  }

  // 3. Deduplicate candidates by coordinates / normalized address text
  const uniqueCandidates: typeof candidates = [];
  const seenKeys = new Set<string>();

  candidates.forEach(item => {
    const coordKey = `${item.coords.lat.toFixed(4)}_${item.coords.lng.toFixed(4)}`;
    const textKey = item.address.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (!seenKeys.has(coordKey) && !seenKeys.has(textKey)) {
      seenKeys.add(coordKey);
      seenKeys.add(textKey);
      uniqueCandidates.push(item);
    }
  });

  // 4. Rank candidates strictly by relevance score
  uniqueCandidates.sort((a, b) => b.score - a.score);

  const finalSuggestions: AddressSuggestion[] = uniqueCandidates.slice(0, 8).map(
    ({ main, sub, address, coords, distanceStr }) => ({
      main,
      sub,
      address,
      coords,
      distanceStr
    })
  );

  console.log('[AutoComplete Runtime] 9. Final suggestions array returned:', finalSuggestions);

  // Cache non-empty results
  if (finalSuggestions.length > 0) {
    addressSearchCache.set(cacheKey, finalSuggestions);
  }

  return finalSuggestions;
};

export const ServiceRequestBottomSheet: React.FC<ServiceRequestBottomSheetProps> = ({
  category,
  subService,
  user,
  onClose,
  onSubmitRequest,
}) => {
  // Default saved locations
  const defaultSavedLocations: SavedLocation[] = [
    { id: 'loc_1', label: 'Home', address: user.address || '125 Main Street, Apt 4B, Sandton', isDefault: true, coords: { lat: -26.1076, lng: 28.0567 } },
    { id: 'loc_2', label: 'Work', address: '45 Business Ave, Suite 1200, Rosebank', coords: { lat: -26.1465, lng: 28.0436 } },
    { id: 'loc_3', label: "Mom's House", address: '782 Sunset Boulevard, Fourways', coords: { lat: -26.0152, lng: 28.0132 } }
  ];

  const savedLocationsList = user.savedLocations && user.savedLocations.length > 0
    ? user.savedLocations
    : defaultSavedLocations;

  const initialCoords = savedLocationsList[0]?.coords || { lat: -26.1076, lng: 28.0567 };

  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>(initialCoords);
  const [selectedAddress, setSelectedAddress] = useState<string>(savedLocationsList[0]?.address || '125 Main Street, Apt 4B, Sandton');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(undefined);
  const [activeLocationId, setActiveLocationId] = useState<string>(savedLocationsList[0]?.id || 'loc_1');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Uber-Style Address Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<GooglePlaceSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'paystack_card' | 'paystack_eft' | 'paystack_mobile'>('paystack_card');

  const serviceName = subService?.name || `${category.title} Service`;
  const totalAmount = subService?.price || category.priceStarting;
  const currencySymbol = subService?.currencySymbol || 'R';

  // Leaflet Map Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Focus keyboard automatically when search sheet opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    }
  }, [isSearchOpen]);

  // Google Places Autocomplete search restricted to South Africa (country: "za") with GPS bias
  useEffect(() => {
    const cleanQ = searchQuery.trim();
    if (!cleanQ || cleanQ.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await fetchGooglePlacePredictions(searchQuery, selectedCoords);
        setSuggestions(results);
        setIsSearching(false);
      } catch (err: any) {
        console.warn('Google Places Autocomplete error:', err);
        setIsSearching(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, selectedCoords]);

  // Attempt automatic GPS location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setIsLocating(false);
          const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setSelectedCoords(newCoords);
          const geocoded = await reverseGeocodeGoogle(newCoords.lat, newCoords.lng);
          setSelectedAddress(geocoded.address);
          if (geocoded.placeId) setSelectedPlaceId(geocoded.placeId);
          setActiveLocationId('gps');
        },
        () => {
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Initialize interactive Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedCoords.lat, selectedCoords.lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: false,
        doubleClickZoom: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Custom Service Location Pin Marker HTML
      const servicePinHtml = `
        <div class="relative flex flex-col items-center justify-center -translate-x-1/2 -translate-y-full cursor-grab active:cursor-grabbing">
          <div class="relative bg-slate-900 text-white font-sans text-[10px] font-bold px-3 py-1.5 rounded-full shadow-2xl flex items-center space-x-1.5 border border-[#27C2D4] backdrop-blur-md">
            <span class="w-2 h-2 rounded-full bg-[#27C2D4] animate-ping"></span>
            <span>SERVICE LOCATION</span>
          </div>
          <div class="w-3.5 h-3.5 bg-slate-900 border-b-2 border-r-2 border-[#27C2D4] rotate-45 -mt-2"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-service-location-pin',
        html: servicePinHtml,
        iconSize: [140, 50],
        iconAnchor: [70, 50],
      });

      const marker = L.marker([selectedCoords.lat, selectedCoords.lng], {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      // Drag event -> reverse geocode real position using Google Geocoder
      marker.on('dragend', async (e) => {
        const pos = e.target.getLatLng();
        const newPos = { lat: pos.lat, lng: pos.lng };
        setSelectedCoords(newPos);
        setActiveLocationId('pin_dropped');
        const geocoded = await reverseGeocodeGoogle(pos.lat, pos.lng);
        setSelectedAddress(geocoded.address);
        if (geocoded.placeId) setSelectedPlaceId(geocoded.placeId);
      });

      // Map click event -> move marker & reverse geocode using Google Geocoder
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        const newPos = { lat, lng };
        setSelectedCoords(newPos);
        marker.setLatLng([lat, lng]);
        setActiveLocationId('pin_dropped');
        const geocoded = await reverseGeocodeGoogle(lat, lng);
        setSelectedAddress(geocoded.address);
        if (geocoded.placeId) setSelectedPlaceId(geocoded.placeId);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Synchronize marker & camera when selectedCoords changes
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo([selectedCoords.lat, selectedCoords.lng], 16, { animate: true });
      markerRef.current.setLatLng([selectedCoords.lat, selectedCoords.lng]);
    }
  }, [selectedCoords]);

  // GPS Location Trigger
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsLocating(false);
        const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setSelectedCoords(newCoords);
        const res = await reverseGeocodeGoogle(newCoords.lat, newCoords.lng);
        setSelectedAddress(res.address);
        if (res.placeId) setSelectedPlaceId(res.placeId);
        setActiveLocationId('gps');
        setIsSearchOpen(false);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation fallback:', err);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSelectSavedLocation = (loc: SavedLocation) => {
    setActiveLocationId(loc.id);
    setSelectedAddress(loc.address);
    if (loc.coords) {
      setSelectedCoords(loc.coords);
    }
  };

  // When a prediction is selected:
  // 1. Retrieve Place Details via Google Places API
  // 2. Save formatted address
  // 3. Save Place ID
  // 4. Save latitude and longitude
  // 5. Center Google Map on selected location
  const handleSelectSuggestion = async (suggestion: GooglePlaceSuggestion) => {
    setIsSearching(true);
    const details = await fetchGooglePlaceDetails(suggestion.placeId);
    setIsSearching(false);

    // Save the selected suggestion address name / text
    setSelectedAddress(suggestion.address);
    setSelectedPlaceId(suggestion.placeId);
    setActiveLocationId('suggestion');

    if (details && details.coords) {
      setSelectedCoords(details.coords);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([details.coords.lat, details.coords.lng], 16, { animate: true });
      }
    }

    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleConfirm = () => {
    onSubmitRequest({
      address: selectedAddress,
      notes,
      paymentMethod,
      amount: totalAmount,
      subServiceTitle: serviceName,
      coords: selectedCoords,
      placeId: selectedPlaceId,
    });
  };

  const getAddressIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('home')) return Home;
    if (l.includes('work') || l.includes('office')) return Briefcase;
    return Heart;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 font-sans">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="w-full max-w-lg bg-white dark:bg-[#050816] rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 px-5 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between bg-white/80 dark:bg-[#050816]/80 backdrop-blur-md sticky top-0 z-20">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#27C2D4] dark:text-[#21C7F6]">
              {category.title}
            </span>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-tight">
              {serviceName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-[#131E33] text-slate-500 dark:text-[#7F8DA8] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm">
          {/* SERVICE LOCATION MAP PICKER SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-[#B8C3D9]">
                Service Address & Map
              </label>
              <button
                type="button"
                onClick={handleUseGPS}
                disabled={isLocating}
                className="text-[11px] font-semibold text-[#27C2D4] dark:text-[#21C7F6] bg-cyan-50 dark:bg-[#131E33] hover:bg-cyan-100 dark:hover:bg-[#1A2844] px-3 py-1.5 rounded-full flex items-center space-x-1.5 transition-colors cursor-pointer border border-cyan-100 dark:border-white/[0.06]"
              >
                {isLocating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LocateFixed className="w-3.5 h-3.5" />
                )}
                <span>{isLocating ? 'Locating...' : 'Use Current GPS'}</span>
              </button>
            </div>

            {/* Saved Addresses Quick Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {savedLocationsList.map((loc) => {
                const IconComponent = getAddressIcon(loc.label);
                const isSelected = activeLocationId === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectSavedLocation(loc)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1.5 shrink-0 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-[#21C7F6] text-white dark:text-[#070B14] border-slate-900 dark:border-[#21C7F6] font-semibold shadow-sm'
                        : 'bg-white dark:bg-[#131E33] text-slate-700 dark:text-[#B8C3D9] border-slate-200 dark:border-white/[0.08] hover:border-slate-300'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{loc.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Map Container */}
            <div className="relative rounded-[24px] overflow-hidden border border-slate-200 dark:border-white/[0.08] shadow-md h-[210px]">
              <div ref={mapContainerRef} className="w-full h-full z-10" />

              {/* Floating "Use Current Location" button on map */}
              <button
                type="button"
                onClick={handleUseGPS}
                className="absolute top-3 right-3 z-20 bg-white dark:bg-[#050816] text-slate-800 dark:text-white p-2.5 rounded-full shadow-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-[#131E33] transition-transform active:scale-95 cursor-pointer"
                title="Recenter on current location"
              >
                <Navigation className="w-4 h-4 text-[#27C2D4] dark:text-[#21C7F6]" />
              </button>

              {/* Map Helper Badge Overlay */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 pointer-events-none">
                <div className="bg-slate-900/85 backdrop-blur-md text-white text-[10px] px-3.5 py-1.5 rounded-full flex items-center justify-between border border-white/10 shadow-lg">
                  <span className="flex items-center space-x-1.5 text-cyan-200">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>Drag pin on map to refine location</span>
                  </span>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Live GPS</span>
                </div>
              </div>
            </div>

            {/* Uber-Style Address Field Selector Button */}
            <div
              onClick={() => {
                setIsSearchOpen(true);
                setSearchQuery('');
              }}
              className="bg-white dark:bg-[#131E33] p-3.5 rounded-[20px] shadow-sm flex items-center space-x-3 border border-slate-200 dark:border-white/[0.08] hover:border-[#27C2D4] dark:hover:border-[#21C7F6] transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-cyan-50 dark:bg-[#050816] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#27C2D4] dark:text-[#21C7F6]" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-[#7F8DA8] block tracking-wider">
                  Selected Service Location
                </span>
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {selectedAddress || 'Tap to search address...'}
                </p>
              </div>
              <Search className="w-4 h-4 text-slate-400 group-hover:text-[#27C2D4] dark:group-hover:text-[#21C7F6] shrink-0 transition-colors" />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-[#B8C3D9] ml-1">Additional Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Ring doorbell, gate access code, or specific issue details..."
              className="w-full p-3.5 bg-white dark:bg-[#131E33] border border-slate-100 dark:border-white/[0.06] rounded-[20px] text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#7F8DA8] shadow-sm focus:ring-2 focus:ring-[#27C2D4]/40 dark:focus:ring-[#21C7F6]/40 focus:outline-none"
            />
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-[#B8C3D9] ml-1">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'paystack_card', label: 'Debit/Credit Card', icon: CreditCard },
                { id: 'paystack_eft', label: 'EFT Bank Transfer', icon: Building2 },
                { id: 'paystack_mobile', label: 'Capitec Pay / Mobile', icon: Smartphone }
              ].map((pm) => {
                const Icon = pm.icon;
                const isSelected = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-3 rounded-[20px] text-left transition-all flex flex-col justify-between border cursor-pointer ${
                      isSelected 
                        ? 'bg-cyan-50/50 dark:bg-[#21C7F6]/10 border-[#27C2D4] dark:border-[#21C7F6] text-slate-900 dark:text-white' 
                        : 'bg-white dark:bg-[#131E33] border-slate-100 dark:border-white/[0.06] text-slate-600 dark:text-[#B8C3D9] hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#27C2D4] dark:text-[#21C7F6]' : 'text-slate-400'}`} />
                      {isSelected && (
                        <div className="w-3.5 h-3.5 rounded-full bg-[#27C2D4] dark:bg-[#21C7F6] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white dark:text-[#070B14]" />
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-medium leading-tight">{pm.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Footer - Amount displayed cleanly on top, Request button full width below */}
        <div className="p-4 px-5 bg-white dark:bg-[#050816] border-t border-slate-100 dark:border-white/[0.06] space-y-3 font-sans">
          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#7F8DA8]">
              Total Amount
            </span>
            <span className="text-lg font-serif font-bold text-[#3F73C7] dark:text-[#21C7F6]">
              {currencySymbol}{totalAmount}
            </span>
          </div>
          <button
            onClick={handleConfirm}
            className="w-full py-4 bg-gradient-to-r from-[#27C2D4] via-[#3F73C7] to-[#4340A8] dark:from-[#21C7F6] dark:via-[#4D5DFA] dark:to-[#3F73C7] text-white font-semibold rounded-[24px] shadow-lg flex items-center justify-center space-x-2 text-base active:scale-[0.98] transition-transform cursor-pointer"
          >
            <span>Request Service Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* UBER / BOLT FULL-SCREEN ADDRESS SEARCH SHEET */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-white dark:bg-[#050816] flex flex-col font-sans"
          >
            {/* Search Sheet Header */}
            <div className="p-4 px-5 border-b border-slate-100 dark:border-white/[0.08] flex items-center space-x-3 bg-white dark:bg-[#050816] sticky top-0 z-20">
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-full bg-slate-100 dark:bg-[#131E33] text-slate-600 dark:text-white hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Uber-style Search Input Box (20px radius container) */}
              <div className="flex-1 bg-slate-100 dark:bg-[#131E33] p-3 rounded-[20px] flex items-center space-x-3 border border-transparent focus-within:border-[#27C2D4] dark:focus-within:border-[#21C7F6] transition-colors">
                <Search className="w-4 h-4 text-[#27C2D4] dark:text-[#21C7F6] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Where should we send service?"
                  className="w-full text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#7F8DA8] focus:outline-none bg-transparent"
                />
                {isSearching ? (
                  <Loader2 className="w-4 h-4 text-[#27C2D4] dark:text-[#21C7F6] animate-spin shrink-0" />
                ) : searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white shrink-0 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Search Sheet Results Body */}
            <div className="flex-1 overflow-y-auto p-4 px-5 space-y-4">
              {/* If search query is empty -> Show "Use current location" and Saved Locations */}
              {!searchQuery.trim() ? (
                <div className="space-y-5">
                  {/* Use Current GPS Location Action Item */}
                  <div
                    onClick={handleUseGPS}
                    className="flex items-center space-x-3.5 p-3.5 rounded-[20px] bg-slate-50 dark:bg-[#131E33] hover:bg-cyan-50/60 dark:hover:bg-[#1A2844] cursor-pointer transition-colors border border-slate-100 dark:border-white/[0.04]"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#27C2D4]/10 dark:bg-[#21C7F6]/10 flex items-center justify-center shrink-0">
                      <Navigation className="w-5 h-5 text-[#27C2D4] dark:text-[#21C7F6]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Use my current location
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-[#7F8DA8]">
                        Using GPS coordinates
                      </p>
                    </div>
                  </div>

                  {/* Saved Locations */}
                  {savedLocationsList.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-[#7F8DA8] px-1">
                        Saved Places
                      </span>
                      <div className="space-y-1">
                        {savedLocationsList.map((loc) => {
                          const IconComp = getAddressIcon(loc.label);
                          return (
                            <div
                              key={loc.id}
                              onClick={() => {
                                handleSelectSavedLocation(loc);
                                setIsSearchOpen(false);
                              }}
                              className="flex items-center space-x-3.5 p-3 rounded-[18px] hover:bg-slate-50 dark:hover:bg-[#131E33] cursor-pointer transition-colors border-b border-slate-50 dark:border-white/[0.04] last:border-0"
                            >
                              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#131E33] flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300">
                                <IconComp className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-semibold text-slate-900 dark:text-white">
                                  {loc.label}
                                </h5>
                                <p className="text-[11px] text-slate-400 dark:text-[#7F8DA8] truncate">
                                  {loc.address}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Empty state helper */}
                  <div className="pt-8 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#131E33] flex items-center justify-center mx-auto text-slate-400">
                      <Search className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-[#7F8DA8]">
                      Start typing an address to find live location
                    </p>
                  </div>
                </div>
              ) : (
                /* Search Query Predictions List */
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-1 pb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-[#7F8DA8]">
                      Address Predictions
                    </span>
                    {isSearching && (
                      <span className="text-[10px] text-[#27C2D4] dark:text-[#21C7F6] flex items-center space-x-1">
                        <Loader2 className="w-3 h-3 animate-spin inline" />
                        <span>Searching map...</span>
                      </span>
                    )}
                  </div>

                  {suggestions.length === 0 && !isSearching ? (
                    <div className="p-8 text-center space-y-2">
                      <MapPin className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-500 dark:text-[#7F8DA8]">
                        No locations found for "{searchQuery}". Try adding a suburb or street number.
                      </p>
                    </div>
                  ) : (
                    suggestions.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectSuggestion(item)}
                        className="p-3.5 rounded-[20px] hover:bg-slate-50 dark:hover:bg-[#131E33] cursor-pointer flex items-center space-x-3.5 border-b border-slate-50 dark:border-white/[0.04] last:border-0 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#131E33] flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.main}
                          </h5>
                          <p className="text-[11px] text-slate-500 dark:text-[#7F8DA8] truncate mt-0.5">
                            {item.sub}
                          </p>
                        </div>
                        {item.distanceStr && (
                          <span className="text-[11px] font-medium text-slate-400 dark:text-[#7F8DA8] shrink-0 bg-slate-100 dark:bg-[#131E33] px-2 py-0.5 rounded-md">
                            {item.distanceStr}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
