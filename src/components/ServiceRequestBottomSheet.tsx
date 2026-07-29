import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, MapPin, CreditCard, Building2, Smartphone, ArrowRight, ShieldCheck, Radio, Check } from 'lucide-react';
import { ServiceCategory, SubService, UserProfile } from '../types';

interface ServiceRequestBottomSheetProps {
  category: ServiceCategory;
  subService?: SubService;
  user: UserProfile;
  onClose: () => void;
  onSubmitRequest: (details: { 
    address: string; 
    notes: string; 
    paymentMethod: 'paystack_card' | 'paystack_eft' | 'paystack_mobile' | 'apple_pay' | 'credit_card' | 'cash'; 
    amount: number;
    subServiceTitle?: string;
  }) => void;
}

export const ServiceRequestBottomSheet: React.FC<ServiceRequestBottomSheetProps> = ({
  category,
  subService,
  user,
  onClose,
  onSubmitRequest,
}) => {
  const [selectedAddress, setSelectedAddress] = useState(user.address || '125 Main Street, Apt 4B');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'paystack_card' | 'paystack_eft' | 'paystack_mobile'>('paystack_card');

  const serviceName = subService?.name || `${category.title} Service`;
  const totalAmount = subService?.price || category.priceStarting;
  const currencySymbol = subService?.currencySymbol || 'R';

  const handleConfirm = () => {
    onSubmitRequest({
      address: selectedAddress,
      notes,
      paymentMethod,
      amount: totalAmount,
      subServiceTitle: serviceName,
    });
  };

  const paymentOptions = [
    {
      id: 'paystack_card' as const,
      label: 'Card Payment',
      sublabel: 'Visa / Mastercard / Verve',
      icon: CreditCard,
      badge: 'Paystack Secured',
    },
    {
      id: 'paystack_eft' as const,
      label: 'Instant EFT',
      sublabel: 'All SA Major Banks',
      icon: Building2,
      badge: 'Paystack Secured',
    },
    {
      id: 'paystack_mobile' as const,
      label: 'Mobile Money',
      sublabel: 'SnapScan / Scan to Pay',
      icon: Smartphone,
      badge: 'Paystack Secured',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="bg-[#F6F8FB] dark:bg-[#070B14] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] flex flex-col justify-between overflow-hidden relative shadow-2xl max-h-[92vh] border dark:border-white/[0.06]"
      >
        {/* Header */}
        <div className="p-4 bg-white dark:bg-[#131E33] border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between rounded-t-[32px]">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#27C2D4] dark:text-[#21C7F6] block">
              Confirm Booking Details
            </span>
            <h2 className="text-lg font-serif text-slate-900 dark:text-white font-normal">
              {serviceName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-slate-100 dark:bg-[#17243C] rounded-full flex items-center justify-center text-slate-600 dark:text-[#B8C3D9] hover:bg-slate-200 dark:hover:bg-[#17243C]/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-sans text-sm">
          {/* Finding Nearby Provider Status Card (No Provider Name Before Dispatch) */}
          <div className="bg-[#ECFDF5] dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 p-3.5 rounded-[22px] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-xs">Finding the best nearby provider...</h4>
                <p className="text-[11px] text-slate-500 dark:text-[#B8C3D9] font-medium mt-0.5">Automated priority dispatch</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 dark:text-[#7F8DA8] block font-medium">Average arrival</span>
              <span className="text-xs font-bold text-emerald-700 dark:text-[#2DD36F]">≈ 8 mins</span>
            </div>
          </div>

          {/* Service Location Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-[#B8C3D9] ml-1">Service Address</label>
            <div className="bg-white dark:bg-[#131E33] p-3.5 rounded-[20px] card-shadow flex items-center space-x-3 border border-transparent dark:border-white/[0.06]">
              <MapPin className="w-5 h-5 text-[#27C2D4] dark:text-[#21C7F6] shrink-0" />
              <input
                type="text"
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                placeholder="Enter service location"
                className="w-full text-xs font-medium text-slate-800 dark:text-white focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-[#B8C3D9] ml-1">Additional Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Ring doorbell, gate access code, or specific issue details..."
              className="w-full p-3.5 bg-white dark:bg-[#131E33] border border-slate-100 dark:border-white/[0.06] rounded-[20px] text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#7F8DA8] card-shadow focus:ring-2 focus:ring-[#27C2D4]/40 dark:focus:ring-[#21C7F6]/40 focus:outline-none"
            />
          </div>

          {/* Reusable Payment Selector (Paystack Backend Supported) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-[#B8C3D9]">Payment Method</label>
              <span className="text-[10px] font-medium text-[#3F73C7] dark:text-[#21C7F6] bg-blue-50 dark:bg-[#17243C] px-2 py-0.5 rounded-full flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-[#3F73C7] dark:text-[#21C7F6]" />
                <span>Paystack Gateway</span>
              </span>
            </div>

            <div className="space-y-2">
              {paymentOptions.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = paymentMethod === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`p-3.5 rounded-[20px] cursor-pointer flex items-center justify-between transition-all border ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-[#17243C] text-white border-slate-900 dark:border-[#21C7F6] shadow-md'
                        : 'bg-white dark:bg-[#131E33] text-slate-800 dark:text-white border-slate-100 dark:border-white/[0.06] card-shadow hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-white/10 text-cyan-300' : 'bg-slate-100 dark:bg-[#0E1628] text-slate-600 dark:text-[#B8C3D9]'
                      }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-semibold">{opt.label}</h5>
                        <p className={`text-[10px] ${isSelected ? 'text-slate-300 dark:text-[#B8C3D9]' : 'text-slate-400 dark:text-[#7F8DA8]'}`}>
                          {opt.sublabel}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-cyan-500/20 text-cyan-300 dark:text-[#21C7F6]' : 'bg-slate-100 dark:bg-[#0E1628] text-slate-500 dark:text-[#7F8DA8]'
                      }`}>
                        {opt.badge}
                      </span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-cyan-400 bg-cyan-500 text-slate-950' : 'border-slate-300 dark:border-white/20'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white dark:bg-[#131E33] p-4 rounded-[22px] card-shadow space-y-2 text-xs border border-transparent dark:border-white/[0.06]">
            <div className="flex justify-between text-slate-600 dark:text-[#B8C3D9] font-medium">
              <span>{serviceName}</span>
              <span>{currencySymbol}{totalAmount}</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-[#7F8DA8] text-[11px]">
              <span>Diagnostic & Safety Check</span>
              <span className="text-emerald-600 dark:text-[#2DD36F] font-semibold">Included</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-[#7F8DA8] text-[11px]">
              <span>Express Priority Dispatch</span>
              <span className="text-emerald-600 dark:text-[#2DD36F] font-semibold">Free</span>
            </div>
            <div className="border-t border-slate-100 dark:border-white/[0.06] pt-2 flex justify-between font-bold text-slate-900 dark:text-white text-sm">
              <span>Total Amount</span>
              <span className="text-[#3F73C7] dark:text-[#21C7F6] font-serif font-bold text-base">{currencySymbol}{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-4 bg-white dark:bg-[#131E33] border-t border-slate-100 dark:border-white/[0.06]">
          <button
            onClick={handleConfirm}
            className="w-full py-4 bg-gradient-to-r from-[#27C2D4] via-[#3F73C7] to-[#4340A8] dark:from-[#21C7F6] dark:via-[#4D5DFA] dark:to-[#3F73C7] text-white font-medium rounded-[24px] float-shadow flex items-center justify-center space-x-2 text-base active:scale-[0.98] transition-transform"
          >
            <span>Request Service Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
