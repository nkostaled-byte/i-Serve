import React from 'react';
import { motion } from 'motion/react';
import { Check, Star, ShieldCheck, Phone, Navigation, ArrowRight } from 'lucide-react';
import { ServiceProvider } from '../types';

interface ProviderAcceptedModalProps {
  provider: ServiceProvider;
  onTrackOnMap: () => void;
}

export const ProviderAcceptedModal: React.FC<ProviderAcceptedModalProps> = ({
  provider,
  onTrackOnMap,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ y: '100%', opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 200 }}
        className="bg-white dark:bg-[#131E33] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 text-center space-y-5 relative shadow-2xl overflow-hidden border border-transparent dark:border-white/[0.06]"
      >
        {/* Success Animated Badge */}
        <div className="relative w-20 h-20 mx-auto mt-2">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#27C2D4] to-[#3F73C7] dark:from-[#21C7F6] dark:to-[#4D5DFA] rounded-full flex items-center justify-center text-white dark:text-[#070B14] float-shadow">
            <Check className="w-10 h-10" />
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-[#27C2D4] dark:border-[#21C7F6]"
          />
        </div>

        {/* Headline */}
        <div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-[#2DD36F] uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
            Request Accepted!
          </span>
          <h2 className="text-2xl font-serif text-slate-900 dark:text-white mt-2 font-normal">
            {provider.name} has accepted your request!
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#B8C3D9] font-sans mt-1">
            He's on his way in a {provider.vehicle}.
          </p>
        </div>

        {/* Provider Profile Card */}
        <div className="bg-[#F6F8FB] dark:bg-[#0E1628] p-4 rounded-[24px] card-shadow flex items-center justify-between text-left border border-transparent dark:border-white/[0.06]">
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <img
                src={provider.avatarUrl}
                alt={provider.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#27C2D4] dark:bg-[#21C7F6] text-white dark:text-[#070B14] p-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">{provider.name}</h3>
              <p className="text-xs text-slate-500 dark:text-[#B8C3D9]">{provider.category} Specialist</p>
              <div className="flex items-center space-x-1 text-xs text-amber-500 font-medium mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{provider.rating} ({provider.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xl font-serif text-[#27C2D4] dark:text-[#21C7F6] font-normal block">
              {provider.estimatedArrivalMins} mins
            </span>
            <span className="text-[10px] text-slate-400 dark:text-[#7F8DA8] font-sans uppercase">ETA</span>
          </div>
        </div>

        {/* Track Action */}
        <button
          onClick={onTrackOnMap}
          className="w-full py-4 bg-gradient-to-r from-[#27C2D4] via-[#3F73C7] to-[#4340A8] dark:from-[#21C7F6] dark:via-[#4D5DFA] dark:to-[#3F73C7] text-white dark:text-[#070B14] font-medium rounded-[24px] float-shadow flex items-center justify-center space-x-2 text-base active:scale-[0.98] transition-transform"
        >
          <Navigation className="w-5 h-5" />
          <span>Track Live on Map</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};
