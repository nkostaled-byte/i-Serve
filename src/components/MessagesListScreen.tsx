import React from 'react';
import { motion } from 'motion/react';
import { ServiceProvider } from '../types';
import { ArrowLeft, MessageSquare, ChevronRight, ShieldCheck } from 'lucide-react';

interface MessagesListScreenProps {
  providers: ServiceProvider[];
  onOpenChat: (provider: ServiceProvider) => void;
  onBack: () => void;
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

export const MessagesListScreen: React.FC<MessagesListScreenProps> = ({
  providers,
  onOpenChat,
  onBack,
}) => {
  return (
    <div className="pb-28 pt-4 px-4 max-w-md mx-auto space-y-6 font-sans">
      <div className="flex items-center space-x-3">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-white dark:bg-[#131E33] rounded-full flex items-center justify-center text-slate-700 dark:text-white card-shadow hover:bg-slate-50 dark:hover:bg-[#17243C] transition-colors border border-transparent dark:border-white/[0.06]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#27C2D4] dark:text-[#21C7F6]">
            Direct Messaging
          </span>
          <h1 className="text-2xl font-serif text-slate-900 dark:text-white font-normal">
            Messages & Inquiries
          </h1>
        </div>
      </div>

      <div className="space-y-3">
        {providers.map((prov) => (
          <div
            key={prov.id}
            onClick={() => onOpenChat(prov)}
            className="bg-white dark:bg-[#131E33] p-4 rounded-[24px] card-shadow cursor-pointer flex items-center justify-between hover:border-[#27C2D4]/30 dark:hover:border-[#21C7F6]/30 border border-transparent dark:border-white/[0.06] transition-all"
          >
            <div className="flex items-center space-x-3.5">
              <div className="relative">
                <img
                  src={prov.avatarUrl}
                  alt={prov.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#131E33]" />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-slate-800 dark:text-white text-sm">{prov.name}</h3>
                  <span className="text-[10px] bg-[#27C2D4]/10 dark:bg-[#21C7F6]/20 text-[#27C2D4] dark:text-[#21C7F6] px-2 py-0.5 rounded-full font-medium">
                    {prov.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-[#B8C3D9] mt-0.5 line-clamp-1">
                  "Understood! I have a full kit with copper spares."
                </p>
              </div>
            </div>

            <div className="w-8 h-8 bg-slate-50 dark:bg-[#17243C] rounded-full flex items-center justify-center text-slate-400 dark:text-[#7F8DA8]">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
