import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AppScreen, 
  ServiceCategory, 
  ServiceProvider, 
  UserProfile, 
  ServiceBookingRequest,
  ChatMessage
} from './types';
import { 
  SERVICE_CATEGORIES, 
  MOCK_PROVIDERS, 
  INITIAL_CUSTOMER, 
  INITIAL_PROVIDER_USER, 
  RECENT_REQUESTS,
  INITIAL_CHAT_MESSAGES
} from './data/mockData';

import { InstallPWA } from './components/InstallPWA';
import { SplashScreen } from './components/SplashScreen';
import { ChooseExperience } from './components/ChooseExperience';
import { CustomerAuth } from './components/CustomerAuth';
import { ProviderAuth } from './components/ProviderAuth';
import { CustomerRegistration } from './components/CustomerRegistration';
import { ProviderRegistration } from './components/ProviderRegistration';
import { HomeScreen } from './components/HomeScreen';
import { ServiceDetailsModal } from './components/ServiceDetailsModal';
import { ServiceRequestBottomSheet } from './components/ServiceRequestBottomSheet';
import { SearchingScreen } from './components/SearchingScreen';
import { ProviderAcceptedModal } from './components/ProviderAcceptedModal';
import { LiveTrackingMap } from './components/LiveTrackingMap';
import { ChatScreen } from './components/ChatScreen';
import { JobCompletedModal } from './components/JobCompletedModal';
import { CustomerProfile } from './components/CustomerProfile';
import { ProviderDashboard } from './components/ProviderDashboard';
import { ProviderJobs } from './components/ProviderJobs';
import { ProviderMessages } from './components/ProviderMessages';
import { ProviderProfile } from './components/ProviderProfile';
import { RequestsHistoryScreen } from './components/RequestsHistoryScreen';
import { MessagesListScreen } from './components/MessagesListScreen';
import { FloatingBottomDock } from './components/FloatingBottomDock';

export default function App() {
  // Navigation Stacks & Active Role
  const [entryScreen, setEntryScreen] = useState<AppScreen | null>('install_wall');
  const [activeRole, setActiveRole] = useState<'customer' | 'provider'>('customer');

  const [customerStack, setCustomerStack] = useState<AppScreen[]>(['home']);
  const [providerStack, setProviderStack] = useState<AppScreen[]>(['provider_dashboard']);

  const [user, setUser] = useState<UserProfile>(INITIAL_CUSTOMER);
  const [providerUser, setProviderUser] = useState<UserProfile>(INITIAL_PROVIDER_USER);
  
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedSubService, setSelectedSubService] = useState<import('./types').SubService | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(MOCK_PROVIDERS[0]);
  const [activeBooking, setActiveBooking] = useState<ServiceBookingRequest | null>(RECENT_REQUESTS[0]);
  
  const [categories] = useState<ServiceCategory[]>(SERVICE_CATEGORIES);
  const [providers] = useState<ServiceProvider[]>(MOCK_PROVIDERS);
  const [requestsHistory, setRequestsHistory] = useState<ServiceBookingRequest[]>(RECENT_REQUESTS);
  const [chatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);

  // Compute active screen
  const currentScreen: AppScreen = entryScreen !== null
    ? entryScreen
    : activeRole === 'customer'
      ? (customerStack[customerStack.length - 1] || 'home')
      : (providerStack[providerStack.length - 1] || 'provider_dashboard');

  const CUSTOMER_TAB_SCREENS: AppScreen[] = ['home', 'requests_history', 'messages_list', 'customer_profile'];
  const PROVIDER_TAB_SCREENS: AppScreen[] = ['provider_dashboard', 'provider_jobs', 'provider_messages', 'provider_profile'];

  // Every screen is stacked in the same grid cell (col-start-1 row-start-1) so AnimatePresence
  // can cross-fade between them. Because they're all conditionally rendered from a fixed JSX
  // order (screen #1, #2, #3...), the browser paints later-in-source screens on top of
  // earlier-in-source ones by default - regardless of which one is actually "current".
  // That means navigating "backwards" (e.g. from a screen declared later in the file to one
  // declared earlier, like customer_profile -> home) puts the OLD screen on top of the new one
  // during the exit animation, which reads as a flicker/flash of the previous page.
  // This map keeps a monotonically increasing z-index per screen so whichever one is currently
  // active always paints above everything else, independent of JSX order.
  const zIndexCounter = useRef(1);
  const [zIndexMap, setZIndexMap] = useState<Record<string, number>>({ install_wall: 1 });
  useEffect(() => {
    zIndexCounter.current += 1;
    setZIndexMap((prev) => ({ ...prev, [currentScreen]: zIndexCounter.current }));
  }, [currentScreen]);

  // Role switching (Demo mode) - clear history and load root screen of selected role
  const handleSwitchRole = (newRole: 'customer' | 'provider') => {
    setEntryScreen(null);
    setActiveRole(newRole);
    if (newRole === 'customer') {
      setCustomerStack(['home']);
    } else {
      setProviderStack(['provider_dashboard']);
    }
  };

  // Stack navigation helpers
  const navigateCustomer = (screen: AppScreen) => {
    setEntryScreen(null);
    setActiveRole('customer');
    if (CUSTOMER_TAB_SCREENS.includes(screen)) {
      setCustomerStack([screen]);
    } else {
      setCustomerStack((prev) => {
        if (prev[prev.length - 1] === screen) return prev;
        return [...prev, screen];
      });
    }
  };

  const goBackCustomer = () => {
    setEntryScreen(null);
    setActiveRole('customer');
    setCustomerStack((prev) => (prev.length > 1 ? prev.slice(0, prev.length - 1) : ['home']));
  };

  const navigateProvider = (screen: AppScreen) => {
    setEntryScreen(null);
    setActiveRole('provider');
    if (PROVIDER_TAB_SCREENS.includes(screen)) {
      setProviderStack([screen]);
    } else {
      setProviderStack((prev) => {
        if (prev[prev.length - 1] === screen) return prev;
        return [...prev, screen];
      });
    }
  };

  const goBackProvider = () => {
    setEntryScreen(null);
    setActiveRole('provider');
    setProviderStack((prev) => (prev.length > 1 ? prev.slice(0, prev.length - 1) : ['provider_dashboard']));
  };

  // Helper functions
  const handleUserUpdate = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const handleSelectCategory = (cat: ServiceCategory) => {
    setSelectedCategory(cat);
    navigateCustomer('service_details');
  };

  const handleProceedToRequestSheet = (subSrv?: import('./types').SubService) => {
    if (subSrv) setSelectedSubService(subSrv);
    navigateCustomer('request_sheet');
  };

  const handleSubmitRequest = (details: { 
    address: string; 
    notes: string; 
    paymentMethod: 'paystack_card' | 'paystack_eft' | 'paystack_mobile' | 'apple_pay' | 'credit_card' | 'cash'; 
    amount: number;
    subServiceTitle?: string;
  }) => {
    const cat = selectedCategory || SERVICE_CATEGORIES[0];
    const subTitle = details.subServiceTitle || selectedSubService?.name || `${cat.title} Service`;

    const newRequest: ServiceBookingRequest = {
      id: `req_${Date.now()}`,
      categoryId: cat.id,
      categoryTitle: subTitle,
      subServiceTitle: subTitle,
      providerId: '',
      customerName: user.name,
      address: details.address,
      notes: details.notes,
      paymentMethod: details.paymentMethod,
      amount: details.amount,
      status: 'searching',
      createdAt: 'Just now',
      userCoords: { lat: -26.2041, lng: 28.0473 },
      providerCoords: { lat: -26.1980, lng: 28.0530 },
    };

    setActiveBooking(newRequest);
    setRequestsHistory((prev) => [newRequest, ...prev]);
    navigateCustomer('searching');

    // Simulate a browser notification trigger whenever a provider changes the status of an active job
    setTimeout(() => {
      setActiveBooking((prev) => prev ? { ...prev, status: 'on_the_way' } : null);
      import('./utils/notifications').then(({ sendPushNotification }) => {
        sendPushNotification("Job Update", {
          body: `Provider is now on the way for your ${subTitle}.`,
        });
      });
    }, 15000);

    setTimeout(() => {
      setActiveBooking((prev) => prev ? { ...prev, status: 'in_progress' } : null);
      import('./utils/notifications').then(({ sendPushNotification }) => {
        sendPushNotification("Job Update", {
          body: `Provider has started your ${subTitle}.`,
        });
      });
    }, 30000);

    setTimeout(() => {
      setActiveBooking((prev) => prev ? { ...prev, status: 'completed' } : null);
      import('./utils/notifications').then(({ sendPushNotification }) => {
        sendPushNotification("Job Completed", {
          body: `Your ${subTitle} has been completed!`,
        });
      });
    }, 45000);
  };

  const handleProviderFound = (foundProvider: ServiceProvider) => {
    setSelectedProvider(foundProvider);
    if (activeBooking) {
      setActiveBooking({
        ...activeBooking,
        providerId: foundProvider.id,
        provider: foundProvider,
        status: 'accepted',
      });
    }
    setCustomerStack(['home', 'live_tracking']);
  };

  const handleTriggerEmergency = () => {
    const emergencyCat = SERVICE_CATEGORIES.find(c => c.id === 'electrical') || SERVICE_CATEGORIES[0];
    setSelectedCategory(emergencyCat);
    setSelectedProvider(MOCK_PROVIDERS[0]);
    navigateCustomer('request_sheet');
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] dark:bg-[#0B0F17] text-slate-800 dark:text-white antialiased relative selection:bg-[#27C2D4]/20 selection:text-[#27C2D4] transition-colors duration-200">
      <div className="grid grid-cols-1 grid-rows-1 min-h-screen overflow-x-hidden">
        <AnimatePresence>
          {/* 1. Installation Wall Screen */}
          {currentScreen === 'install_wall' && (
            <motion.div key="install_wall" style={{ zIndex: zIndexMap.install_wall }} className="col-start-1 row-start-1 w-full min-h-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <InstallPWA onProceed={() => setEntryScreen('splash')} />
          </motion.div>
        )}

        {/* 2. Animated Splash Screen */}
        {currentScreen === 'splash' && (
          <motion.div key="splash" style={{ zIndex: zIndexMap.splash }} className="col-start-1 row-start-1 w-full min-h-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <SplashScreen onComplete={() => setEntryScreen('choose_experience')} />
          </motion.div>
        )}

        {/* 3. Choose Experience Screen */}
        {currentScreen === 'choose_experience' && (
          <motion.div key="choose_experience" style={{ zIndex: zIndexMap.choose_experience }} className="col-start-1 row-start-1 w-full min-h-screen" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <ChooseExperience
              onSelectRole={(role) => {
                if (role === 'customer') {
                  setEntryScreen('customer_login');
                } else {
                  setEntryScreen('provider_login');
                }
              }}
            />
          </motion.div>
        )}

        {/* 4. Customer Login */}
        {currentScreen === 'customer_login' && (
          <motion.div key="customer_login" style={{ zIndex: zIndexMap.customer_login }} className="col-start-1 row-start-1 w-full min-h-screen" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <CustomerAuth
              onLoginSuccess={() => handleSwitchRole('customer')}
              onGoToRegister={() => setEntryScreen('customer_register')}
              onBack={() => setEntryScreen('choose_experience')}
            />
          </motion.div>
        )}

        {/* 5. Provider Login */}
        {currentScreen === 'provider_login' && (
          <motion.div key="provider_login" style={{ zIndex: zIndexMap.provider_login }} className="col-start-1 row-start-1 w-full min-h-screen" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <ProviderAuth
              onLoginSuccess={() => handleSwitchRole('provider')}
              onGoToRegister={() => setEntryScreen('provider_register')}
              onBack={() => setEntryScreen('choose_experience')}
            />
          </motion.div>
        )}

        {/* 6. Customer Registration Flow */}
        {currentScreen === 'customer_register' && (
          <motion.div key="customer_register" style={{ zIndex: zIndexMap.customer_register }} className="col-start-1 row-start-1 w-full min-h-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <CustomerRegistration
              onComplete={(newUser) => {
                handleUserUpdate(newUser);
                handleSwitchRole('customer');
              }}
              onBack={() => setEntryScreen('customer_login')}
            />
          </motion.div>
        )}

        {/* 7. Provider Registration Flow */}
        {currentScreen === 'provider_register' && (
          <motion.div key="provider_register" style={{ zIndex: zIndexMap.provider_register }} className="col-start-1 row-start-1 w-full min-h-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <ProviderRegistration
              onComplete={(newProv) => {
                setProviderUser((prev) => ({ ...prev, ...newProv }));
                handleSwitchRole('provider');
              }}
              onBack={() => setEntryScreen('provider_login')}
            />
          </motion.div>
        )}

        {/* 8. Main Home Screen */}
        {(currentScreen === 'home' || (currentScreen === 'service_details' && (customerStack[customerStack.length - 2] || 'home') === 'home')) && (
          <motion.div 
            key="home" 
            style={{ zIndex: zIndexMap.home }}
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`col-start-1 row-start-1 w-full min-h-screen ${currentScreen === 'service_details' ? "filter blur-sm pointer-events-none transition-all duration-300" : "transition-all duration-300"}`}
          >
            <HomeScreen
              user={user}
              categories={categories}
              providers={providers}
              recentRequests={requestsHistory}
              activeRequest={activeBooking}
              onSelectCategory={handleSelectCategory}
              onSelectProvider={(prov) => {
                setSelectedProvider(prov);
                const matchedCat = categories.find(c => c.title.toLowerCase() === prov.category.toLowerCase()) || categories[0];
                setSelectedCategory(matchedCat);
                navigateCustomer('service_details');
              }}
              onRequestEmergency={handleTriggerEmergency}
              onOpenSearch={() => {
                const elec = categories[0];
                handleSelectCategory(elec);
              }}
              onViewRequestDetails={(req) => {
                setActiveBooking(req);
                if (req.provider) setSelectedProvider(req.provider);
                setCustomerStack(['home', 'live_tracking']);
              }}
            />
          </motion.div>
        )}



        {/* 10. Service Request Bottom Sheet */}
        {currentScreen === 'request_sheet' && selectedCategory && (
          <motion.div key="request_sheet" style={{ zIndex: zIndexMap.request_sheet }} className="col-start-1 row-start-1 w-full min-h-screen z-50" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <ServiceRequestBottomSheet
              category={selectedCategory}
              subService={selectedSubService || undefined}
              user={user}
              onClose={() => goBackCustomer()}
              onSubmitRequest={handleSubmitRequest}
            />
          </motion.div>
        )}

        {/* 11. Searching Experience (Animated Radar) */}
        {currentScreen === 'searching' && selectedCategory && (
          <motion.div key="searching" style={{ zIndex: zIndexMap.searching }} className="col-start-1 row-start-1 w-full min-h-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <SearchingScreen
              category={selectedCategory}
              availableProviders={providers}
              onProviderFound={handleProviderFound}
              onCancel={() => goBackCustomer()}
            />
          </motion.div>
        )}

        {/* 12. Provider Accepted Modal */}
        {currentScreen === 'provider_accepted' && selectedProvider && (
          <motion.div key="provider_accepted" style={{ zIndex: zIndexMap.provider_accepted }} className="col-start-1 row-start-1 w-full min-h-screen z-50" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <ProviderAcceptedModal
              provider={selectedProvider}
              onTrackOnMap={() => setCustomerStack(['home', 'live_tracking'])}
            />
          </motion.div>
        )}

        {/* 13. Live GPS Tracking Map */}
        {currentScreen === 'live_tracking' && selectedProvider && activeBooking && (
          <motion.div key="live_tracking" style={{ zIndex: zIndexMap.live_tracking }} className="col-start-1 row-start-1 w-full min-h-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <LiveTrackingMap
              provider={selectedProvider}
              bookingRequest={activeBooking}
              onOpenChat={() => {
                if (activeRole === 'provider') {
                  navigateProvider('chat');
                } else {
                  navigateCustomer('chat');
                }
              }}
              onCancelRequest={() => {
                if (activeRole === 'provider') {
                  goBackProvider();
                } else {
                  goBackCustomer();
                }
              }}
              onCompleteJob={() => {
                if (activeRole === 'provider') {
                  navigateProvider('job_completed');
                } else {
                  navigateCustomer('job_completed');
                }
              }}
              onBack={() => {
                if (activeRole === 'provider') {
                  goBackProvider();
                } else {
                  goBackCustomer();
                }
              }}
            />
          </motion.div>
        )}

        {/* 14. Chat Screen */}
        {currentScreen === 'chat' && selectedProvider && (
          <motion.div key="chat" style={{ zIndex: zIndexMap.chat }} className="col-start-1 row-start-1 w-full min-h-screen" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <ChatScreen
              provider={selectedProvider}
              initialMessages={chatMessages}
              onBack={() => {
                if (activeRole === 'provider') {
                  goBackProvider();
                } else {
                  goBackCustomer();
                }
              }}
            />
          </motion.div>
        )}

        {/* 15. Job Completed Celebration Modal */}
        {currentScreen === 'job_completed' && selectedProvider && activeBooking && (
          <motion.div key="job_completed" style={{ zIndex: zIndexMap.job_completed }} className="col-start-1 row-start-1 w-full min-h-screen z-50" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <JobCompletedModal
              bookingRequest={activeBooking}
              provider={selectedProvider}
              onDone={() => {
                if (activeRole === 'provider') {
                  navigateProvider('provider_dashboard');
                } else {
                  navigateCustomer('home');
                }
              }}
              onBookAgain={() => {
                if (activeRole === 'provider') {
                  navigateProvider('provider_jobs');
                } else {
                  navigateCustomer('service_details');
                }
              }}
            />
          </motion.div>
        )}

        {/* 16. Customer Profile & Settings */}
        {(currentScreen === 'customer_profile' || (currentScreen === 'service_details' && customerStack[customerStack.length - 2] === 'customer_profile')) && (
          <motion.div 
            key="customer_profile" 
            style={{ zIndex: zIndexMap.customer_profile }}
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`col-start-1 row-start-1 w-full min-h-screen ${currentScreen === 'service_details' ? "filter blur-sm pointer-events-none transition-all duration-300" : "transition-all duration-300"}`}
          >
            <CustomerProfile
              user={user}
              onUpdateUser={handleUserUpdate}
              onLogout={() => setEntryScreen('choose_experience')}
              onSwitchRole={() => handleSwitchRole('provider')}
            />
          </motion.div>
        )}

        {/* 17. Provider Dashboard */}
        {currentScreen === 'provider_dashboard' && selectedProvider && (
          <motion.div key="provider_dashboard" style={{ zIndex: zIndexMap.provider_dashboard }} className="col-start-1 row-start-1 w-full min-h-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <ProviderDashboard
              provider={selectedProvider}
              activeRequests={requestsHistory}
              onAcceptRequest={(req) => {
                setActiveBooking(req);
                if (req.provider) setSelectedProvider(req.provider);
                navigateProvider('live_tracking');
              }}
              onDeclineRequest={(req) => {
                setRequestsHistory((prev) => prev.filter(r => r.id !== req.id));
              }}
              onSwitchRole={() => handleSwitchRole('customer')}
            />
          </motion.div>
        )}

        {/* 17b. Provider Jobs Screen */}
        {currentScreen === 'provider_jobs' && (
          <motion.div key="provider_jobs" style={{ zIndex: zIndexMap.provider_jobs }} className="col-start-1 row-start-1 w-full min-h-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <ProviderJobs
              allRequests={requestsHistory}
              onAcceptJob={(req) => {
                setActiveBooking(req);
                navigateProvider('live_tracking');
              }}
              onDeclineJob={(req) => {
                setRequestsHistory((prev) => prev.filter(r => r.id !== req.id));
              }}
              onCompleteJob={(req) => {
                setActiveBooking({ ...req, status: 'completed' });
                navigateProvider('job_completed');
              }}
              onNavigateToChat={() => navigateProvider('chat')}
              onNavigateToTracking={(req) => {
                setActiveBooking(req);
                navigateProvider('live_tracking');
              }}
            />
          </motion.div>
        )}

        {/* 17c. Provider Messages Screen */}
        {currentScreen === 'provider_messages' && (
          <motion.div key="provider_messages" style={{ zIndex: zIndexMap.provider_messages }} className="col-start-1 row-start-1 w-full min-h-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <ProviderMessages
              onOpenChat={() => navigateProvider('chat')}
            />
          </motion.div>
        )}

        {/* 17d. Provider Profile Screen */}
        {currentScreen === 'provider_profile' && selectedProvider && (
          <motion.div key="provider_profile" style={{ zIndex: zIndexMap.provider_profile }} className="col-start-1 row-start-1 w-full min-h-screen" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <ProviderProfile
              provider={selectedProvider}
              onSwitchRole={() => handleSwitchRole('customer')}
              onLogout={() => setEntryScreen('choose_experience')}
            />
          </motion.div>
        )}

        {/* 18. Requests History Screen */}
        {(currentScreen === 'requests_history' || (currentScreen === 'service_details' && customerStack[customerStack.length - 2] === 'requests_history')) && (
          <motion.div 
            key="requests_history" 
            style={{ zIndex: zIndexMap.requests_history }}
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`col-start-1 row-start-1 w-full min-h-screen ${currentScreen === 'service_details' ? "filter blur-sm pointer-events-none transition-all duration-300" : "transition-all duration-300"}`}
          >
            <RequestsHistoryScreen
              requests={requestsHistory}
              onSelectRequest={(req) => {
                setActiveBooking(req);
                if (req.provider) setSelectedProvider(req.provider);
                navigateCustomer('live_tracking');
              }}
              onBack={() => goBackCustomer()}
            />
          </motion.div>
        )}

        {/* 19. Messages List Screen */}
        {(currentScreen === 'messages_list' || (currentScreen === 'service_details' && customerStack[customerStack.length - 2] === 'messages_list')) && (
          <motion.div 
            key="messages_list" 
            style={{ zIndex: zIndexMap.messages_list }}
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`col-start-1 row-start-1 w-full min-h-screen ${currentScreen === 'service_details' ? "filter blur-sm pointer-events-none transition-all duration-300" : "transition-all duration-300"}`}
          >
            <MessagesListScreen
              providers={providers}
              onOpenChat={(prov) => {
                setSelectedProvider(prov);
                navigateCustomer('chat');
              }}
              onBack={() => goBackCustomer()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>

      {/* 9. Service Details Modal (Independent Overlay) */}
      <AnimatePresence>
        {currentScreen === 'service_details' && selectedCategory && (
          <ServiceDetailsModal
            category={selectedCategory}
            onClose={() => goBackCustomer()}
            onProceedToRequest={handleProceedToRequestSheet}
          />
        )}
      </AnimatePresence>

      {/* Floating Frosted Glass Bottom Navigation Dock */}
      <FloatingBottomDock
        currentScreen={currentScreen}
        activeRole={activeRole}
        hasActiveRequest={Boolean(activeBooking && ['searching', 'pending', 'accepted', 'on_the_way', 'arrived', 'in_progress'].includes(activeBooking.status))}
        userAvatarUrl={
          activeRole === 'provider'
            ? (selectedProvider?.avatarUrl || providerUser.avatarUrl)
            : user?.avatarUrl
        }
        onNavigate={(scr) => {
          if (activeRole === 'provider') {
            navigateProvider(scr);
          } else {
            navigateCustomer(scr);
          }
        }}
        onRequestEmergency={handleTriggerEmergency}
      />
    </div>
  );
}
