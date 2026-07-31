// Helper for Google Maps JS SDK loading or robust OpenStreetMap Nominatim/Photon fallback

let googleMapsPromise: Promise<typeof google> | null = null;

export const getGoogleMapsApiKey = (): string => {
  return (
    process.env.GOOGLE_MAPS_PLATFORM_KEY ||
    (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
    (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
    ''
  );
};

export const loadGoogleMaps = (): Promise<typeof google> => {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    return Promise.reject(new Error('Google Maps API key is not configured'));
  }

  if (typeof window !== 'undefined' && window.google && window.google.maps && window.google.maps.places) {
    return Promise.resolve(window.google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const scriptId = 'google-maps-js-sdk';

    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          clearInterval(checkInterval);
          resolve(window.google);
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,routes`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google);
      } else {
        reject(new Error('Google Maps script loaded but window.google.maps is undefined'));
      }
    };

    script.onerror = (err) => {
      googleMapsPromise = null;
      reject(err);
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

export interface GooglePlaceSuggestion {
  main: string;
  sub: string;
  address: string;
  placeId: string;
}

// Distance helper
const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Google Places Autocomplete prediction with automatic fallback to Nominatim & Photon (South Africa restricted)
 */
export const fetchGooglePlacePredictions = async (
  query: string,
  userCoords?: { lat: number; lng: number }
): Promise<GooglePlaceSuggestion[]> => {
  const cleanQ = query.trim();
  if (!cleanQ || cleanQ.length < 2) return [];

  const apiKey = getGoogleMapsApiKey();

  // Try Google Places Autocomplete if API key is present
  if (apiKey) {
    try {
      const g = await loadGoogleMaps();
      const autocompleteService = new g.maps.places.AutocompleteService();

      const refLat = userCoords?.lat ?? -26.1076;
      const refLng = userCoords?.lng ?? 28.0567;

      const request: google.maps.places.AutocompletionRequest = {
        input: cleanQ,
        componentRestrictions: { country: 'za' },
        locationBias: new g.maps.LatLng(refLat, refLng),
      };

      const predictions = await new Promise<any[] | null>((resolve) => {
        autocompleteService.getPlacePredictions(request, (preds, status) => {
          if (status === g.maps.places.PlacesServiceStatus.OK && preds) {
            resolve(preds);
          } else {
            resolve(null);
          }
        });
      });

      if (predictions && predictions.length > 0) {
        return predictions.map((p: any) => {
          const main = p.structured_formatting?.main_text || p.description.split(',')[0];
          const sub =
            p.structured_formatting?.secondary_text ||
            p.description.split(',').slice(1).join(',').trim() ||
            'South Africa';
          return {
            main,
            sub,
            address: p.description,
            placeId: p.place_id,
          };
        });
      }
    } catch (err) {
      console.warn('Google Places failed, falling back to OpenStreetMap Nominatim/Photon:', err);
    }
  }

  // Fallback to Nominatim & Photon (Free, no API key required, strictly South Africa)
  try {
    const refLat = userCoords?.lat ?? -26.1076;
    const refLng = userCoords?.lng ?? 28.0567;
    const results: GooglePlaceSuggestion[] = [];
    const seen = new Set<string>();

    // Nominatim Search
    const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQ)}&countrycodes=za&addressdetails=1&limit=8`;
    const nomRes = await fetch(nomUrl, { headers: { 'Accept-Language': 'en' } });
    if (nomRes.ok) {
      const nomData = await nomRes.json();
      if (Array.isArray(nomData)) {
        nomData.forEach((item: any) => {
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          const addr = item.address || {};
          const house = addr.house_number || addr.building || '';
          const road = addr.road || addr.street || addr.pedestrian || addr.suburb || item.name || '';
          const main = [house, road].filter(Boolean).join(' ') || item.name || 'Location';
          const suburb = addr.suburb || addr.neighbourhood || addr.city || '';
          const city = addr.city || addr.town || addr.state || 'South Africa';
          const sub = [suburb, city].filter(Boolean).join(', ');
          const fullAddress = item.display_name || `${main}, ${sub}`;

          if (!seen.has(fullAddress)) {
            seen.add(fullAddress);
            results.push({
              main,
              sub: sub || 'South Africa',
              address: fullAddress,
              placeId: `osm_${lat.toFixed(4)}_${lng.toFixed(4)}`,
            });
          }
        });
      }
    }

    if (results.length === 0) {
      // Photon fallback
      const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQ)}&lat=${refLat}&lon=${refLng}&limit=6`;
      const photonRes = await fetch(photonUrl);
      if (photonRes.ok) {
        const photonData = await photonRes.json();
        if (photonData && Array.isArray(photonData.features)) {
          photonData.features.forEach((feat: any) => {
            const props = feat.properties || {};
            const geom = feat.geometry || {};
            if (!geom.coordinates || geom.coordinates.length < 2) return;
            const [lng, lat] = geom.coordinates;
            const house = props.housenumber || '';
            const street = props.street || props.name || '';
            const main = [house, street].filter(Boolean).join(' ') || props.name || 'Location';
            const sub = [props.city, props.state, props.country].filter(Boolean).join(', ');
            const fullAddress = `${main}${sub ? ', ' + sub : ''}`;

            if (!seen.has(fullAddress)) {
              seen.add(fullAddress);
              results.push({
                main,
                sub: sub || 'South Africa',
                address: fullAddress,
                placeId: `photon_${lat.toFixed(4)}_${lng.toFixed(4)}`,
              });
            }
          });
        }
      }
    }

    return results;
  } catch (err) {
    console.warn('Fallback autocomplete error:', err);
    return [];
  }
};

/**
 * Retrieve Place Details or fallback coordinates
 */
export const fetchGooglePlaceDetails = async (
  placeId: string
): Promise<{ address: string; placeId: string; coords: { lat: number; lng: number } } | null> => {
  const apiKey = getGoogleMapsApiKey();

  if (apiKey && !placeId.startsWith('osm_') && !placeId.startsWith('photon_')) {
    try {
      const g = await loadGoogleMaps();
      const dummyDiv = document.createElement('div');
      const placesService = new g.maps.places.PlacesService(dummyDiv);

      return new Promise((resolve) => {
        placesService.getDetails(
          {
            placeId,
            fields: ['formatted_address', 'geometry', 'name', 'place_id'],
          },
          (place, status) => {
            if (status === g.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              const address = place.formatted_address || place.name || '';
              resolve({
                address,
                placeId: place.place_id || placeId,
                coords: { lat, lng },
              });
            } else {
              resolve(null);
            }
          }
        );
      });
    } catch (err) {
      console.warn('Google Place Details failed:', err);
    }
  }

  // Parse osm_lat_lng or photon_lat_lng fallback IDs
  if (placeId.startsWith('osm_') || placeId.startsWith('photon_')) {
    const parts = placeId.split('_');
    if (parts.length >= 3) {
      const lat = parseFloat(parts[1]);
      const lng = parseFloat(parts[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return {
          address: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          placeId,
          coords: { lat, lng },
        };
      }
    }
  }

  return {
    address: placeId,
    placeId,
    coords: { lat: -26.1076, lng: 28.0567 },
  };
};

/**
 * Reverse Geocode lat/lng to formatted address using Google Geocoder or Nominatim fallback
 */
export const reverseGeocodeGoogle = async (
  lat: number,
  lng: number
): Promise<{ address: string; placeId?: string }> => {
  const apiKey = getGoogleMapsApiKey();

  if (apiKey) {
    try {
      const g = await loadGoogleMaps();
      const geocoder = new g.maps.Geocoder();
      return new Promise((resolve) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            resolve({
              address: results[0].formatted_address,
              placeId: results[0].place_id,
            });
          } else {
            resolve({ address: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` });
          }
        });
      });
    } catch (err) {
      console.warn('Google Geocoder failed:', err);
    }
  }

  // Fallback to Nominatim reverse
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        return {
          address: data.display_name,
          placeId: `osm_${lat.toFixed(4)}_${lng.toFixed(4)}`,
        };
      }
    }
  } catch (err) {
    console.warn('Nominatim reverse geocode error:', err);
  }

  return { address: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` };
};

/**
 * Fetch driving route polyline from Google Directions API or straight line fallback
 */
export const fetchGoogleDirectionsRoute = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<{ lat: number; lng: number }[]> => {
  const apiKey = getGoogleMapsApiKey();

  if (apiKey) {
    try {
      const g = await loadGoogleMaps();
      const directionsService = new g.maps.DirectionsService();

      return new Promise((resolve) => {
        directionsService.route(
          {
            origin: new g.maps.LatLng(origin.lat, origin.lng),
            destination: new g.maps.LatLng(destination.lat, destination.lng),
            travelMode: g.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === g.maps.DirectionsStatus.OK && result && result.routes[0] && result.routes[0].overview_path) {
              const path = result.routes[0].overview_path.map((pt) => ({
                lat: pt.lat(),
                lng: pt.lng(),
              }));
              resolve(path);
            } else {
              resolve([origin, destination]);
            }
          }
        );
      });
    } catch (err) {
      console.warn('Google Directions failed:', err);
    }
  }

  // Fallback straight line
  return [origin, destination];
};

