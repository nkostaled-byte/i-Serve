import React from 'react';
import { motion } from 'motion/react';
import { ServiceBookingRequest } from '../types';
import { Clock, MapPin, CheckCircle, ChevronRight } from 'lucide-react';

interface RequestsHistoryScreenProps {
  requests: ServiceBookingRequest[];
  onSelectRequest: (req: ServiceBookingRequest) => void;
  onBack?: () => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const RequestsHistoryScreen: React.FC<RequestsHistoryScreenProps> = ({
  requests,
  onSelectRequest,
}) => {
  return (
    <div className="pb-28 pt-[calc(env(safe-area-inset-top)+1rem)] px-4 max-w-md mx-auto space-y-6 font-sans">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#27C2D4] dark:text-[#21C7F6]">
          Booking History
        </span>
        <h1 className="text-2xl font-serif text-slate-900 dark:text-white font-normal">
          Your Service Requests
        </h1>
      </div>

      <div className="space-y-3">
        {requests.map((req) => (
          <div
            key={req.id}
            onClick={() => onSelectRequest(req)}
            className="bg-white dark:bg-[#131E33] p-4 rounded-[24px] card-shadow cursor-pointer space-y-3 hover:border-[#27C2D4]/30 dark:hover:border-[#21C7F6]/30 border border-transparent dark:border-white/[0.06] transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#27C2D4] dark:text-[#21C7F6] bg-[#27C2D4]/10 dark:bg-[#21C7F6]/20 px-2.5 py-0.5 rounded-full">
                {req.categoryTitle}
              </span>
              <span className="text-sm font-serif font-semibold text-slate-900 dark:text-white">
                ${req.amount.toFixed(2)}
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-slate-400 dark:text-[#7F8DA8] shrink-0" />
                <p className="text-xs font-semibold text-slate-800 dark:text-white">{req.address}</p>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-[#7F8DA8] mt-1 pl-6">"{req.notes}"</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/[0.06] text-xs">
              <span className="flex items-center space-x-1 text-emerald-600 dark:text-[#2DD36F] font-medium capitalize">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Status: {req.status.replace('_', ' ')}</span>
              </span>

              <span className="text-slate-400 dark:text-[#7F8DA8] font-sans flex items-center">
                {req.createdAt} <ChevronRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
