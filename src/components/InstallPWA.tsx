import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Share, Plus, Smartphone, Zap, WifiOff, BellRing } from 'lucide-react';

interface InstallPWAProps {
  onProceed: () => void;
}

export const InstallPWA: React.FC<InstallPWAProps> = ({ onProceed }) => {
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    // Check if running in native standalone PWA window
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      onProceed();
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, [onProceed]);

  const handleProceedClick = () => {
    try {
      localStorage.setItem('is_pwa_installed', 'true');
    } catch (e) {}
    onProceed();
  };

  const handleInstallClick = async () => {
    try {
      localStorage.setItem('is_pwa_installed', 'true');
    } catch (e) {}

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
    <div className="min-h-screen bg-[#F6F8FB] dark:bg-[#0B0F17] flex flex-col justify-between px-6 pb-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] max-w-md mx-auto relative overflow-hidden font-sans">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#27C2D4]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#3F73C7]/20 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Top Header branding */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-4 text-center z-10"
      >
        <div className="w-20 h-20 mx-auto flex items-center justify-center mb-3 overflow-hidden p-0">
          {!logoError ? (
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/i-serve-bcf9a.appspot.com/o/assets%2Fi-Serve%20rounded%20logo%20512x512.webp?alt=media&token=c4a156b3-7bec-4cca-b725-fbde3b0c5d1e" 
              alt="i-Serve Logo" 
              onError={() => setLogoError(true)}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-tr from-[#27C2D4] via-[#3F73C7] to-[#4340A8] rounded-2xl flex items-center justify-center float-shadow text-white">
              <Smartphone className="w-10 h-10" />
            </div>
          )}
        </div>

        <h1 className="text-3xl font-serif text-slate-900 dark:text-white mt-2 font-normal">
          Install i-Serve
        </h1>
        <p className="text-slate-500 dark:text-[#B8C3D9] text-sm mt-1 max-w-xs mx-auto font-sans leading-relaxed">
          Get the full Editors' Choice experience with live GPS tracking and instant home service dispatch.
        </p>
      </motion.div>

      {/* 2. Installation Instructions & Action Card AT THE TOP */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="my-5 space-y-3 z-10"
      >
        {isIOS ? (
          <div className="bg-white dark:bg-[#131E33] p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
              <Share className="w-4 h-4 text-[#27C2D4] dark:text-[#21C7F6]" />
              <span>iOS Installation Instructions:</span>
            </h4>
            <ol className="text-xs text-slate-600 dark:text-[#B8C3D9] space-y-2 list-decimal list-inside font-sans leading-relaxed">
              <li>Tap the <span className="font-semibold text-slate-800 dark:text-white">Share icon</span> in your Safari toolbar below.</li>
              <li>Scroll down and select <span className="font-semibold text-slate-800 dark:text-white">"Add to Home Screen"</span> <Plus className="w-3.5 h-3.5 inline text-[#27C2D4] dark:text-[#21C7F6]" />.</li>
              <li>Tap <span className="font-semibold text-[#27C2D4] dark:text-[#21C7F6]">Add</span> in the top right corner.</li>
            </ol>
          </div>
        ) : (
          <button
            id="install-app-btn"
            onClick={handleInstallClick}
            className="w-full py-4 bg-gradient-to-r from-[#27C2D4] to-[#3F73C7] text-white font-semibold rounded-2xl float-shadow flex items-center justify-center space-x-2 text-base active:scale-[0.98] transition-transform cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>Install i-Serve App</span>
          </button>
        )}

        <button
          id="proceed-to-app-btn"
          onClick={handleProceedClick}
          className="w-full py-3.5 bg-white dark:bg-[#131E33] text-slate-700 dark:text-white font-semibold rounded-2xl border border-slate-200/80 dark:border-white/[0.06] text-sm hover:bg-slate-50 dark:hover:bg-[#17243C] transition-colors cursor-pointer"
        >
          {isInstalled ? "Launch Application" : "Continue in Browser Experience"}
        </button>
      </motion.div>

      {/* 3. Feature Highlights - Clean Informational Rows (No Button/Card Container) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4 space-y-2 z-10"
      >
        <div className="flex items-center space-x-3.5 py-1.5 px-1">
          <div className="w-9 h-9 bg-[#27C2D4]/10 text-[#27C2D4] dark:text-[#21C7F6] rounded-xl flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-xs">Instant Launch & Access</h3>
            <p className="text-[11px] text-slate-500 dark:text-[#7F8DA8]">Opens instantly from home screen without browser chrome.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3.5 py-1.5 px-1">
          <div className="w-9 h-9 bg-[#3F73C7]/10 text-[#3F73C7] dark:text-[#21C7F6] rounded-xl flex items-center justify-center shrink-0">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-xs">Real-time Dispatch Alerts</h3>
            <p className="text-[11px] text-slate-500 dark:text-[#7F8DA8]">Live provider ETA updates & push notifications.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3.5 py-1.5 px-1">
          <div className="w-9 h-9 bg-[#4340A8]/10 text-[#4340A8] dark:text-[#21C7F6] rounded-xl flex items-center justify-center shrink-0">
            <WifiOff className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-xs">Offline Request Ready</h3>
            <p className="text-[11px] text-slate-500 dark:text-[#7F8DA8]">View recent bookings and saved locations offline.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

