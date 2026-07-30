import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Droplets } from 'lucide-react';

const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/i-serve-bcf9a.appspot.com/o/assets%2Fi-Serve%20rounded%20logo%20512x512.webp?alt=media&token=c4a156b3-7bec-4cca-b725-fbde3b0c5d1e";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      onClick={onComplete}
      className="fixed inset-0 z-50 bg-gradient-to-b from-[#27C2D4] via-[#3F73C7] to-[#0F172A] flex flex-col items-center justify-between px-8 pb-8 pt-[calc(env(safe-area-inset-top)+2rem)] overflow-hidden cursor-pointer"
    >
      {/* Animated Fluid Water Waves in background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -bottom-20 -left-1/2 w-[200%] h-96 bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 rounded-[40%] animate-wave-1 blur-lg" />
        <div className="absolute -bottom-24 -left-1/2 w-[200%] h-96 bg-white rounded-[45%] animate-wave-2 opacity-20 blur-md" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center z-10 text-center">
        {/* Animated Drop Logo Container */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6"
        >
          {/* Smooth fluid water ripple rings */}
          <motion.div 
            animate={{ 
              scale: [0.95, 1.45, 1.65], 
              opacity: [0, 0.5, 0] 
            }}
            transition={{ 
              duration: 3.2, 
              repeat: Infinity, 
              ease: 'easeInOut',
              times: [0, 0.4, 1]
            }}
            className="absolute inset-0 rounded-[32px] border border-cyan-300/60 pointer-events-none z-0"
          />
          <motion.div 
            animate={{ 
              scale: [0.95, 1.45, 1.65], 
              opacity: [0, 0.4, 0] 
            }}
            transition={{ 
              duration: 3.2, 
              repeat: Infinity, 
              ease: 'easeInOut',
              delay: 1.6,
              times: [0, 0.4, 1]
            }}
            className="absolute inset-0 rounded-[32px] border border-cyan-200/40 pointer-events-none z-0"
          />

          <div className="w-24 h-24 flex items-center justify-center overflow-hidden p-0 relative z-10">
            <motion.div
              animate={{ scale: [1, 1.03, 1], opacity: [0.94, 1, 0.94] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full h-full flex items-center justify-center"
            >
              {!logoError ? (
                <img 
                  src={LOGO_URL} 
                  alt="i-Serve Logo" 
                  onError={() => setLogoError(true)}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[32px] border border-white/20 flex items-center justify-center shadow-2xl">
                  <Droplets className="w-12 h-12 text-white" />
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Brand Text Fade In */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-200 mt-2 font-medium">
            Premium Home Services
          </p>
        </motion.div>
      </div>

      {/* Footer hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1.2 }}
        className="text-white/60 text-xs font-sans mb-4 z-10"
      >
        Tap anywhere to skip
      </motion.p>
    </div>
  );
};
