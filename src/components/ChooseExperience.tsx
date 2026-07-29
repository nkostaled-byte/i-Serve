import React from 'react';
import { motion } from 'motion/react';
import { User, Briefcase, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface ChooseExperienceProps {
  onSelectRole: (role: 'customer' | 'provider') => void;
}

export const ChooseExperience: React.FC<ChooseExperienceProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-[#F6F8FB] dark:bg-[#070B14] flex flex-col justify-between px-6 pb-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] max-w-md mx-auto relative overflow-hidden transition-colors">
      {/* Editorial Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-8 z-10"
      >
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#27C2D4]/10 dark:bg-[#21C7F6]/20 text-[#27C2D4] dark:text-[#21C7F6] rounded-full text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Welcome to i-Serve</span>
        </div>
        <h1 className="text-3xl font-serif text-slate-900 dark:text-white leading-tight font-normal">
          How would you like to continue?
        </h1>
        <p className="text-slate-500 dark:text-[#B8C3D9] text-sm mt-2 font-sans leading-relaxed">
          Choose what describes you best to unlock personalized services and real-time dispatch.
        </p>
      </motion.div>

      {/* Hero Cards Selection */}
      <div className="space-y-4 my-8 z-10">
        {/* Customer Card */}
        <motion.div
          id="role-customer-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => onSelectRole('customer')}
          className="group bg-white dark:bg-[#131E33] p-6 rounded-[24px] card-shadow cursor-pointer border border-transparent dark:border-white/[0.06] hover:border-[#27C2D4]/30 dark:hover:border-[#21C7F6]/30 transition-all duration-300 relative overflow-hidden active:scale-[0.98]"
        >
          <div className="flex items-start justify-between">
            <div className="w-14 h-14 bg-gradient-to-tr from-[#27C2D4] to-[#3F73C7] dark:from-[#21C7F6] dark:to-[#4D5DFA] rounded-2xl flex items-center justify-center text-white dark:text-[#070B14] float-shadow">
              <User className="w-7 h-7" />
            </div>
            <div className="w-8 h-8 bg-slate-100 dark:bg-[#17243C] rounded-full flex items-center justify-center text-slate-400 dark:text-[#7F8DA8] group-hover:bg-[#27C2D4] dark:group-hover:bg-[#21C7F6] group-hover:text-white dark:group-hover:text-[#070B14] transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <h2 className="text-xl font-serif text-slate-900 dark:text-white mt-5 font-normal">
            I Need a Service
          </h2>
          <p className="text-slate-500 dark:text-[#B8C3D9] text-sm mt-1 font-sans">
            Book trusted electrical, plumbing, cleaning & expert professionals in minutes with live tracking.
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center text-xs text-[#27C2D4] dark:text-[#21C7F6] font-medium space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Vetted & Insured Local Pros</span>
          </div>
        </motion.div>

        {/* Provider Card */}
        <motion.div
          id="role-provider-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={() => onSelectRole('provider')}
          className="group bg-white dark:bg-[#131E33] p-6 rounded-[24px] card-shadow cursor-pointer border border-transparent dark:border-white/[0.06] hover:border-[#3F73C7]/30 dark:hover:border-[#21C7F6]/30 transition-all duration-300 relative overflow-hidden active:scale-[0.98]"
        >
          <div className="flex items-start justify-between">
            <div className="w-14 h-14 bg-gradient-to-tr from-[#3F73C7] to-[#4340A8] dark:from-[#4D5DFA] dark:to-[#3F73C7] rounded-2xl flex items-center justify-center text-white float-shadow">
              <Briefcase className="w-7 h-7" />
            </div>
            <div className="w-8 h-8 bg-slate-100 dark:bg-[#17243C] rounded-full flex items-center justify-center text-slate-400 dark:text-[#7F8DA8] group-hover:bg-[#3F73C7] dark:group-hover:bg-[#21C7F6] group-hover:text-white dark:group-hover:text-[#070B14] transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <h2 className="text-xl font-serif text-slate-900 dark:text-white mt-5 font-normal">
            Become a Service Provider
          </h2>
          <p className="text-slate-500 dark:text-[#B8C3D9] text-sm mt-1 font-sans">
            Grow your business with i-Serve. Receive instant job alerts, manage earnings, and set your schedule.
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center text-xs text-[#3F73C7] dark:text-[#21C7F6] font-medium space-x-1">
            <Check className="w-3.5 h-3.5" />
            <span>Guaranteed Payouts & Zero Lead Fees</span>
          </div>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="text-center text-xs text-slate-400 dark:text-[#7F8DA8] pb-4 z-10 font-sans">
        By continuing you agree to i-Serve's Terms of Service & Privacy Policy.
      </div>
    </div>
  );
};
