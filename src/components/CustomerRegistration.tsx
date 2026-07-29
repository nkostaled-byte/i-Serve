import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Camera, Check, User, Phone, MapPin, Shield } from 'lucide-react';
import { UserProfile } from '../types';

interface CustomerRegistrationProps {
  onComplete: (user: Partial<UserProfile>) => void;
  onBack: () => void;
}

export const CustomerRegistration: React.FC<CustomerRegistrationProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    location: '125 Main Street, Apt 4B',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  });

  const totalSteps = 5;

  const nextStep = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      await import('../utils/notifications').then(({ requestNotificationPermission }) => requestNotificationPermission());
      onComplete({
        name: formData.name || 'New User',
        email: formData.email || 'user@iserve.app',
        phone: formData.phone || '+1 (555) 000-1122',
        location: formData.location,
        address: formData.location,
        avatarUrl: formData.avatarUrl,
        role: 'customer'
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
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col justify-between px-6 pb-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] max-w-md mx-auto relative">
      {/* Top Bar with Progress */}
      <div className="pt-4 z-10">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={prevStep}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-700 card-shadow hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold text-slate-400 font-sans">
            Step {step} of {totalSteps}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200/60 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            className="bg-gradient-to-r from-[#27C2D4] to-[#3F73C7] h-full"
            initial={{ width: `${((step - 1) / totalSteps) * 100}%` }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Step Content */}
      <div className="my-auto py-8 min-h-[380px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="w-12 h-12 bg-[#27C2D4]/10 text-[#27C2D4] rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-serif text-slate-900 font-normal">
                Create your account
              </h2>
              <p className="text-slate-500 text-sm font-sans">
                Enter your login credentials to get started with i-Serve.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 ml-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. nathi@example.com"
                    className="w-full px-4 py-3.5 bg-white border border-slate-100 rounded-[20px] text-sm text-slate-800 card-shadow focus:ring-2 focus:ring-[#27C2D4]/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 ml-1">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-3.5 bg-white border border-slate-100 rounded-[20px] text-sm text-slate-800 card-shadow focus:ring-2 focus:ring-[#27C2D4]/50 focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="w-12 h-12 bg-[#3F73C7]/10 text-[#3F73C7] rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-serif text-slate-900 font-normal">
                What is your name?
              </h2>
              <p className="text-slate-500 text-sm font-sans">
                Service providers will address you by this name when dispatched.
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1 ml-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Nathi Gumede"
                  className="w-full px-4 py-3.5 bg-white border border-slate-100 rounded-[20px] text-sm text-slate-800 card-shadow focus:ring-2 focus:ring-[#27C2D4]/50 focus:outline-none"
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="w-12 h-12 bg-[#4340A8]/10 text-[#4340A8] rounded-2xl flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-serif text-slate-900 font-normal">
                What is your phone number?
              </h2>
              <p className="text-slate-500 text-sm font-sans">
                Used for live dispatch updates and direct driver calls.
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1 ml-1">Mobile Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 234-8901"
                  className="w-full px-4 py-3.5 bg-white border border-slate-100 rounded-[20px] text-sm text-slate-800 card-shadow focus:ring-2 focus:ring-[#27C2D4]/50 focus:outline-none"
                />
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="w-12 h-12 bg-[#27C2D4]/10 text-[#27C2D4] rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-serif text-slate-900 font-normal">
                Where are you located?
              </h2>
              <p className="text-slate-500 text-sm font-sans">
                We use this address to match you with nearby service professionals.
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1 ml-1">Primary Home Address</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="125 Main Street, Apt 4B"
                  className="w-full px-4 py-3.5 bg-white border border-slate-100 rounded-[20px] text-sm text-slate-800 card-shadow focus:ring-2 focus:ring-[#27C2D4]/50 focus:outline-none"
                />
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-center"
            >
              <h2 className="text-3xl font-serif text-slate-900 font-normal">
                Add a profile photo
              </h2>
              <p className="text-slate-500 text-sm font-sans">
                A photo builds trust with professionals visiting your residence.
              </p>

              <div className="relative w-32 h-32 mx-auto mt-4">
                <img
                  src={formData.avatarUrl}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-32 h-32 rounded-full object-cover float-shadow border-4 border-white"
                />
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#27C2D4] text-white rounded-full flex items-center justify-center shadow-md">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Button */}
      <div className="pt-4 pb-4">
        <button
          onClick={nextStep}
          className="w-full py-4 bg-gradient-to-r from-[#27C2D4] to-[#3F73C7] text-white font-medium rounded-[24px] float-shadow flex items-center justify-center space-x-2 text-base active:scale-[0.98] transition-transform"
        >
          <span>{step === totalSteps ? 'Complete Registration' : 'Continue'}</span>
          {step === totalSteps ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
