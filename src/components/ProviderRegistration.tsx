import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Upload, Briefcase, MapPin, Calendar, FileText } from 'lucide-react';
import { UserProfile } from '../types';

interface ProviderRegistrationProps {
  onComplete: (user: Partial<UserProfile>) => void;
  onBack: () => void;
}

export const ProviderRegistration: React.FC<ProviderRegistrationProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    businessName: '',
    category: 'Electrical',
    specialties: ['Circuit Breaker Repair', 'Wiring & Lighting', 'Safety Inspections'],
    availability: 'Mon - Sat (8:00 AM - 6:00 PM)',
    radiusKm: '15 km',
    idDocumentUploaded: true,
  });

  const stepsList = [
    'Profile', 'Business', 'Category', 'Specialties', 'Availability', 'Radius', 'Documents', 'Review', 'Submitted'
  ];
  const totalSteps = stepsList.length;

  const nextStep = async () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else if (step === totalSteps - 1) {
      setStep(totalSteps); // ShowSubmitted
    } else {
      await import('../utils/notifications').then(({ requestNotificationPermission }) => requestNotificationPermission());
      onComplete({
        name: formData.name || 'Master Partner',
        phone: formData.phone || '+1 (555) 987-6543',
        location: `Metro Area (${formData.radiusKm})`,
        address: formData.businessName || 'Master Electrical Hub',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        role: 'provider'
      });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col justify-between p-6 max-w-md mx-auto relative">
      {/* Top Bar */}
      <div className="pt-4 z-10">
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={prevStep}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-700 card-shadow hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold text-[#3F73C7] bg-[#3F73C7]/10 px-3 py-1 rounded-full">
            Step {step} of {totalSteps}: {stepsList[step - 1]}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200/60 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            className="bg-gradient-to-r from-[#3F73C7] to-[#4340A8] h-full"
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="my-auto py-6 min-h-[420px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="pstep1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h2 className="text-3xl font-serif text-slate-900 font-normal">Provider Profile</h2>
              <p className="text-slate-500 text-sm font-sans">Tell clients who you are.</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 ml-1">Your Full Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Smith" className="w-full px-4 py-3 bg-white border border-slate-100 rounded-[20px] text-sm card-shadow focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 ml-1">Mobile Contact</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+1 (555) 987-6543" className="w-full px-4 py-3 bg-white border border-slate-100 rounded-[20px] text-sm card-shadow focus:outline-none" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="pstep2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h2 className="text-3xl font-serif text-slate-900 font-normal">Business Details</h2>
              <p className="text-slate-500 text-sm font-sans">Registered business or trading name.</p>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1 ml-1">Company / Trading Name</label>
                <input type="text" value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} placeholder="e.g. Apex Electrical Solutions" className="w-full px-4 py-3 bg-white border border-slate-100 rounded-[20px] text-sm card-shadow focus:outline-none" />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="pstep3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h2 className="text-3xl font-serif text-slate-900 font-normal">Primary Category</h2>
              <p className="text-slate-500 text-sm font-sans">Select the main field of expertise.</p>
              <div className="grid grid-cols-2 gap-3">
                {['Electrical', 'Plumbing', 'Maintenance', 'Cleaning', 'Mechanic', 'Beauty', 'Technical Support', 'Nanny', 'Errands'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({...formData, category: cat})}
                    className={`p-3.5 rounded-[20px] text-xs font-medium text-left transition-all ${
                      formData.category === cat ? 'bg-[#3F73C7] text-white float-shadow' : 'bg-white text-slate-700 card-shadow'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="pstep4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h2 className="text-3xl font-serif text-slate-900 font-normal">Specialties</h2>
              <p className="text-slate-500 text-sm font-sans font-sans">Services you excel at providing.</p>
              <div className="space-y-2">
                {['Circuit Breaker Repair', 'Wiring & Lighting', 'Safety Inspections', 'EV Charger Setup', 'Emergency Response'].map((spec) => (
                  <div key={spec} className="p-3 bg-white rounded-[16px] card-shadow flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-800">{spec}</span>
                    <span className="text-xs text-[#3F73C7] font-semibold">Active</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="pstep5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h2 className="text-3xl font-serif text-slate-900 font-normal">Availability</h2>
              <p className="text-slate-500 text-sm font-sans">When are you open for customer dispatches?</p>
              <div className="p-4 bg-white rounded-[20px] card-shadow flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-[#3F73C7]" />
                <div>
                  <h4 className="font-semibold text-xs text-slate-800">Standard Working Hours</h4>
                  <p className="text-xs text-slate-500">{formData.availability}</p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="pstep6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h2 className="text-3xl font-serif text-slate-900 font-normal">Working Radius</h2>
              <p className="text-slate-500 text-sm font-sans">How far will you travel for jobs?</p>
              <div className="grid grid-cols-3 gap-3">
                {['5 km', '10 km', '15 km', '25 km', '50 km', 'Whole City'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setFormData({...formData, radiusKm: r})}
                    className={`py-3 rounded-[18px] text-xs font-medium transition-all ${
                      formData.radiusKm === r ? 'bg-[#3F73C7] text-white float-shadow' : 'bg-white text-slate-700 card-shadow'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div key="pstep7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h2 className="text-3xl font-serif text-slate-900 font-normal">Verification Documents</h2>
              <p className="text-slate-500 text-sm font-sans">Upload trade license and Government ID.</p>
              <div className="p-6 bg-white rounded-[24px] card-shadow border-2 border-dashed border-[#3F73C7]/30 text-center space-y-2">
                <Upload className="w-8 h-8 text-[#3F73C7] mx-auto" />
                <h4 className="font-semibold text-xs text-slate-800">Trade License / ID Verified</h4>
                <p className="text-[11px] text-slate-400">master_license_cert_2026.pdf (Uploaded)</p>
              </div>
            </motion.div>
          )}

          {step === 8 && (
            <motion.div key="pstep8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className="text-3xl font-serif text-slate-900 font-normal">Review Application</h2>
              <div className="p-4 bg-white rounded-[20px] card-shadow space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Name:</span> <span className="font-semibold text-slate-800">{formData.name || 'John Smith'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Category:</span> <span className="font-semibold text-slate-800">{formData.category}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Radius:</span> <span className="font-semibold text-slate-800">{formData.radiusKm}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Status:</span> <span className="text-emerald-600 font-semibold">Docs Verified</span></div>
              </div>
            </motion.div>
          )}

          {step === 9 && (
            <motion.div key="pstep9" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto float-shadow">
                <Check className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-serif text-slate-900 font-normal">Application Submitted!</h2>
              <p className="text-slate-500 text-sm font-sans">
                Welcome to i-Serve Partner Network. Your provider dashboard is now active.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Next Button */}
      <div className="pt-2 pb-4">
        <button
          onClick={nextStep}
          className="w-full py-4 bg-gradient-to-r from-[#3F73C7] to-[#4340A8] text-white font-medium rounded-[24px] float-shadow flex items-center justify-center space-x-2 text-base active:scale-[0.98] transition-transform"
        >
          <span>{step === totalSteps ? 'Launch Provider Dashboard' : step === totalSteps - 1 ? 'Submit Application' : 'Next Step'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
