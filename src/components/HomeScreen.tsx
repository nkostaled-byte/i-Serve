import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Siren, Star, ShieldCheck, MapPin, Clock, ArrowRight, Filter, ChevronRight } from 'lucide-react';
import { ServiceCategory, ServiceProvider, UserProfile, ServiceBookingRequest } from '../types';
import { ServiceGrid } from './ServiceGrid';

interface HomeScreenProps {
  user: UserProfile;
  categories: ServiceCategory[];
  providers: ServiceProvider[];
  recentRequests: ServiceBookingRequest[];
  activeRequest?: ServiceBookingRequest | null;
  onSelectCategory: (cat: ServiceCategory) => void;
  onSelectProvider: (provider: ServiceProvider) => void;
  onRequestEmergency: () => void;
  onOpenSearch: () => void;
  onViewRequestDetails: (req: ServiceBookingRequest) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  categories,
  providers,
  recentRequests,
  activeRequest,
  onSelectCategory,
  onSelectProvider,
  onRequestEmergency,
  onOpenSearch,
  onViewRequestDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [heroAnimated, setHeroAnimated] = useState(false);

  const filteredCategories = searchQuery.trim() 
    ? categories.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.popularServices.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())))
    : categories;

  return (
    <div className="pb-28 pt-4 px-4 max-w-md mx-auto space-y-6">
      {/* 1. Header: Good Morning + Profile Photo */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#7F8DA8] font-sans">
            Good Morning,
          </span>
          <h2 className="text-xl font-serif text-slate-900 dark:text-white font-normal">
            {user.name}
          </h2>
        </div>
        <div className="relative">
          <img
            src={user.avatarUrl}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full object-cover float-shadow border-2 border-white dark:border-[#131E33] cursor-pointer"
          />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#131E33]" />
        </div>
      </div>

      {/* 2. Large Editorial Heading */}
      <div className="space-y-1">
        <h1 className="text-3xl font-serif text-slate-900 dark:text-white leading-tight font-normal">
          What do you need help with today?
        </h1>
      </div>

      {/* 3. Large Search Field */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-4 text-slate-400 dark:text-[#7F8DA8]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search electricians, plumbers, cleaning..."
          className="w-full pl-11 pr-12 py-3.5 bg-white dark:bg-[#131E33] border border-transparent dark:border-white/[0.06] rounded-[24px] text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#7F8DA8] card-shadow focus:outline-none focus:ring-2 focus:ring-[#27C2D4]/40 dark:focus:ring-[#21C7F6]/40 font-sans transition-colors"
        />
        <button 
          onClick={onOpenSearch}
          className="absolute right-3 top-2.5 w-9 h-9 bg-slate-100 dark:bg-[#17243C] text-slate-600 dark:text-[#B8C3D9] rounded-full flex items-center justify-center hover:bg-[#27C2D4] dark:hover:bg-[#21C7F6] hover:text-white dark:hover:text-[#070B14] transition-colors"
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* 4. Emergency Service Hero Card - Brand Gradient */}
      <div
        onClick={onRequestEmergency}
        className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-[#3F73C7] to-[#27C2D4] text-white p-5 rounded-[28px] float-shadow cursor-pointer active:scale-[0.98] transition-transform"
      >
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shrink-0">
              <Siren className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-200 bg-white/10 px-2.5 py-0.5 rounded-full">
                24/7 Priority Dispatch
              </span>
              <h3 className="text-base font-semibold mt-1 font-normal text-white">
                Emergency Service
              </h3>
              <p className="text-xs text-cyan-100 font-sans">
                Water leak, short circuit, or lockout? Response in &lt;10 mins.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-semibold">
          <span className="flex items-center space-x-1 text-cyan-100">
            <Clock className="w-3.5 h-3.5" />
            <span>Avg Arrival: 8 Mins</span>
          </span>
          <span className="bg-white text-slate-900 px-3 py-1.5 rounded-full flex items-center space-x-1 hover:bg-cyan-50 transition-colors">
            <span>Request Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* 4b. Persistent Active Service Tracking Card - Lightweight & Refined */}
      {activeRequest && ['searching', 'pending', 'accepted', 'on_the_way', 'arrived', 'in_progress'].includes(activeRequest.status) && (
        <div
          onClick={() => onViewRequestDetails(activeRequest)}
          className="bg-white dark:bg-[#131E33] p-3.5 rounded-[22px] border border-slate-200/80 dark:border-white/[0.06] card-shadow text-slate-900 dark:text-white cursor-pointer space-y-2.5 hover:border-[#27C2D4]/40 transition-all"
        >
          {/* Status Row */}
          <div className="flex items-center justify-between text-xs font-medium">
            <div className="flex items-center space-x-1.5 text-slate-800 dark:text-[#B8C3D9]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
              <span className="font-semibold text-[#1E293B] dark:text-white">Live Service</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-[#7F8DA8]">
              {activeRequest.provider ? `${activeRequest.provider.distanceKm} km away` : 'Connecting...'}
            </span>
          </div>

          {/* Provider & Action */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={activeRequest.provider?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                  alt={activeRequest.provider?.name || activeRequest.categoryTitle}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-xl object-cover border border-slate-100 dark:border-white/10"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug truncate">
                  {activeRequest.categoryTitle}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-[#B8C3D9] truncate">
                  {activeRequest.provider ? activeRequest.provider.name : 'Searching nearby professional'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-[#B8C3D9] bg-slate-100 dark:bg-[#17243C] px-2.5 py-1 rounded-lg">
                ETA ~{activeRequest.provider?.estimatedArrivalMins || 10}m
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewRequestDetails(activeRequest);
                }}
                className="px-3 py-1.5 bg-[#27C2D4] dark:bg-[#21C7F6] hover:bg-[#20b2c3] text-white dark:text-[#070B14] text-xs font-semibold rounded-xl flex items-center space-x-1 transition-transform active:scale-95"
              >
                <span>Track</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Smooth Progress Indicator Bar */}
          <div className="w-full bg-slate-100 dark:bg-[#0E1628] h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#27C2D4] dark:bg-[#21C7F6] rounded-full transition-all duration-600"
              style={{
                width: activeRequest.status === 'in_progress' ? '85%' :
                       activeRequest.status === 'arrived' ? '65%' :
                       activeRequest.status === 'on_the_way' ? '45%' :
                       activeRequest.status === 'accepted' ? '30%' : '15%'
              }}
            />
          </div>
        </div>
      )}

      {/* 5. 3x3 Service Grid */}
      <div>
        <ServiceGrid 
          categories={filteredCategories} 
          onSelectCategory={onSelectCategory} 
        />
      </div>

      {/* 6. Nearby Professionals */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif text-slate-900 dark:text-white font-normal">
              Nearby Professionals
            </h2>
            <p className="text-xs text-slate-400 dark:text-[#7F8DA8] font-sans">
              Top rated & active within {user.location}
            </p>
          </div>
          <button className="text-xs font-semibold text-[#27C2D4] dark:text-[#21C7F6] hover:underline">
            See all
          </button>
        </div>

        <div className="space-y-3">
          {providers.map((prov, i) => (
            <div
              key={prov.id}
              onClick={() => onSelectProvider(prov)}
              className="bg-white dark:bg-[#131E33] p-4 rounded-[24px] card-shadow cursor-pointer flex items-center justify-between hover:border-[#27C2D4]/20 border border-transparent dark:border-white/[0.06] transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="relative">
                  <img
                    src={prov.avatarUrl}
                    alt={prov.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover"
                  />
                  {prov.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-[#27C2D4] dark:bg-[#21C7F6] text-white dark:text-[#070B14] p-1 rounded-full">
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{prov.name}</h3>
                    <span className="text-[10px] bg-slate-100 dark:bg-[#0E1628] text-slate-600 dark:text-[#B8C3D9] px-2 py-0.5 rounded-full font-medium">
                      {prov.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-[#B8C3D9] mt-1 font-sans">
                    <span className="flex items-center text-amber-500 font-medium">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                      {prov.rating} ({prov.reviewsCount})
                    </span>
                    <span className="flex items-center text-slate-400 dark:text-[#7F8DA8]">
                      <MapPin className="w-3.5 h-3.5 mr-0.5" />
                      {prov.distanceKm} km away
                    </span>
                  </div>

                  <p className="text-[11px] text-emerald-600 dark:text-[#2DD36F] font-medium mt-0.5">
                    Arrives in ~{prov.estimatedArrivalMins} mins • ${prov.hourlyRate}/hr
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 bg-slate-50 dark:bg-[#0E1628] rounded-full flex items-center justify-center text-slate-400 dark:text-[#7F8DA8]">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Recent Requests */}
      {recentRequests.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif text-slate-900 dark:text-white font-normal">
              Recent Requests
            </h2>
          </div>

          <div className="space-y-3">
            {recentRequests.map((req, i) => (
              <div 
                key={req.id}
                onClick={() => onViewRequestDetails(req)}
                className="bg-white dark:bg-[#131E33] p-4 rounded-[24px] card-shadow cursor-pointer flex items-center justify-between border border-transparent dark:border-white/[0.06]"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="font-semibold text-slate-800 dark:text-white text-sm">{req.categoryTitle}</h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#B8C3D9] mt-1">{req.address}</p>
                  <span className="text-[11px] text-[#27C2D4] dark:text-[#21C7F6] font-medium capitalize mt-0.5 block">
                    Status: {req.status.replace('_', ' ')} • {req.createdAt}
                  </span>
                </div>
                <button className="px-3 py-1.5 bg-[#27C2D4]/10 dark:bg-[#21C7F6]/20 text-[#27C2D4] dark:text-[#21C7F6] text-xs font-semibold rounded-full">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Editorial Recommendations Banner */}
      <div className="bg-gradient-to-r from-[#3F73C7] to-[#4340A8] text-white p-6 rounded-[28px] float-shadow space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300">
          Curated Home Protection
        </span>
        <h3 className="text-xl font-serif font-normal">
          Annual Safety & Wiring Inspection
        </h3>
        <p className="text-xs text-slate-200 font-sans leading-relaxed">
          Get a comprehensive certified audit of your home breaker board and plumbing connections.
        </p>
      </div>
    </div>
  );
};
