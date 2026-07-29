import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShieldCheck, Clock, Star, Navigation, X } from 'lucide-react';
import { ServiceProvider, ServiceCategory } from '../types';
import L from 'leaflet';

interface SearchingScreenProps {
  category: ServiceCategory;
  availableProviders: ServiceProvider[];
  onProviderFound: (provider: ServiceProvider) => void;
  onCancel: () => void;
}

export const SearchingScreen: React.FC<SearchingScreenProps> = ({
  category,
  availableProviders,
  onProviderFound,
  onCancel,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const pulseCircleRef = useRef<L.Circle | null>(null);

  const [currentStage, setCurrentStage] = useState<number>(0);

  // Matched primary provider
  const matchedProvider: ServiceProvider = availableProviders[0] || {
    id: 'prov_john',
    name: 'John Smith',
    category: category.title,
    rating: 4.9,
    reviewsCount: 142,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    distanceKm: 2.4,
    estimatedArrivalMins: 8,
    hourlyRate: 60.00,
    verified: true,
    phone: '+1 (555) 987-6543',
    completedJobs: 310,
    location: { lat: -26.1980, lng: 28.0530 },
    bio: 'Master Certified Specialist',
    specialties: ['Emergency Repair', 'Diagnostics'],
    vehicle: 'White Transit Van (#iServe-78)'
  };

  // Coordinates
  const userLat = -26.2041;
  const userLng = 28.0473;

  // Nearby simulated provider positions around customer
  const nearbyProvidersCoords = [
    { id: '1', lat: -26.1980, lng: 28.0530, avatar: matchedProvider.avatarUrl, name: matchedProvider.name, isTarget: true },
    { id: '2', lat: -26.2110, lng: 28.0410, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', name: 'Sarah M.', isTarget: false },
    { id: '3', lat: -26.1990, lng: 28.0390, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', name: 'David K.', isTarget: false },
  ];

  // Initialize interactive background Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLat, userLng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: false,
        doubleClickZoom: false,
      });

      // Dark map tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Customer Location Marker with pulsing ring
      const userDivIcon = L.divIcon({
        className: 'custom-user-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-12 h-12 rounded-full bg-cyan-400/20 animate-ping"></div>
            <div class="w-8 h-8 bg-gradient-to-tr from-[#27C2D4] via-[#3F73C7] to-[#4340A8] border-2 border-white rounded-full shadow-2xl flex items-center justify-center">
              <div class="w-3 h-3 bg-white rounded-full shadow"></div>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      L.marker([userLat, userLng], { icon: userDivIcon }).addTo(map);

      // Animated search radius circle expanding from customer
      const searchCircle = L.circle([userLat, userLng], {
        radius: 600,
        color: '#27C2D4',
        weight: 1.5,
        fillColor: '#27C2D4',
        fillOpacity: 0.08,
      }).addTo(map);

      pulseCircleRef.current = searchCircle;

      // Nearby Provider Nodes on Map
      nearbyProvidersCoords.forEach((p) => {
        const provDivIcon = L.divIcon({
          className: 'custom-prov-node',
          html: `
            <div class="relative flex items-center justify-center group">
              <div class="absolute w-9 h-9 rounded-full ${p.isTarget ? 'bg-cyan-400/30 animate-ping' : 'bg-slate-700/30'}"></div>
              <div class="w-8 h-8 bg-slate-900 border-2 ${p.isTarget ? 'border-[#27C2D4]' : 'border-slate-600'} rounded-full shadow-xl overflow-hidden p-0.5 transition-transform duration-300 transform group-hover:scale-110">
                <img src="${p.avatar}" class="w-full h-full rounded-full object-cover" />
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        L.marker([p.lat, p.lng], { icon: provDivIcon }).addTo(map);
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          // ignore
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle stage 2+ polyline connection & zoom when accepted
  useEffect(() => {
    if (currentStage >= 2 && mapInstanceRef.current && !polylineRef.current) {
      const target = nearbyProvidersCoords[0];
      const polyline = L.polyline(
        [
          [target.lat, target.lng],
          [userLat + 0.002, userLng + 0.003],
          [userLat, userLng],
        ],
        {
          color: '#27C2D4',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 8',
          lineCap: 'round',
        }
      ).addTo(mapInstanceRef.current);

      polylineRef.current = polyline;
    }

    // When accepted (stage 4): Glow polyline and zoom smoothly to include both customer and provider
    if (currentStage >= 4 && polylineRef.current && mapInstanceRef.current) {
      polylineRef.current.setStyle({ color: '#10B981', weight: 5, dashArray: undefined });

      try {
        mapInstanceRef.current.fitBounds(polylineRef.current.getBounds(), {
          padding: [70, 70],
          animate: true,
          duration: 1.0,
        });
      } catch (e) {
        // safe fallback
      }
    }
  }, [currentStage]);

  // Stage timeline sequence
  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStage(1), 1200); // Searching nearby
    const t2 = setTimeout(() => setCurrentStage(2), 2500); // Contacting provider
    const t3 = setTimeout(() => setCurrentStage(3), 3800); // Waiting for response
    const t4 = setTimeout(() => {
      setCurrentStage(4); // Accepted!
      import('../utils/notifications').then(({ sendPushNotification }) => {
        sendPushNotification("Provider Accepted!", {
          body: `${matchedProvider.name} has accepted your request.`,
        });
      });
    }, 5000); 
    const t5 = setTimeout(() => {
      onProviderFound(matchedProvider);
    }, 5800); // Transition into live map after 800ms of Accepted status

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [matchedProvider, onProviderFound]);

  const categoryTitle = category.title;
  const categoryLower = categoryTitle.toLowerCase();
  const article = ['A', 'E', 'I', 'O', 'U'].includes(categoryTitle[0]?.toUpperCase() || 'E') ? 'an' : 'a';

  // Humanized progress steps
  const humanSteps = [
    `Finding the closest ${categoryLower}...`,
    `8 ${categoryLower}s available nearby`,
    `Matching you with highest-rated provider`,
    `Contacting ${matchedProvider.name}...`,
    `Waiting for confirmation...`,
    `${matchedProvider.name} accepted your request`,
  ];

  // Dynamic status text for the single Provider Card
  const getCardStatus = () => {
    if (currentStage === 0) return { label: 'Searching...', color: 'text-[#27C2D4] bg-cyan-500/10 border-cyan-500/30' };
    if (currentStage === 1) return { label: 'Matching...', color: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30' };
    if (currentStage === 2) return { label: 'Contacting...', color: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30' };
    if (currentStage === 3) return { label: 'Waiting...', color: 'text-amber-300 bg-amber-500/10 border-amber-500/30' };
    return { label: 'Accepted ✓', color: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40' };
  };

  const cardStatus = getCardStatus();

  // Timeline header steps
  const timelineIndex = currentStage < 2 ? 0 : currentStage < 4 ? 1 : 2;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between px-5 pb-5 pt-[calc(env(safe-area-inset-top)+1.25rem)] max-w-md mx-auto relative overflow-hidden font-sans select-none">
      {/* Background Interactive Leaflet Map Layer */}
      <div className="absolute inset-0 z-0">
        <div ref={mapContainerRef} className="w-full h-full opacity-90" />
        {/* Subtle Dark Vignette & Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/50 to-slate-950/95 pointer-events-none" />
      </div>

      {/* Top Bar Navigation & Hero Header */}
      <div className="pt-6 z-10 space-y-4">
        {/* Horizontal Progress Timeline */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 flex items-center justify-between text-[11px] font-medium text-slate-400 shadow-xl">
          {[
            { label: 'Searching', stepIdx: 0 },
            { label: 'Contacting', stepIdx: 1 },
            { label: 'Accepted', stepIdx: 2 },
            { label: 'Tracking', stepIdx: 3 },
          ].map((item, idx) => {
            const isDone = timelineIndex > item.stepIdx;
            const isCurrent = timelineIndex === item.stepIdx;
            return (
              <React.Fragment key={item.label}>
                <div className="flex items-center space-x-1.5">
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      isDone
                        ? 'bg-emerald-400 scale-110'
                        : isCurrent
                        ? 'bg-gradient-to-r from-[#27C2D4] to-[#3F73C7] ring-4 ring-[#27C2D4]/20 scale-125'
                        : 'bg-slate-700'
                    }`}
                  />
                  <span
                    className={`transition-colors ${
                      isDone
                        ? 'text-emerald-400 font-semibold'
                        : isCurrent
                        ? 'text-white font-semibold'
                        : 'text-slate-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div
                    className={`flex-1 h-[1.5px] mx-1 transition-colors duration-500 ${
                      timelineIndex > idx ? 'bg-gradient-to-r from-[#27C2D4] to-[#3F73C7]' : 'bg-slate-800'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-1">
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-serif font-normal text-white tracking-tight"
          >
            Finding {article} {categoryTitle}
          </motion.h1>
          <p className="text-xs text-slate-300 font-sans max-w-xs mx-auto leading-relaxed">
            We’re contacting the closest available professionals near you.
          </p>
          <span className="inline-block text-[11px] text-cyan-300/90 font-medium pt-0.5">
            Average response time: under 30 seconds
          </span>
        </div>
      </div>

      {/* SINGLE DYNAMIC PROVIDER CARD (Updated smoothly across stages) */}
      <div className="my-auto z-10 py-4">
        <motion.div
          key="single-provider-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-[24px] p-4 shadow-2xl space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={matchedProvider.avatarUrl}
                  alt={matchedProvider.name}
                  className={`w-13 h-13 rounded-full object-cover border-2 transition-colors duration-500 ${
                    currentStage >= 4 ? 'border-emerald-400' : 'border-[#27C2D4]'
                  } shadow-md`}
                />
                <span
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-slate-900 rounded-full transition-colors duration-500 ${
                    currentStage >= 4 ? 'bg-emerald-500' : 'bg-cyan-400 animate-pulse'
                  }`}
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-sm font-semibold text-white truncate">{matchedProvider.name}</h3>
                  {matchedProvider.verified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#27C2D4] shrink-0" />
                  )}
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                  <span className="flex items-center text-amber-400 font-medium">
                    <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                    {matchedProvider.rating}
                  </span>
                  <span>•</span>
                  <span>{matchedProvider.distanceKm} km away</span>
                </div>
                <div className="flex items-center space-x-1 text-[11px] text-slate-300 mt-0.5">
                  <Clock className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>Estimated arrival: {matchedProvider.estimatedArrivalMins} min</span>
                </div>
              </div>
            </div>

            {/* Dynamic Status Pill */}
            <div className="shrink-0 pl-2">
              <motion.div
                key={cardStatus.label}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={`border px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 shadow-lg ${cardStatus.color}`}
              >
                {currentStage >= 4 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                )}
                <span>{cardStatus.label}</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Live Status Updates Feed */}
      <div className="z-10 space-y-3 mb-2">
        <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 p-4 rounded-[24px] space-y-2.5 shadow-2xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            Status Updates
          </div>

          <div className="space-y-2 text-xs font-sans">
            {humanSteps.map((stepText, idx) => {
              const isDone = currentStage > Math.floor(idx / 1.3);
              const isCurrent = currentStage === Math.floor(idx / 1.3);
              if (idx > currentStage + 2) return null; // reveal step by step

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between"
                >
                  <span
                    className={`flex items-center space-x-2.5 ${
                      isDone
                        ? 'text-emerald-400 font-medium'
                        : isCurrent
                        ? 'text-white font-semibold'
                        : 'text-slate-500'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0 ml-1 mr-1" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-800 shrink-0" />
                    )}
                    <span>{stepText}</span>
                  </span>

                  {isDone && <span className="text-[10px] text-emerald-500 font-mono font-bold">✓</span>}
                  {isCurrent && (
                    <span className="text-[10px] text-cyan-400 font-mono animate-pulse font-medium">ACTIVE</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions: Single Subtle Cancel Button */}
        <button
          onClick={onCancel}
          className="w-full py-3.5 border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:text-white rounded-[22px] text-xs font-semibold backdrop-blur-md transition-all active:scale-[0.98] shadow-lg flex items-center justify-center space-x-2"
        >
          <X className="w-3.5 h-3.5 text-slate-400" />
          <span>Cancel Request</span>
        </button>
      </div>
    </div>
  );
};

