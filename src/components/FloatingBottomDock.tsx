import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Home, ClipboardList, MessageSquare, User, LayoutDashboard, Briefcase } from 'lucide-react';
import { AppScreen } from '../types';

interface FloatingBottomDockProps {
  currentScreen: AppScreen;
  activeRole?: 'customer' | 'provider';
  hasActiveRequest?: boolean;
  userAvatarUrl?: string;
  onNavigate: (screen: AppScreen) => void;
  onRequestEmergency?: () => void;
}

export const FloatingBottomDock: React.FC<FloatingBottomDockProps> = ({
  currentScreen,
  activeRole,
  hasActiveRequest,
  userAvatarUrl,
  onNavigate,
}) => {
  // Navigation dock remains persistently visible at bottom without auto-hiding on scroll
  const hideScreens: AppScreen[] = [
    'install_wall',
    'splash',
    'choose_experience',
    'customer_login',
    'provider_login',
    'customer_register',
    'provider_register',
    'service_details',
    'request_sheet',
    'searching',
    'provider_accepted',
    'live_tracking',
    'chat',
  ];

  if (hideScreens.includes(currentScreen)) return null;

  const isProviderMode = activeRole === 'provider' || currentScreen.startsWith('provider_');

  const customerTabs = [
    { id: 'home' as AppScreen, label: 'Home', icon: Home },
    { id: 'requests_history' as AppScreen, label: 'Requests', icon: ClipboardList },
    { id: 'messages_list' as AppScreen, label: 'Messages', icon: MessageSquare },
    { id: 'customer_profile' as AppScreen, label: 'Profile', icon: User, isProfile: true },
  ];

  const providerTabs = [
    { id: 'provider_dashboard' as AppScreen, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'provider_jobs' as AppScreen, label: 'Jobs', icon: Briefcase },
    { id: 'provider_messages' as AppScreen, label: 'Messages', icon: MessageSquare },
    { id: 'provider_profile' as AppScreen, label: 'Profile', icon: User, isProfile: true },
  ];

  const tabs = isProviderMode ? providerTabs : customerTabs;
  const activeColorClass = isProviderMode ? 'text-[#3F73C7]' : 'text-[#27C2D4]';
  const activeBgDotClass = isProviderMode ? 'bg-[#3F73C7] shadow-[0_0_8px_#3F73C7]' : 'bg-[#27C2D4] shadow-[0_0_8px_#27C2D4]';

  const handleTabClick = (screen: AppScreen) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignore if unsupported or restricted
      }
    }
    onNavigate(screen);
  };

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-3.5 left-0 right-0 z-40 max-w-md mx-auto px-3.5 pointer-events-none"
    >
      <nav
        aria-label="Bottom Navigation"
        className="pointer-events-auto w-full h-[62px] frosted-glass dark:bg-[#111827]/90 rounded-[24px] border border-white/80 dark:border-white/10 shadow-[0_12px_32px_rgba(15,23,42,0.08)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.5)] flex items-center justify-between px-2 relative transition-colors"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center group cursor-pointer focus:outline-none"
            >
              <div className="relative flex items-center justify-center">
                {tab.isProfile && userAvatarUrl ? (
                  <motion.div
                    animate={{
                      scale: isActive ? 1.12 : 1.0,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                    className={`relative w-[22px] h-[22px] rounded-full overflow-hidden transition-all duration-200 ${
                      isActive ? 'ring-2 ring-[#27C2D4] ring-offset-1' : 'opacity-70 group-hover:opacity-100'
                    }`}
                  >
                    <img
                      src={userAvatarUrl}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{
                      scale: isActive ? 1.12 : 1.0,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                    className="relative"
                  >
                    <Icon
                      className={`w-[22px] h-[22px] stroke-[1.8] transition-colors duration-200 ${
                        isActive
                          ? activeColorClass
                          : 'text-[#7B8794] dark:text-[#94A3B8] group-hover:text-slate-800 dark:group-hover:text-white'
                      }`}
                    />
                  </motion.div>
                )}
              </div>

              {/* Inactive labels remain visible at ~75% opacity, active label is fully visible & bold */}
              <span
                className={`text-[10px] font-medium tracking-tight mt-0.5 transition-colors duration-200 ${
                  isActive
                    ? `${activeColorClass} font-semibold`
                    : 'text-[#7B8794]/75 dark:text-[#94A3B8] group-hover:text-slate-700 dark:group-hover:text-white'
                }`}
              >
                {tab.label}
              </span>

              {/* Subtle animated glowing dot beneath active tab */}
              {isActive && (
                <motion.div
                  layoutId="activeDockDot"
                  className={`absolute bottom-1 w-1 h-1 rounded-full ${activeBgDotClass}`}
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </motion.div>
  );
};
