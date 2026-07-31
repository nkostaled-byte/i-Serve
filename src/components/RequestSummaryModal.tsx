import React from 'react';
import { motion } from 'motion/react';
import { 
  X, MapPin, Clock, Calendar, ShieldCheck, 
  Star, FileText, CheckCircle2, AlertCircle, 
  Navigation, Phone, MessageSquare, Download, CreditCard
} from 'lucide-react';
import { ServiceBookingRequest } from '../types';

interface RequestSummaryModalProps {
  request: ServiceBookingRequest;
  onClose: () => void;
  onTrackLive?: (request: ServiceBookingRequest) => void;
  onOpenChat?: (request: ServiceBookingRequest) => void;
}

export const RequestSummaryModal: React.FC<RequestSummaryModalProps> = ({
  request,
  onClose,
  onTrackLive,
  onOpenChat,
}) => {
  const getStatusBadge = (status: ServiceBookingRequest['status']) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completed',
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-[#2DD36F] border-emerald-500/20',
          icon: <CheckCircle2 className="w-4 h-4 mr-1.5 shrink-0" />
        };
      case 'in_progress':
        return {
          label: 'Service In Progress',
          bg: 'bg-[#27C2D4]/10 dark:bg-[#21C7F6]/20 text-[#27C2D4] dark:text-[#21C7F6] border-[#27C2D4]/20',
          icon: <Clock className="w-4 h-4 mr-1.5 shrink-0 animate-spin" />
        };
      case 'on_the_way':
      case 'arrived':
      case 'accepted':
        return {
          label: status === 'on_the_way' ? 'Provider On The Way' : status === 'arrived' ? 'Provider Arrived' : 'Accepted',
          bg: 'bg-[#3F73C7]/10 dark:bg-[#3F73C7]/20 text-[#3F73C7] dark:text-[#21C7F6] border-[#3F73C7]/20',
          icon: <Navigation className="w-4 h-4 mr-1.5 shrink-0 animate-pulse" />
        };
      case 'searching':
      case 'pending':
        return {
          label: 'Searching / Pending',
          bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20',
          icon: <Clock className="w-4 h-4 mr-1.5 shrink-0 animate-pulse" />
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          bg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/20',
          icon: <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
        };
      default:
        return {
          label: status,
          bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
          icon: null
        };
    }
  };

  const statusBadge = getStatusBadge(request.status);

  const handleDownloadInvoice = () => {
    const element = document.createElement('a');
    const file = new Blob([
      `i-Serve Official Summary & Receipt
========================================
Request ID: ${request.id}
Category: ${request.categoryTitle}
Sub-Service: ${request.subServiceTitle || 'Standard Dispatch'}
Provider: ${request.provider ? request.provider.name : 'Unassigned'}
Customer: ${request.customerName}
Address: ${request.address}
Amount: $${request.amount.toFixed(2)}
Payment Method: ${request.paymentMethod ? request.paymentMethod.replace('_', ' ').toUpperCase() : 'CARD'}
Status: ${request.status.toUpperCase()}
Date & Time: ${request.createdAt} ${request.scheduledTime ? `(${request.scheduledTime})` : ''}
Notes: ${request.notes || 'None'}
========================================
Thank you for choosing i-Serve On-Demand Services!
`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `iServe_Summary_${request.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const isActiveJob = ['searching', 'pending', 'accepted', 'on_the_way', 'arrived', 'in_progress'].includes(request.status);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white dark:bg-[#131E33] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 space-y-5 shadow-2xl relative overflow-hidden border border-transparent dark:border-white/[0.06] max-h-[90vh] overflow-y-auto"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#27C2D4] dark:text-[#21C7F6]">
              Service Request Details
            </span>
            <h2 className="text-xl font-serif font-normal text-slate-900 dark:text-white mt-0.5">
              {request.categoryTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-slate-100 dark:bg-[#17243C] text-slate-600 dark:text-[#B8C3D9] rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Status Badge */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-[#0E1628] p-3 rounded-2xl border border-slate-100 dark:border-white/[0.04]">
          <span className="text-xs text-slate-500 dark:text-[#7F8DA8] font-medium">Status</span>
          <div className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center ${statusBadge.bg}`}>
            {statusBadge.icon}
            <span>{statusBadge.label}</span>
          </div>
        </div>

        {/* 2. Service & Price */}
        <div className="bg-white dark:bg-[#17243C] p-4 rounded-2xl border border-slate-100 dark:border-white/[0.06] space-y-2 card-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 dark:text-[#7F8DA8] uppercase tracking-wider">
              Service & Billing
            </span>
            <span className="text-lg font-serif font-bold text-slate-900 dark:text-white">
              ${request.amount.toFixed(2)}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-white">
            {request.subServiceTitle || request.categoryTitle}
          </p>
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-[#B8C3D9] pt-1">
            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
            <span className="capitalize">
              Payment via {request.paymentMethod ? request.paymentMethod.replace('_', ' ') : 'Card'}
            </span>
          </div>
        </div>

        {/* 3. Provider Information */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 dark:text-[#7F8DA8] uppercase tracking-wider block">
            Assigned Service Provider
          </span>

          {request.provider ? (
            <div className="bg-white dark:bg-[#17243C] p-4 rounded-2xl border border-slate-100 dark:border-white/[0.06] flex items-center justify-between card-shadow">
              <div className="flex items-center space-x-3.5">
                <div className="relative">
                  <img
                    src={request.provider.avatarUrl}
                    alt={request.provider.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  {request.provider.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-[#27C2D4] dark:bg-[#21C7F6] text-white dark:text-[#070B14] p-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {request.provider.name}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-[#B8C3D9]">
                    <span className="text-amber-500 font-medium flex items-center">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                      {request.provider.rating}
                    </span>
                    <span>• {request.provider.category}</span>
                  </div>
                </div>
              </div>

              {request.provider.phone && (
                <a
                  href={`tel:${request.provider.phone}`}
                  className="w-9 h-9 bg-emerald-500/10 text-emerald-600 dark:text-[#2DD36F] rounded-full flex items-center justify-center hover:bg-emerald-500/20 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-[#0E1628] p-3.5 rounded-2xl border border-slate-100 dark:border-white/[0.04] text-xs text-slate-500 dark:text-[#7F8DA8] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#27C2D4] shrink-0" />
              <span>Provider being automatically assigned by i-Serve dispatch.</span>
            </div>
          )}
        </div>

        {/* 4. Request Summary / Notes */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-400 dark:text-[#7F8DA8] uppercase tracking-wider block">
            Summary & Notes
          </span>
          <div className="bg-slate-50 dark:bg-[#0E1628] p-3.5 rounded-2xl border border-slate-100 dark:border-white/[0.04] text-xs text-slate-700 dark:text-[#B8C3D9] leading-relaxed">
            <div className="flex items-start space-x-2">
              <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p>{request.notes || 'No custom notes provided for this service request.'}</p>
            </div>
          </div>
        </div>

        {/* 5. Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 dark:bg-[#0E1628] p-3 rounded-2xl border border-slate-100 dark:border-white/[0.04] space-y-1">
            <span className="text-[11px] text-slate-400 dark:text-[#7F8DA8] font-medium block flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-[#27C2D4]" />
              Created Date
            </span>
            <p className="text-xs font-semibold text-slate-800 dark:text-white">
              {request.createdAt}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-[#0E1628] p-3 rounded-2xl border border-slate-100 dark:border-white/[0.04] space-y-1">
            <span className="text-[11px] text-slate-400 dark:text-[#7F8DA8] font-medium block flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-[#3F73C7]" />
              Scheduled Time
            </span>
            <p className="text-xs font-semibold text-slate-800 dark:text-white">
              {request.scheduledTime || 'Immediate'}
            </p>
          </div>
        </div>

        {/* 6. Service Address */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-400 dark:text-[#7F8DA8] uppercase tracking-wider block">
            Service Location Address
          </span>
          <div className="bg-slate-50 dark:bg-[#0E1628] p-3.5 rounded-2xl border border-slate-100 dark:border-white/[0.04] flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#27C2D4]/10 text-[#27C2D4] dark:text-[#21C7F6] rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-white leading-tight">
              {request.address}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          {isActiveJob && onTrackLive && (
            <button
              onClick={() => {
                onClose();
                onTrackLive(request);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-[#27C2D4] to-[#3F73C7] text-white font-semibold rounded-2xl float-shadow flex items-center justify-center space-x-2 text-sm active:scale-[0.98] transition-transform cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Track Live on Map</span>
            </button>
          )}

          {request.status === 'completed' && (
            <button
              onClick={handleDownloadInvoice}
              className="w-full py-3.5 bg-slate-100 dark:bg-[#17243C] text-slate-800 dark:text-white font-semibold rounded-2xl border border-slate-200 dark:border-white/[0.06] flex items-center justify-center space-x-2 text-sm hover:bg-slate-200 dark:hover:bg-[#1C2C4A] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#27C2D4]" />
              <span>Download Summary Receipt</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 bg-white dark:bg-[#131E33] text-slate-600 dark:text-[#B8C3D9] text-xs font-medium rounded-2xl hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </div>
  );
};
