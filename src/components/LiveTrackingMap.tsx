import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import L from 'leaflet';
import { Phone, MessageSquare, XCircle, ShieldCheck, Clock, CheckCircle, ArrowLeft, Maximize2, Compass } from 'lucide-react';
import { ServiceProvider, ServiceBookingRequest } from '../types';
import { useTheme } from '../context/ThemeContext';

interface LiveTrackingMapProps {
  provider: ServiceProvider;
  bookingRequest: ServiceBookingRequest;
  onOpenChat: () => void;
  onCancelRequest: () => void;
  onCompleteJob: () => void;
  onBack?: () => void;
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  provider,
  bookingRequest,
  onOpenChat,
  onCancelRequest,
  onCompleteJob,
  onBack,
}) => {
  const { isDarkMode } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const providerMarkerRef = useRef<L.Marker | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  // Initial coordinates: User & Provider
  const userLat = bookingRequest.userCoords?.lat || -26.2041;
  const userLng = bookingRequest.userCoords?.lng || 28.0473;

  const [providerPos, setProviderPos] = useState({
    lat: bookingRequest.providerCoords?.lat || -26.1980,
    lng: bookingRequest.providerCoords?.lng || 28.0530,
  });

  const providerPosRef = useRef(providerPos);
  providerPosRef.current = providerPos;

  const [etaMins, setEtaMins] = useState<number>(provider.estimatedArrivalMins || 8);
  const [distanceKm, setDistanceKm] = useState<number>(provider.distanceKm || 2.4);
  const [autoFitActive, setAutoFitActive] = useState<boolean>(true);

  // Helper function to perform smooth animated fitBounds respecting UI overlays (top bar & bottom sheet)
  const handleFitBounds = useCallback((map?: L.Map | null, animate = true) => {
    const targetMap = map || mapInstanceRef.current;
    if (!targetMap) return;

    try {
      let bounds: L.LatLngBounds | null = null;

      if (polylineRef.current) {
        const pBounds = polylineRef.current.getBounds();
        if (pBounds && pBounds.isValid()) {
          bounds = pBounds;
        }
      }

      if (!bounds) {
        bounds = L.latLngBounds([
          [userLat, userLng],
          [providerPosRef.current.lat, providerPosRef.current.lng],
        ]);
      }

      targetMap.fitBounds(bounds, {
        paddingTopLeft: [40, 100],     // [x-left, y-top]
        paddingBottomRight: [40, 310],  // [x-right, y-bottom]
        maxZoom: 16,
        animate,
      });
    } catch (e) {
      // Safe guard against map cleanup errors
    }
  }, [userLat, userLng]);

  // Setup Leaflet map on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let fitTimeout: NodeJS.Timeout | null = null;

    if (!mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: [userLat, userLng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Tile Layer (Voyager or Dark Matter)
      const tileUrl = isDarkMode
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // 1. User Marker (Pulse Dot)
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative flex items-center justify-center w-8 h-8">
            <div class="absolute w-8 h-8 bg-cyan-400/30 rounded-full animate-ping"></div>
            <div class="w-5 h-5 bg-[#27C2D4] border-2 border-white rounded-full shadow-lg"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const uMarker = L.marker([userLat, userLng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<strong class="text-xs">Your Location</strong><br/>' + bookingRequest.address);
      userMarkerRef.current = uMarker;

      // 2. Provider Marker
      const providerIcon = L.divIcon({
        className: 'custom-provider-marker',
        html: `
          <div class="relative flex flex-col items-center">
            <div class="bg-slate-900 text-white p-0.5 rounded-full border-2 border-[#27C2D4] shadow-xl flex items-center justify-center w-9 h-9">
              <img src="${provider.avatarUrl}" class="w-8 h-8 rounded-full object-cover" />
            </div>
            <div class="bg-[#27C2D4] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow mt-0.5 whitespace-nowrap">
              ${provider.name.split(' ')[0]}
            </div>
          </div>
        `,
        iconSize: [40, 48],
        iconAnchor: [20, 24],
      });

      const pMarker = L.marker([providerPos.lat, providerPos.lng], { icon: providerIcon }).addTo(map);
      providerMarkerRef.current = pMarker;

      // 3. Polyline route between provider and user
      const polyline = L.polyline(
        [
          [providerPos.lat, providerPos.lng],
          [userLat + (providerPos.lat - userLat) * 0.5 + 0.001, userLng + (providerPos.lng - userLng) * 0.5 - 0.001],
          [userLat, userLng],
        ],
        { color: '#27C2D4', weight: 4, opacity: 0.85, lineCap: 'round', lineJoin: 'round' }
      ).addTo(map);

      polylineRef.current = polyline;

      // Detect manual dragging to temporarily pause auto-fit until re-center button is clicked
      map.on('dragstart', () => setAutoFitActive(false));

      mapInstanceRef.current = map;

      // Initial animated fit bounds
      fitTimeout = setTimeout(() => {
        if (mapInstanceRef.current) {
          handleFitBounds(mapInstanceRef.current, true);
        }
      }, 250);
    }

    return () => {
      if (fitTimeout) clearTimeout(fitTimeout);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.stop();
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore cleanup exceptions
        }
        mapInstanceRef.current = null;
      }
    };
  }, [userLat, userLng, bookingRequest.address, provider, handleFitBounds]);

  // Animate Provider Movement along GPS trajectory in real time & smooth bounds update
  useEffect(() => {
    const interval = setInterval(() => {
      setProviderPos((prev) => {
        // Move provider closer to user
        const latDiff = userLat - prev.lat;
        const lngDiff = userLng - prev.lng;

        if (Math.abs(latDiff) < 0.0002 && Math.abs(lngDiff) < 0.0002) {
          clearInterval(interval);
          setEtaMins(0);
          setDistanceKm(0);
          
          import('../utils/notifications').then(({ sendPushNotification }) => {
            sendPushNotification(`${provider.name} has arrived`, { body: "Your service provider is now at your location." });
          });

          return { lat: userLat, lng: userLng };
        }

        const newLat = prev.lat + latDiff * 0.08;
        const newLng = prev.lng + lngDiff * 0.08;

        // Update leaflet marker position
        if (providerMarkerRef.current) {
          try {
            providerMarkerRef.current.setLatLng([newLat, newLng]);
          } catch (e) {
            // ignore if unmounted
          }
        }

        // Update polyline route
        if (polylineRef.current) {
          try {
            polylineRef.current.setLatLngs([
              [newLat, newLng],
              [userLat, userLng],
            ]);
          } catch (e) {
            // ignore if unmounted
          }
        }

        // Only adjust map bounds if marker moves outside current visible view
        if (autoFitActive && mapInstanceRef.current) {
          try {
            const bounds = mapInstanceRef.current.getBounds();
            if (!bounds.contains([newLat, newLng])) {
              handleFitBounds(mapInstanceRef.current, true);
            }
          } catch (e) {
            // ignore
          }
        }

        // Update ETA & distance
        const remainingDist = Math.sqrt(Math.pow(userLat - newLat, 2) + Math.pow(userLng - newLng, 2)) * 111;
        setDistanceKm(Math.max(0.1, parseFloat(remainingDist.toFixed(1))));
        setEtaMins(Math.max(1, Math.ceil(remainingDist * 3.5)));

        return { lat: newLat, lng: newLng };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [userLat, userLng, autoFitActive, handleFitBounds]);

  // Dynamically update tile layer when dark mode changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const tileUrl = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    const newLayer = L.tileLayer(tileUrl, { maxZoom: 19, subdomains: 'abcd' }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  }, [isDarkMode]);

  return (
    <div className="relative h-screen w-full bg-[#F6F8FB] dark:bg-[#0B0F17] max-w-md mx-auto overflow-hidden flex flex-col justify-between font-sans transition-colors">
      {/* Real Interactive Leaflet Map Container */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0 h-full w-full" />

      {/* Top Floating Glass Banner: Provider, ETA, Distance, Category & GPS status */}
      <div className="relative z-20 pt-[calc(env(safe-area-inset-top)+1.25rem)] px-4 flex items-center space-x-2">
        <button
          onClick={onBack || onCancelRequest}
          className="px-3 py-2 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md rounded-xl text-slate-800 dark:text-white float-shadow hover:bg-white dark:hover:bg-[#1A2333] transition-colors border border-slate-200/80 dark:border-white/10 text-xs font-semibold flex items-center space-x-1 shrink-0"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-slate-700 dark:text-slate-200" />
          <span>Back</span>
        </button>

        <motion.div
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex-1 min-w-0 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md p-3 rounded-2xl float-shadow flex items-center justify-between border border-slate-200/80 dark:border-white/10"
        >
          <div className="min-w-0 pr-2">
            <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-500 dark:text-[#94A3B8]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>GPS Active • {bookingRequest.categoryTitle}</span>
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white truncate mt-0.5">
              {provider.name}
            </div>
            <div className="text-xs font-medium text-[#27C2D4] dark:text-[#2EC5F4]">
              {etaMins === 0 ? 'Arriving now' : `ETA ${etaMins} mins • ${distanceKm} km`}
            </div>
          </div>

          <button
            onClick={() => {
              setAutoFitActive(true);
              handleFitBounds(mapInstanceRef.current, true);
            }}
            className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 text-xs font-semibold shrink-0 border ${
              autoFitActive
                ? 'bg-slate-900 dark:bg-[#2EC5F4] text-white dark:text-slate-900 border-slate-900 dark:border-[#2EC5F4] shadow-sm'
                : 'bg-slate-100 dark:bg-[#1A2333] text-slate-700 dark:text-[#C7D2E0] border-slate-200 dark:border-white/10 hover:bg-slate-200'
            }`}
            title="Recenter and fit route"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400 dark:text-slate-900" />
            <span className="text-[11px]">Fit</span>
          </button>
        </motion.div>
      </div>

      {/* Bottom Floating Provider Card Sheet */}
      <div className="relative z-20 pb-8 px-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-[#1A2333] p-5 rounded-[32px] float-shadow space-y-4 border border-slate-100 dark:border-white/10 transition-colors"
        >
          {/* Provider Details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="relative">
                <img
                  src={provider.avatarUrl}
                  alt={provider.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-2xl object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-[#27C2D4] dark:bg-[#2EC5F4] text-white p-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-base">{provider.name}</h3>
                <p className="text-xs text-slate-400 dark:text-[#94A3B8] font-sans">{provider.vehicle}</p>
                <div className="flex items-center space-x-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>On schedule • ★{provider.rating}</span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${provider.phone}`}
              className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center float-shadow hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            >
              <Phone className="w-6 h-6" />
            </a>
          </div>

          {/* Quick Actions Row */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={onOpenChat}
              className="py-3.5 bg-[#27C2D4]/10 dark:bg-[#2EC5F4]/20 text-[#27C2D4] dark:text-[#2EC5F4] font-semibold rounded-[20px] text-xs flex items-center justify-center space-x-2 hover:bg-[#27C2D4]/20 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat with {provider.name.split(' ')[0]}</span>
            </button>

            <button
              onClick={onCancelRequest}
              className="py-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold rounded-[20px] text-xs flex items-center justify-center space-x-1.5 hover:bg-rose-100 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel Booking</span>
            </button>
          </div>

          {/* Simulated Complete Job Button for testing complete lifecycle */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/10 text-center">
            <button
              onClick={onCompleteJob}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-[20px] text-xs float-shadow flex items-center justify-center space-x-2 active:scale-[0.98] transition-transform"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Simulate Job Completion (Test Flow)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

