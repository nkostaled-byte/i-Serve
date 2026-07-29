import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, MapPin, Clock, Phone, MessageSquare, 
  ChevronRight, CheckCircle2, XCircle, Navigation, DollarSign,
  AlertCircle
} from 'lucide-react';
import { ServiceBookingRequest, AppScreen } from '../types';

interface ProviderJobsProps {
  allRequests: ServiceBookingRequest[];
  onAcceptJob: (req: ServiceBookingRequest) => void;
  onDeclineJob: (req: ServiceBookingRequest) => void;
  onCompleteJob: (req: ServiceBookingRequest) => void;
  onNavigateToChat: (req: ServiceBookingRequest) => void;
  onNavigateToTracking: (req: ServiceBookingRequest) => void;
}

type JobTabFilter = 'all' | 'incoming' | 'accepted' | 'active' | 'completed' | 'cancelled';

export const ProviderJobs: React.FC<ProviderJobsProps> = ({
  allRequests,
  onAcceptJob,
  onDeclineJob,
  onCompleteJob,
  onNavigateToChat,
  onNavigateToTracking,
}) => {
  const [activeTab, setActiveTab] = useState<JobTabFilter>('active');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock list of jobs if empty or to demonstrate all tab states
  const sampleJobs: ServiceBookingRequest[] = allRequests.length > 0 ? allRequests : [
    {
      id: 'job_101',
      categoryId: 'electrical',
      categoryTitle: 'Electrical Wiring & DB Repair',
      customerName: 'Sarah Jenkins',
      address: '742 Evergreen Terrace, San Francisco, CA',
      notes: 'Tripping circuit breaker whenever air conditioner turns on. Need urgent diagnostic.',
      paymentMethod: 'apple_pay',
      amount: 145.00,
      status: 'accepted',
      createdAt: '10 mins ago',
      scheduledTime: 'Today at 2:30 PM',
      userCoords: { lat: 37.7749, lng: -122.4194 },
      providerCoords: { lat: 37.7810, lng: -122.4110 }
    },
    {
      id: 'job_102',
      categoryId: 'plumbing',
      categoryTitle: 'Leaking Pipe Emergency',
      customerName: 'David Miller',
      address: '388 Market Street, Suite 400',
      notes: 'Under-sink water pipe leaking onto kitchen hardwood floor.',
      paymentMethod: 'credit_card',
      amount: 180.00,
      status: 'searching', // treated as incoming
      createdAt: 'Just now',
      scheduledTime: 'Immediate Dispatch',
      userCoords: { lat: 37.7880, lng: -122.4010 },
      providerCoords: { lat: 37.7810, lng: -122.4110 }
    },
    {
      id: 'job_103',
      categoryId: 'maintenance',
      categoryTitle: 'AC Unit Filter & Servicing',
      customerName: 'Elena Rostova',
      address: '1020 Pine Street, Apt 12B',
      notes: 'Annual filter cleanup and refrigerant level check.',
      paymentMethod: 'cash',
      amount: 95.00,
      status: 'completed',
      createdAt: 'Yesterday, 4:15 PM',
      scheduledTime: 'Completed',
      userCoords: { lat: 37.7900, lng: -122.4120 },
      providerCoords: { lat: 37.7810, lng: -122.4110 },
      ratingGiven: 5,
      reviewGiven: 'Extremely professional and clean work! Solved the issue in under 45 minutes.'
    },
    {
      id: 'job_104',
      categoryId: 'mechanic',
      categoryTitle: 'Flat Tire Roadside Repair',
      customerName: 'Marcus Vance',
      address: 'Hwy 101 Exit 43, SF Bay Area',
      notes: 'Front right tire punctured on highway shoulder.',
      paymentMethod: 'apple_pay',
      amount: 120.00,
      status: 'cancelled',
      createdAt: '2 days ago',
      scheduledTime: 'Cancelled by customer',
      userCoords: { lat: 37.7600, lng: -122.4200 },
      providerCoords: { lat: 37.7810, lng: -122.4110 }
    }
  ];

  const filteredJobs = sampleJobs.filter((job) => {
    const matchesSearch =
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.categoryTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'all') return true;
    if (activeTab === 'incoming') return job.status === 'searching' || job.status === 'pending';
    if (activeTab === 'accepted') return job.status === 'accepted';
    if (activeTab === 'active') return job.status === 'in_progress' || job.status === 'accepted';
    if (activeTab === 'completed') return job.status === 'completed';
    if (activeTab === 'cancelled') return job.status === 'cancelled';
    return true;
  });

  const getCount = (tab: JobTabFilter) => {
    if (tab === 'all') return sampleJobs.length;
    if (tab === 'incoming') return sampleJobs.filter(j => j.status === 'searching' || j.status === 'pending').length;
    if (tab === 'accepted') return sampleJobs.filter(j => j.status === 'accepted').length;
    if (tab === 'active') return sampleJobs.filter(j => j.status === 'in_progress' || j.status === 'accepted').length;
    if (tab === 'completed') return sampleJobs.filter(j => j.status === 'completed').length;
    if (tab === 'cancelled') return sampleJobs.filter(j => j.status === 'cancelled').length;
    return 0;
  };

  return (
    <div className="pb-28 pt-4 px-4 max-w-md mx-auto space-y-5 font-sans">
      {/* Title & Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#3F73C7] dark:text-[#21C7F6]">
            Provider Hub
          </span>
          <h1 className="text-2xl font-serif font-normal text-slate-900 dark:text-white">
            Jobs & Orders
          </h1>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#131E33] shadow-sm border border-slate-100 dark:border-white/[0.06] flex items-center justify-center text-slate-600 dark:text-white font-serif font-semibold text-sm">
          {sampleJobs.length}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#7F8DA8]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search customer, location or service..."
          className="w-full bg-white dark:bg-[#131E33] pl-10 pr-4 py-2.5 rounded-2xl text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-[#7F8DA8] border border-slate-200/80 dark:border-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[#3F73C7]/20 dark:focus:ring-[#21C7F6]/20 transition-all shadow-sm"
        />
      </div>

      {/* Filter Tabs horizontally scrollable */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'incoming' as JobTabFilter, label: 'Incoming' },
          { id: 'accepted' as JobTabFilter, label: 'Accepted' },
          { id: 'active' as JobTabFilter, label: 'Active' },
          { id: 'completed' as JobTabFilter, label: 'Completed' },
          { id: 'cancelled' as JobTabFilter, label: 'Cancelled' },
          { id: 'all' as JobTabFilter, label: 'All Jobs' },
        ].map((tab) => {
          const count = getCount(tab.id);
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#3F73C7] dark:bg-[#21C7F6] text-white dark:text-[#070B14] shadow-md shadow-[#3F73C7]/20'
                  : 'bg-white dark:bg-[#131E33] text-slate-600 dark:text-[#B8C3D9] border border-slate-200/70 dark:border-white/[0.06] hover:bg-slate-50 dark:hover:bg-[#17243C]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive ? 'bg-white/25 dark:bg-[#070B14]/20 text-white dark:text-[#070B14]' : 'bg-slate-100 dark:bg-[#17243C] text-slate-500 dark:text-[#7F8DA8]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Job List */}
      <div className="space-y-3.5">
        <AnimatePresence mode="popLayout">
          {filteredJobs.length === 0 ? (
            <div className="bg-white dark:bg-[#131E33] p-8 rounded-[28px] text-center border border-slate-100 dark:border-white/[0.06] shadow-sm space-y-2">
              <div className="w-12 h-12 bg-slate-100 dark:bg-[#17243C] rounded-full flex items-center justify-center mx-auto text-slate-400 dark:text-[#7F8DA8]">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base text-slate-800 dark:text-white font-medium">No jobs in this category</h3>
              <p className="text-xs text-slate-500 dark:text-[#B8C3D9] max-w-xs mx-auto">
                {activeTab === 'incoming' 
                  ? 'Keep your online toggle active on the dashboard to receive new dispatch requests.' 
                  : 'Change your filter above or search for another customer keyword.'}
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-[#131E33] p-4 rounded-[28px] card-shadow border border-slate-100 dark:border-white/[0.06] space-y-3.5 relative overflow-hidden"
              >
                {/* Status Indicator pill */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3F73C7] dark:text-[#21C7F6] bg-[#3F73C7]/10 dark:bg-[#21C7F6]/20 px-2.5 py-0.5 rounded-full">
                    {job.categoryTitle}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    job.status === 'completed'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-[#2DD36F]'
                      : job.status === 'cancelled'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-[#FF5D73]'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-[#FFC542] animate-pulse'
                  }`}>
                    {job.status === 'searching' || job.status === 'pending' ? 'Incoming Request' : job.status}
                  </span>
                </div>

                {/* Main Details */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg text-slate-900 dark:text-white font-normal leading-tight">
                      {job.customerName}
                    </h3>
                    <div className="flex items-center text-xs text-slate-500 dark:text-[#B8C3D9] space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-[#3F73C7] dark:text-[#21C7F6] shrink-0" />
                      <span className="truncate max-w-[220px]">{job.address}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-serif text-[#3F73C7] dark:text-[#21C7F6] font-normal">
                      ${job.amount.toFixed(2)}
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-[#7F8DA8]">
                      {job.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Notes box */}
                {job.notes && (
                  <p className="text-xs text-slate-600 dark:text-[#B8C3D9] bg-slate-50 dark:bg-[#0E1628] p-3 rounded-2xl border border-slate-100/80 dark:border-white/[0.06] italic">
                    "{job.notes}"
                  </p>
                )}

                {/* Scheduled / Arrival Time */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#B8C3D9] pt-1 border-t border-slate-100 dark:border-white/[0.06]">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-[#7F8DA8]" />
                    <span>{job.scheduledTime || job.createdAt}</span>
                  </div>
                  <span className="font-medium text-slate-700 dark:text-white">Estimated distance: 2.1 km</span>
                </div>

                {/* Actions per status */}
                <div className="pt-1 flex items-center space-x-2">
                  {job.status === 'searching' || job.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => onDeclineJob(job)}
                        className="flex-1 py-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-[#FF5D73] text-xs font-semibold rounded-2xl hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => onAcceptJob(job)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-[#3F73C7] to-[#4340A8] dark:from-[#21C7F6] dark:to-[#4D5DFA] text-white dark:text-[#070B14] text-xs font-semibold rounded-2xl float-shadow active:scale-95 transition-transform flex items-center justify-center space-x-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Job</span>
                      </button>
                    </>
                  ) : job.status === 'accepted' || job.status === 'in_progress' ? (
                    <>
                      <button
                        onClick={() => onNavigateToChat(job)}
                        className="p-2.5 bg-slate-100 dark:bg-[#17243C] text-slate-700 dark:text-white rounded-2xl hover:bg-slate-200 dark:hover:bg-[#17243C]/80 transition-colors"
                        title="Chat Customer"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onNavigateToTracking(job)}
                        className="flex-1 py-2.5 bg-[#3F73C7] dark:bg-[#21C7F6] text-white dark:text-[#070B14] text-xs font-semibold rounded-2xl float-shadow flex items-center justify-center space-x-1.5"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>GPS Live Route</span>
                      </button>
                      <button
                        onClick={() => onCompleteJob(job)}
                        className="px-3.5 py-2.5 bg-emerald-600 dark:bg-[#2DD36F] text-white dark:text-[#070B14] text-xs font-semibold rounded-2xl hover:bg-emerald-700 transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Complete</span>
                      </button>
                    </>
                  ) : job.status === 'completed' ? (
                    <div className="w-full flex items-center justify-between text-xs text-emerald-700 dark:text-[#2DD36F] font-medium bg-emerald-50/80 dark:bg-emerald-950/40 p-2.5 rounded-2xl">
                      <div className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#2DD36F]" />
                        <span>Payout Processed to Earnings</span>
                      </div>
                      <span className="font-bold text-emerald-800 dark:text-[#2DD36F]">${job.amount.toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className="w-full text-xs text-slate-400 dark:text-[#7F8DA8] italic text-center py-1">
                      Job request was cancelled
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
