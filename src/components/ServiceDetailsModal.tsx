import React, { useState } from 'react';
import { X, ArrowRight, Search } from 'lucide-react';
import { ServiceCategory, SubService } from '../types';

interface ServiceDetailsModalProps {
  category: ServiceCategory;
  onClose: () => void;
  onProceedToRequest: (subService?: SubService) => void;
}

export const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  category,
  onClose,
  onProceedToRequest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Use subServices array or fallback generated from popularServices
  const subServicesList: SubService[] = category.subServices || category.popularServices.map((srv, idx) => ({
    id: `${category.id}_sub_${idx}`,
    name: srv,
    description: `Professional ${srv.toLowerCase()} performed by certified experts.`,
    price: category.priceStarting + (idx * 150),
    currencySymbol: 'R',
    estimatedDuration: category.estimatedDuration,
  }));

  const filteredServices = searchQuery.trim()
    ? subServicesList.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : subServicesList;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 font-sans"
    >
      <div
        className="bg-[#F6F8FB] dark:bg-[#070B14] w-full max-w-md h-[85vh] rounded-t-[32px] sm:rounded-[32px] flex flex-col justify-between overflow-hidden relative shadow-2xl border border-transparent dark:border-white/[0.06]"
      >
        {/* Clean Header - Title & Close button without images */}
        <div className="p-5 bg-white dark:bg-[#131E33] border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between rounded-t-[32px]">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#27C2D4] dark:text-[#21C7F6] block">
              Services Category
            </span>
            <h1 className="text-xl font-serif text-slate-900 dark:text-white font-normal">
              {category.title}
            </h1>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-slate-100 dark:bg-[#17243C] rounded-full flex items-center justify-center text-slate-600 dark:text-[#B8C3D9] hover:bg-slate-200 dark:hover:bg-[#17243C]/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Search Bar inside Category Modal */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-[#7F8DA8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${category.title}...`}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#131E33] border border-slate-200 dark:border-white/[0.08] rounded-2xl text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#7F8DA8] focus:ring-2 focus:ring-[#27C2D4]/40 dark:focus:ring-[#21C7F6]/40 focus:outline-none"
            />
          </div>

          {/* Simple Services List */}
          <div className="space-y-2.5">
            {filteredServices.length === 0 ? (
              <div className="text-center py-8 text-slate-400 dark:text-[#7F8DA8] text-xs">
                No services match "{searchQuery}"
              </div>
            ) : (
              filteredServices.map((service) => {
                const symbol = service.currencySymbol || 'R';
                return (
                  <div
                    key={service.id}
                    onClick={() => onProceedToRequest(service)}
                    className="bg-white dark:bg-[#131E33] p-4 rounded-[20px] card-shadow border border-slate-100/80 dark:border-white/[0.06] flex items-center justify-between hover:border-[#27C2D4]/50 dark:hover:border-[#21C7F6]/50 transition-all cursor-pointer group"
                  >
                    <div className="pr-3">
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
                        onProceedToRequest(service);
                      }}
                      className="px-3 py-1.5 bg-[#27C2D4] dark:bg-[#21C7F6] hover:bg-[#20b2c3] text-white dark:text-[#070B14] text-xs font-semibold rounded-full shadow-sm active:scale-95 transition-all flex items-center space-x-1 shrink-0 cursor-pointer"
                    >
                      <span>Request Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
