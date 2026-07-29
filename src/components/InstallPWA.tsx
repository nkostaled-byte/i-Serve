import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Share, Plus, Smartphone, ShieldCheck, Zap, WifiOff, BellRing } from 'lucide-react';

interface InstallPWAProps {
  onProceed: () => void;
}

export const InstallPWA: React.FC<InstallPWAProps> = ({ onProceed }) => {
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        onProceed();
      }
      setDeferredPrompt(null);
    } else {
      onProceed();
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col justify-between p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#27C2D4]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#3F73C7]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header branding */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-6 text-center z-10"
      >
        <div className="w-20 h-20 mx-auto flex items-center justify-center mb-4 overflow-hidden p-0">
          {!logoError ? (
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/i-serve-bcf9a.appspot.com/o/assets%2Fi-Serve%20rounded%20logo%20512x512.webp?alt=media&token=c4a156b3-7bec-4cca-b725-fbde3b0c5d1e" 
              alt="i-Serve Logo" 
              onError={() => setLogoError(true)}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-tr from-[#27C2D4] via-[#3F73C7] to-[#4340A8] rounded-[24px] flex items-center justify-center float-shadow text-white">
              <Smartphone className="w-10 h-10" />
            </div>
          )}
        </div>

        <h1 className="text-3xl font-serif text-slate-900 mt-3 font-normal">
          Install i-Serve
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto font-sans">
          Get the full Editors' Choice experience with live GPS tracking and instant home service dispatch.
        </p>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="my-6 space-y-3 z-10"
      >
        <div className="bg-white p-4 rounded-[24px] card-shadow flex items-center space-x-4">
          <div className="w-12 h-12 bg-[#27C2D4]/10 text-[#27C2D4] rounded-2xl flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">Instant Launch & Access</h3>
            <p className="text-xs text-slate-500">Opens instantly from home screen without browser bars.</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[24px] card-shadow flex items-center space-x-4">
          <div className="w-12 h-12 bg-[#3F73C7]/10 text-[#3F73C7] rounded-2xl flex items-center justify-center shrink-0">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">Real-time Dispatch Alerts</h3>
            <p className="text-xs text-slate-500">Live provider ETA updates & push notifications.</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-[24px] card-shadow flex items-center space-x-4">
          <div className="w-12 h-12 bg-[#4340A8]/10 text-[#4340A8] rounded-2xl flex items-center justify-center shrink-0">
            <WifiOff className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">Offline Request Ready</h3>
            <p className="text-xs text-slate-500">View recent bookings and saved locations offline.</p>
          </div>
        </div>
      </motion.div>

      {/* Installation Instructions / Action */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 z-10"
      >
        {isIOS ? (
          <div className="bg-white p-5 rounded-[24px] card-shadow space-y-3">
            <h4 className="font-semibold text-slate-900 text-sm flex items-center space-x-2">
              <Share className="w-4 h-4 text-[#27C2D4]" />
              <span>iOS Install Steps:</span>
            </h4>
            <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside font-sans leading-relaxed">
              <li>Tap the <span className="font-semibold text-slate-800">Share button</span> in your Safari toolbar below.</li>
              <li>Scroll down and select <span className="font-semibold text-slate-800">"Add to Home Screen"</span> <Plus className="w-3.5 h-3.5 inline text-[#27C2D4]" />.</li>
              <li>Tap <span className="font-semibold text-[#27C2D4]">Add</span> in the top right corner.</li>
            </ol>
          </div>
        ) : (
          <button
            id="install-app-btn"
            onClick={handleInstallClick}
            className="w-full py-4 bg-gradient-to-r from-[#27C2D4] to-[#3F73C7] text-white font-medium rounded-[24px] float-shadow flex items-center justify-center space-x-2 text-base active:scale-[0.98] transition-transform"
          >
            <Download className="w-5 h-5" />
            <span>Install i-Serve App</span>
          </button>
        )}

        <button
          id="proceed-to-app-btn"
          onClick={onProceed}
          className="w-full py-3.5 bg-white text-slate-600 font-medium rounded-[24px] card-shadow text-sm hover:bg-slate-50 transition-colors"
        >
          {isInstalled ? "Launch Application" : "Continue in Browser Experience"}
        </button>
      </motion.div>
    </div>
  );
};
