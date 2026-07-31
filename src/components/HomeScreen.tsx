import React, { useState, useMemo } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { ServiceCategory, ServiceProvider, UserProfile, ServiceBookingRequest, SubService } from '../types';
import { ServiceGrid } from './ServiceGrid';

interface HomeScreenProps {
  user: UserProfile;
  categories: ServiceCategory[];
  providers: ServiceProvider[];
  recentRequests: ServiceBookingRequest[];
  activeRequest?: ServiceBookingRequest | null;
  onSelectCategory: (cat: ServiceCategory, subService?: SubService) => void;
  onSelectProvider: (provider: ServiceProvider) => void;
  onRequestEmergency: () => void;
  onOpenSearch: () => void;
  onViewRequestDetails: (req: ServiceBookingRequest) => void;
  onTrackLive?: (req: ServiceBookingRequest) => void;
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
  onTrackLive,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 17) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  // Flatten and search matching individual services across all categories
  const matchingServices = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const results: { category: ServiceCategory; service: SubService }[] = [];

    categories.forEach((cat) => {
      const subList: SubService[] = cat.subServices || cat.popularServices.map((srv, idx) => ({
        id: `${cat.id}_sub_${idx}`,
        name: srv,
        description: `Professional ${srv.toLowerCase()} performed by certified experts.`,
        price: cat.priceStarting + (idx * 150),
        currencySymbol: 'R',
        estimatedDuration: cat.estimatedDuration,
      }));

      subList.forEach((sub) => {
        if (
          sub.name.toLowerCase().includes(q) ||
          cat.title.toLowerCase().includes(q)
        ) {
          results.push({ category: cat, service: sub });
        }
      });
    });

    return results;
  }, [searchQuery, categories]);

  return (
    <div className="pb-28 pt-[calc(env(safe-area-inset-top)+1rem)] px-4 max-w-md mx-auto space-y-5 font-sans">
      {/* 1. Header: Time-based Greeting without profile photo */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#7F8DA8] font-sans">
          {getGreeting()}
        </span>
        <h2 className="text-xl font-serif text-slate-900 dark:text-white font-normal">
          {user.name}
        </h2>
      </div>

      {/* 2. Search Field */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400 dark:text-[#7F8DA8]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search electricians, plumbers, cleaning..."
          className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#131E33] border border-transparent dark:border-white/[0.06] rounded-[24px] text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#7F8DA8] card-shadow focus:outline-none focus:ring-2 focus:ring-[#27C2D4]/40 dark:focus:ring-[#21C7F6]/40 font-sans transition-colors"
        />
      </div>

      {/* 3. Persistent Active Service Tracking Card - Placed BEFORE Service Categories Grid */}
      {activeRequest && ['searching', 'pending', 'accepted', 'on_the_way', 'arrived', 'in_progress'].includes(activeRequest.status) && (
        <div
          onClick={() => onViewRequestDetails(activeRequest)}
          className="bg-white dark:bg-[#131E33] p-3.5 rounded-[22px] border border-slate-200/80 dark:border-white/[0.06] card-shadow text-slate-900 dark:text-white cursor-pointer space-y-2.5 hover:border-[#27C2D4]/40 transition-all"
        >
          {/* Status Row */}
          <div className="flex items-center justify-between text-xs font-medium">
            <div className="flex items-center space-x-1.5 text-slate-800 dark:text-[#B8C3D9]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0 animate-pulse" />
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
                  if (onTrackLive) {
                    onTrackLive(activeRequest);
                  } else {
                    onViewRequestDetails(activeRequest);
                  }
                }}
                className="px-3 py-1.5 bg-[#27C2D4] dark:bg-[#21C7F6] hover:bg-[#20b2c3] text-white dark:text-[#070B14] text-xs font-semibold rounded-xl flex items-center space-x-1 transition-transform active:scale-95 cursor-pointer"
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

      {/* 4. Category Grid or Individual Search Results */}
      {searchQuery.trim() ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#7F8DA8] font-sans">
              Services Matching "{searchQuery}" ({matchingServices.length})
            </h3>
          </div>

          {matchingServices.length === 0 ? (
            <div className="bg-white dark:bg-[#131E33] p-8 rounded-[24px] text-center text-slate-400 dark:text-[#7F8DA8] text-xs card-shadow border border-transparent dark:border-white/[0.06]">
              No matching services found.
            </div>
          ) : (
            <div className="space-y-2.5">
              {matchingServices.map(({ category, service }) => {
                const symbol = service.currencySymbol || 'R';
                return (
                  <div
                    key={`${category.id}_${service.id}`}
                    onClick={() => onSelectCategory(category, service)}
                    className="bg-white dark:bg-[#131E33] p-4 rounded-[20px] card-shadow border border-slate-100/80 dark:border-white/[0.06] flex items-center justify-between hover:border-[#27C2D4]/50 dark:hover:border-[#21C7F6]/50 transition-all cursor-pointer group"
                  >
                    <div className="pr-3">
                      <span className="text-[10px] font-semibold text-[#27C2D4] dark:text-[#21C7F6] uppercase tracking-wider block mb-0.5">
                        {category.title}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-[#27C2D4] dark:group-hover:text-[#21C7F6] transition-colors">
                        {service.name}
                      </h4>
                      <span className="text-sm font-serif font-semibold text-[#3F73C7] dark:text-[#21C7F6] block mt-0.5">
                        {symbol}{service.price}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCategory(category, service);
                      }}
                      className="px-3 py-1.5 bg-[#27C2D4] dark:bg-[#21C7F6] hover:bg-[#20b2c3] text-white dark:text-[#070B14] text-xs font-semibold rounded-full shadow-sm active:scale-95 transition-all flex items-center space-x-1 shrink-0 cursor-pointer"
                    >
                      <span>Request Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div>
          <ServiceGrid 
            categories={categories} 
            onSelectCategory={onSelectCategory} 
          />
        </div>
      )}
    </div>
  );
};
