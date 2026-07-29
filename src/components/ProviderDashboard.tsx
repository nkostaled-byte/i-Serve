import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Power, DollarSign, Star, Calendar, Clock, MapPin, CheckCircle, 
  XCircle, ChevronRight, User, Bell, TrendingUp, ShieldCheck, Zap,
  Briefcase, MessageSquare, Navigation
} from 'lucide-react';
import { ServiceProvider, ServiceBookingRequest } from '../types';

interface ProviderDashboardProps {
  provider: ServiceProvider;
  activeRequests: ServiceBookingRequest[];
  onAcceptRequest: (req: ServiceBookingRequest) => void;
  onDeclineRequest: (req: ServiceBookingRequest) => void;
  onSwitchRole: () => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  provider,
  activeRequests,
  onAcceptRequest,
  onDeclineRequest,
  onSwitchRole,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [incomingJob, setIncomingJob] = useState<ServiceBookingRequest | null>(
    activeRequests.find(r => r.status === 'searching' || r.status === 'pending') || {
      id: 'dispatch_99',
      categoryId: 'electrical',
      categoryTitle: 'Electrical Services',
      customerName: 'Nathi Gumede',
      address: '125 Main Street, Apt 4B',
      notes: 'Living room light fixture flickering and breaker tripping.',
      paymentMethod: 'apple_pay',
      amount: 145.00,
      status: 'searching',
      createdAt: 'Just now',
      userCoords: { lat: 37.7749, lng: -122.4194 },
      providerCoords: { lat: 37.7810, lng: -122.4110 }
    }
  );

  useEffect(() => {
    if (incomingJob && isOnline) {
      import('../utils/notifications').then(({ sendPushNotification }) => {
        sendPushNotification("New Job Dispatch", {
          body: `${incomingJob.categoryTitle} - $${incomingJob.amount.toFixed(2)}`,
        });
      });
    }
  }, [incomingJob, isOnline]);

  return (
    <div className="pb-28 pt-4 px-4 max-w-md mx-auto space-y-5 font-sans">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={provider.avatarUrl}
              alt={provider.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-2xl object-cover float-shadow border-2 border-white dark:border-[#131E33]"
            />
            <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#131E33] ${
              isOnline ? 'bg-emerald-500' : 'bg-slate-400'
            }`} />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3F73C7] dark:text-[#21C7F6]">
                Service Partner
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#3F73C7] dark:text-[#21C7F6]" />
            </div>
            <h2 className="text-xl font-serif text-slate-900 dark:text-white font-normal leading-tight">
              {provider.name}
            </h2>
          </div>
        </div>

        <button
          onClick={onSwitchRole}
          className="px-3.5 py-1.5 bg-slate-100 dark:bg-[#17243C] hover:bg-slate-200 dark:hover:bg-[#17243C]/80 text-slate-700 dark:text-white text-xs font-semibold rounded-full transition-colors flex items-center space-x-1 border border-transparent dark:border-white/[0.06]"
        >
          <span>Customer View</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Availability Status Banner */}
      <div
        className={`p-4 rounded-[28px] card-shadow flex items-center justify-between text-white transition-all duration-300 ${
          isOnline ? 'bg-gradient-to-r from-emerald-600 to-teal-700' : 'bg-slate-800'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
            <Power className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="font-semibold text-sm">
                {isOnline ? 'Active & Ready for Dispatches' : 'Offline Mode'}
              </h3>
              {isOnline && <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />}
            </div>
            <p className="text-[11px] text-white/80">
              {isOnline ? 'Receiving customer service dispatches nearby' : 'Turn online to receive new jobs'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`w-14 h-8 rounded-full p-1 transition-colors ${
            isOnline ? 'bg-white/30' : 'bg-slate-600'
          }`}
        >
          <div className={`w-6 h-6 rounded-full bg-white transition-transform duration-300 ${
            isOnline ? 'translate-x-6' : 'translate-x-0'
          }`} />
        </button>
      </div>

      {/* Today's & Weekly Earnings Overview */}
      <div className="bg-gradient-to-tr from-[#3F73C7] via-[#3561ab] to-[#4340A8] p-5 rounded-[32px] text-white float-shadow space-y-4">
        <div className="flex justify-between items-center text-xs text-cyan-200 font-medium">
          <span className="flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-300" />
            <span>Earnings Dashboard</span>
          </span>
          <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-white text-[10px] font-semibold">
            Live Summary
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <span className="text-[11px] text-cyan-100 uppercase tracking-wider font-medium">Today</span>
            <div className="text-2xl font-serif font-normal text-white">$280.00</div>
            <span className="text-[10px] text-emerald-300 font-medium">3 jobs completed</span>
          </div>
          <div className="border-l border-white/20 pl-3">
            <span className="text-[11px] text-cyan-100 uppercase tracking-wider font-medium">This Week</span>
            <div className="text-2xl font-serif font-normal text-white">$1,280.00</div>
            <span className="text-[10px] text-emerald-300 font-medium">+18.4% vs last week</span>
          </div>
        </div>

        {/* Mini Weekly Bar Visualizer */}
        <div className="flex items-end justify-between h-12 pt-2 border-t border-white/20">
          {[
            { day: 'M', h: '45%' },
            { day: 'T', h: '70%' },
            { day: 'W', h: '55%' },
            { day: 'T', h: '85%' },
            { day: 'F', h: '95%' },
            { day: 'S', h: '75%' },
            { day: 'S', h: '40%' },
          ].map((bar, i) => (
            <div key={i} className="flex flex-col items-center space-y-1">
              <div className="w-5 bg-white/30 rounded-t-sm relative overflow-hidden" style={{ height: bar.h }}>
                <div className="w-full bg-cyan-300 h-full" />
              </div>
              <span className="text-[9px] text-white/70 font-medium">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white dark:bg-[#131E33] p-3 rounded-2xl text-center border border-slate-100 dark:border-white/[0.06] shadow-sm">
          <div className="flex items-center justify-center space-x-0.5 text-amber-500 font-bold text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>4.9</span>
          </div>
          <span className="text-[9px] text-slate-400 dark:text-[#7F8DA8] block mt-0.5">Rating</span>
        </div>

        <div className="bg-white dark:bg-[#131E33] p-3 rounded-2xl text-center border border-slate-100 dark:border-white/[0.06] shadow-sm">
          <div className="font-serif font-bold text-xs text-slate-900 dark:text-white">
            310
          </div>
          <span className="text-[9px] text-slate-400 dark:text-[#7F8DA8] block mt-0.5">Jobs Done</span>
        </div>

        <div className="bg-white dark:bg-[#131E33] p-3 rounded-2xl text-center border border-slate-100 dark:border-white/[0.06] shadow-sm">
          <div className="font-semibold text-xs text-emerald-600 dark:text-[#2DD36F]">
            98%
          </div>
          <span className="text-[9px] text-slate-400 dark:text-[#7F8DA8] block mt-0.5">Accept Rate</span>
        </div>

        <div className="bg-white dark:bg-[#131E33] p-3 rounded-2xl text-center border border-slate-100 dark:border-white/[0.06] shadow-sm">
          <div className="font-semibold text-xs text-[#3F73C7] dark:text-[#21C7F6]">
            &lt; 5m
          </div>
          <span className="text-[9px] text-slate-400 dark:text-[#7F8DA8] block mt-0.5">Response</span>
        </div>
      </div>

      {/* Incoming Request Alert Banner */}
      <AnimatePresence>
        {incomingJob && isOnline && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-[#131E33] p-4.5 rounded-[28px] float-shadow border-2 border-[#3F73C7] dark:border-[#21C7F6] space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-600 dark:text-[#2DD36F] bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <Bell className="w-3.5 h-3.5 animate-bounce" />
                <span>Incoming Job Dispatch</span>
              </span>
              <span className="text-xs text-slate-400 dark:text-[#7F8DA8] font-sans font-medium">2.4 km away</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-normal text-slate-900 dark:text-white">{incomingJob.categoryTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-[#B8C3D9]">{incomingJob.customerName} • {incomingJob.address}</p>
              </div>
              <span className="text-2xl font-serif text-[#3F73C7] dark:text-[#21C7F6] font-normal">${incomingJob.amount.toFixed(2)}</span>
            </div>

            {incomingJob.notes && (
              <p className="text-xs text-slate-600 dark:text-[#B8C3D9] bg-slate-50 dark:bg-[#0E1628] p-2.5 rounded-2xl italic border border-transparent dark:border-white/[0.06]">
                "{incomingJob.notes}"
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  onDeclineRequest(incomingJob);
                  setIncomingJob(null);
                }}
                className="py-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-[#FF5D73] font-semibold text-xs rounded-2xl hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => {
                  onAcceptRequest(incomingJob);
                  setIncomingJob(null);
                }}
                className="py-2.5 bg-gradient-to-r from-[#3F73C7] to-[#4340A8] dark:from-[#21C7F6] dark:to-[#4D5DFA] text-white dark:text-[#070B14] font-semibold text-xs rounded-2xl float-shadow active:scale-95 transition-transform flex items-center justify-center space-x-1"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Accept Dispatch</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Jobs List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#7F8DA8]">
            Active Jobs ({activeRequests.length})
          </h3>
          <span className="text-xs font-semibold text-[#3F73C7] dark:text-[#21C7F6]">Updated live</span>
        </div>

        {activeRequests.map((req) => (
          <div key={req.id} className="bg-white dark:bg-[#131E33] p-4 rounded-[26px] card-shadow border border-slate-100 dark:border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3F73C7] dark:text-[#21C7F6] bg-[#3F73C7]/10 dark:bg-[#21C7F6]/20 px-2.5 py-0.5 rounded-full">
                {req.categoryTitle}
              </span>
              <span className="text-sm font-serif font-semibold text-slate-900 dark:text-white">
                ${req.amount.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-100 dark:bg-[#17243C] rounded-full flex items-center justify-center text-slate-600 dark:text-white font-serif font-bold text-sm">
                {req.customerName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-slate-800 dark:text-white truncate">{req.customerName}</h4>
                <p className="text-[11px] text-slate-500 dark:text-[#B8C3D9] truncate">{req.address}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-white/[0.06]">
              <span className="text-[11px] text-emerald-600 dark:text-[#2DD36F] font-medium">Status: Accepted & En Route</span>
              <button
                onClick={() => onAcceptRequest(req)}
                className="px-3.5 py-1.5 bg-[#3F73C7] dark:bg-[#21C7F6] text-white dark:text-[#070B14] text-xs font-semibold rounded-full float-shadow flex items-center space-x-1"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>GPS Route</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
