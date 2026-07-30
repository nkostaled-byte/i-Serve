import React from 'react';
import { X, ShieldCheck, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { ServiceCategory, SubService } from '../types';
import { ServiceIllustration } from './ServiceIllustrations';

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
  // Use subServices array or fallback generated from popularServices
  const subServicesList: SubService[] = category.subServices || category.popularServices.map((srv, idx) => ({
    id: `${category.id}_sub_${idx}`,
    name: srv,
    description: `Professional ${srv.toLowerCase()} performed by vetted, certified experts.`,
    price: category.priceStarting + (idx * 150),
    currencySymbol: 'R',
    estimatedDuration: category.estimatedDuration,
  }));

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        className="bg-[#F6F8FB] dark:bg-[#070B14] w-full max-w-md h-[90vh] sm:h-[85vh] rounded-t-[32px] sm:rounded-[32px] flex flex-col justify-between overflow-hidden relative shadow-2xl border border-transparent dark:border-white/[0.06]"
      >
        {/* Top Header Controls */}
        <div className="p-4 flex items-center justify-end z-10 absolute top-0 left-0 right-0">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/80 dark:bg-[#131E33]/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 dark:text-white card-shadow hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto no-scrollbar flex-1 pb-6">
          {/* Hero Illustration Header */}
          <div className="bg-gradient-to-br from-[#27C2D4] via-[#3F73C7] to-[#4340A8] dark:from-[#17243C] dark:via-[#131E33] dark:to-[#0E1628] p-8 pt-16 text-center text-white relative">
            <div className="w-28 h-28 mx-auto mb-4 flex items-center justify-center">
              <ServiceIllustration categoryKey={category.illustrationKey} className="w-28 h-28 drop-shadow-xl" />
            </div>
            <h1 className="text-3xl font-serif font-normal">{category.title} Services</h1>
            <p className="text-xs text-cyan-100 dark:text-[#B8C3D9] font-sans mt-1 max-w-xs mx-auto leading-relaxed">
              {category.description}
            </p>
          </div>

          <div className="p-5 space-y-5">
            {/* Guarantee Pills */}
            <div className="bg-white dark:bg-[#131E33] p-4 rounded-[24px] card-shadow space-y-2 border border-transparent dark:border-white/[0.06]">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-[#27C2D4] dark:text-[#21C7F6]" />
                <span>i-Serve Quality Guarantee</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-[#B8C3D9] font-sans pt-1">
                <span className="flex items-center space-x-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#2DD36F]" /> <span>Certified Local Pros</span></span>
                <span className="flex items-center space-x-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#2DD36F]" /> <span>Upfront Pricing</span></span>
                <span className="flex items-center space-x-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#2DD36F]" /> <span>Live Driver GPS</span></span>
                <span className="flex items-center space-x-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#2DD36F]" /> <span>Insured Service</span></span>
              </div>
            </div>

            {/* Dynamic List of Services */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#7F8DA8] font-sans">
                  Available Services & Repairs
                </h3>
                <span className="text-[11px] text-emerald-600 dark:text-[#2DD36F] font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                  Fast Dispatch
                </span>
              </div>

              <div className="space-y-3">
                {subServicesList.map((service) => {
                  const symbol = service.currencySymbol || 'R';
                  return (
                    <div
                      key={service.id}
                      className="bg-white dark:bg-[#131E33] p-4 rounded-[22px] card-shadow border border-slate-100/80 dark:border-white/[0.06] flex flex-col justify-between space-y-3 hover:border-[#27C2D4]/50 dark:hover:border-[#21C7F6]/50 transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white font-sans">{service.name}</h4>
                          <span className="text-base font-serif font-semibold text-[#3F73C7] dark:text-[#21C7F6] shrink-0 ml-2">
                            {symbol}{service.price}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-[#B8C3D9] font-sans mt-1 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-50 dark:border-white/[0.06] flex items-center justify-between">
                        <div className="flex items-center text-[11px] text-slate-400 dark:text-[#7F8DA8] font-medium space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-[#7F8DA8]" />
                          <span>Estimated duration: {service.estimatedDuration}</span>
                        </div>

                        <button
                          onClick={() => onProceedToRequest(service)}
                          className="px-4 py-2 bg-gradient-to-r from-[#27C2D4] to-[#3F73C7] dark:from-[#21C7F6] dark:to-[#4D5DFA] text-white dark:text-[#070B14] text-xs font-semibold rounded-full shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center space-x-1.5"
                        >
                          <span>Book Service</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
