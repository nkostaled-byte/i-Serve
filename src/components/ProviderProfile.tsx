import React, { useState, useEffect } from 'react';
import { 
  User, Camera, ShieldCheck, MapPin, Clock, Star, DollarSign, 
  Settings, LogOut, ChevronRight, Plus, Sliders, Check,
  Award, Briefcase, FileText, Phone, Mail, Edit3, Image as ImageIcon,
  Sun, Moon, Monitor, Bell
} from 'lucide-react';
import { ServiceProvider, AppScreen } from '../types';
import { useTheme } from '../context/ThemeContext';
import { requestNotificationPermission, checkNotificationPermission } from '../utils/notifications';

interface ProviderProfileProps {
  provider: ServiceProvider;
  onSwitchRole: () => void;
  onLogout: () => void;
}

export const ProviderProfile: React.FC<ProviderProfileProps> = ({
  provider,
  onSwitchRole,
  onLogout,
}) => {
  const { themeMode, setThemeMode } = useTheme();
  const [avatarUrl, setAvatarUrl] = useState(provider.avatarUrl);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [businessName, setBusinessName] = useState(provider.name + ' Trade Services');
  const [bio, setBio] = useState(provider.bio || 'Master Certified Electrician & Master Plumber with over 8 years of residential and commercial service experience in the Bay Area.');
  const [workingRadius, setWorkingRadius] = useState<number>(18); // km
  const [isEditingBio, setIsEditingBio] = useState(false);
  
  // Portfolio items
  const [portfolio, setPortfolio] = useState([
    { id: '1', title: 'DB Board Rewiring & Surge Protection', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400' },
    { id: '2', title: 'Copper Pipe Replacement & Sump Pump', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=400' },
    { id: '3', title: 'Solar Inverter & Battery Hookup', image: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&q=80&w=400' },
  ]);

  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [pushAlerts, setPushAlerts] = useState(true);

  useEffect(() => {
    setPushAlerts(checkNotificationPermission());
  }, []);

  const handleAvatarChange = (newUrl: string) => {
    setAvatarUrl(newUrl);
    setIsEditingPhoto(false);
  };

  const handleAddPortfolioSample = () => {
    const newSample = {
      id: Date.now().toString(),
      title: 'Commercial HVAC Diagnostic & Filter Service',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400',
    };
    setPortfolio([newSample, ...portfolio]);
  };

  const handleInstantPayout = () => {
    setPayoutSuccess(true);
    setTimeout(() => setPayoutSuccess(false), 3500);
  };

  return (
    <div className="pb-28 pt-[calc(env(safe-area-inset-top)+1rem)] px-4 max-w-md mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div
        className="flex items-center justify-between"
      >
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#3F73C7] dark:text-[#21C7F6]">
            Provider Account
          </span>
          <h1 className="text-2xl font-serif font-normal text-slate-900 dark:text-white">
            Partner Profile
          </h1>
        </div>

        <button
          onClick={onSwitchRole}
          className="px-3.5 py-1.5 bg-slate-100 dark:bg-[#17243C] hover:bg-slate-200 dark:hover:bg-[#1E2E4A] text-slate-700 dark:text-[#B8C3D9] text-xs font-semibold rounded-full flex items-center space-x-1 border border-slate-200/80 dark:border-white/[0.06]"
        >
          <span>Customer View</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Profile Header & Photo Editor */}
      <div
        className="bg-white dark:bg-[#131E33] p-5 rounded-[32px] card-shadow border border-slate-100 dark:border-white/[0.06] space-y-4 text-center relative overflow-hidden"
      >
        <div className="relative inline-block mx-auto">
          <img
            src={avatarUrl}
            alt={provider.name}
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded-full object-cover float-shadow border-4 border-white dark:border-[#131E33] mx-auto ring-2 ring-[#3F73C7]/30 dark:ring-[#21C7F6]/30"
          />
        </div>

        <div>
          <div className="flex items-center justify-center space-x-1.5">
            <h2 className="text-xl font-serif text-slate-900 dark:text-white font-normal">{provider.name}</h2>
            <ShieldCheck className="w-5 h-5 text-[#3F73C7] dark:text-[#21C7F6] fill-[#3F73C7]/20 dark:fill-[#21C7F6]/20" />
          </div>
          <p className="text-xs font-semibold text-[#3F73C7] dark:text-[#21C7F6]">{businessName}</p>
          <span className="inline-block text-[10px] font-medium text-slate-400 dark:text-[#7F8DA8] mt-0.5">
            Verified License ID: #EC-98204-SF
          </span>
        </div>

        {/* Key Metrics Pill Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
          <div className="bg-slate-50 dark:bg-[#0E1628] p-2.5 rounded-2xl text-center">
            <div className="flex items-center justify-center space-x-1 text-amber-500 font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>4.9</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#7F8DA8]">310 Reviews</span>
          </div>

          <div className="bg-slate-50 dark:bg-[#0E1628] p-2.5 rounded-2xl text-center">
            <div className="text-sm font-serif font-semibold text-slate-900 dark:text-white">
              {provider.completedJobs}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#7F8DA8]">Completed</span>
          </div>

          <div className="bg-slate-50 dark:bg-[#0E1628] p-2.5 rounded-2xl text-center">
            <div className="text-sm font-serif font-semibold text-emerald-600 dark:text-[#2DD36F]">
              98%
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#7F8DA8]">Accept Rate</span>
          </div>
        </div>
      </div>

      {/* Earnings & Instant Payout Card */}
      <div
        className="bg-gradient-to-tr from-slate-900 via-slate-800 to-[#3F73C7] dark:from-[#0E1628] dark:via-[#131E33] dark:to-[#17243C] p-5 rounded-[32px] text-white float-shadow space-y-3 border border-white/10"
      >
        <div className="flex items-center justify-between text-xs text-slate-300 dark:text-[#B8C3D9]">
          <span>Available Balance</span>
          <span className="bg-white/20 dark:bg-white/10 px-2.5 py-0.5 rounded-full text-white text-[10px] font-semibold">
            Ready to Transfer
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-serif font-normal">$1,280.00</span>
            <p className="text-[11px] text-cyan-200 dark:text-[#21C7F6] mt-0.5">Payout schedule: Weekly (Every Mon)</p>
          </div>
          <button
            onClick={handleInstantPayout}
            className="px-4 py-2.5 bg-white dark:bg-[#21C7F6] text-slate-900 dark:text-[#070B14] text-xs font-semibold rounded-full float-shadow active:scale-95 hover:bg-slate-100 dark:hover:bg-[#21C7F6]/90 flex items-center space-x-1"
          >
            <DollarSign className="w-4 h-4 text-[#3F73C7] dark:text-[#070B14]" />
            <span>Instant Payout</span>
          </button>
        </div>

        {payoutSuccess && (
          <div
            className="bg-emerald-500 dark:bg-[#2DD36F] text-white dark:text-[#070B14] p-2.5 rounded-2xl text-xs font-semibold text-center flex items-center justify-center space-x-1.5"
          >
            <Check className="w-4 h-4" />
            <span>$1,280.00 payout sent to Visa Debit (••8842)!</span>
          </div>
        )}
      </div>

      {/* Appearance Section */}
      <div
        className="bg-white dark:bg-[#131E33] p-5 rounded-[28px] card-shadow border border-slate-100 dark:border-white/[0.06] space-y-3"
      >
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#7F8DA8]">
          Appearance
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setThemeMode('light')}
            className={`p-3 rounded-[18px] flex flex-col items-center justify-center space-y-1.5 border transition-all cursor-pointer ${
              themeMode === 'light'
                ? 'bg-cyan-50 border-[#27C2D4] text-[#27C2D4] dark:bg-[#21C7F6]/15 dark:border-[#21C7F6] dark:text-[#21C7F6] font-semibold'
                : 'bg-slate-50 dark:bg-[#0E1628] border-transparent text-slate-600 dark:text-[#B8C3D9] hover:bg-slate-100 dark:hover:bg-[#17243C]'
            }`}
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs">Light Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setThemeMode('dark')}
            className={`p-3 rounded-[18px] flex flex-col items-center justify-center space-y-1.5 border transition-all cursor-pointer ${
              themeMode === 'dark'
                ? 'bg-cyan-50 border-[#27C2D4] text-[#27C2D4] dark:bg-[#21C7F6]/15 dark:border-[#21C7F6] dark:text-[#21C7F6] font-semibold'
                : 'bg-slate-50 dark:bg-[#0E1628] border-transparent text-slate-600 dark:text-[#B8C3D9] hover:bg-slate-100 dark:hover:bg-[#17243C]'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span className="text-xs">Dark Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setThemeMode('system')}
            className={`p-3 rounded-[18px] flex flex-col items-center justify-center space-y-1.5 border transition-all cursor-pointer ${
              themeMode === 'system'
                ? 'bg-cyan-50 border-[#27C2D4] text-[#27C2D4] dark:bg-[#21C7F6]/15 dark:border-[#21C7F6] dark:text-[#21C7F6] font-semibold'
                : 'bg-slate-50 dark:bg-[#0E1628] border-transparent text-slate-600 dark:text-[#B8C3D9] hover:bg-slate-100 dark:hover:bg-[#17243C]'
            }`}
          >
            <Monitor className="w-5 h-5" />
            <span className="text-xs text-center leading-tight">Follow System</span>
          </button>
        </div>
      </div>

      {/* Business Info & Bio */}
      <div
        className="bg-white dark:bg-[#131E33] p-5 rounded-[28px] card-shadow border border-slate-100 dark:border-white/[0.06] space-y-3"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#7F8DA8]">
            About & Business Info
          </h3>
          <button
            onClick={() => setIsEditingBio(!isEditingBio)}
            className="text-xs font-semibold text-[#3F73C7] dark:text-[#21C7F6] flex items-center space-x-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditingBio ? 'Save' : 'Edit Bio'}</span>
          </button>
        </div>

        {isEditingBio ? (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0E1628] p-3 rounded-2xl text-xs text-slate-800 dark:text-white border border-slate-200 dark:border-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[#3F73C7]/20"
            rows={3}
          />
        ) : (
          <p className="text-xs text-slate-600 dark:text-[#B8C3D9] leading-relaxed italic">
            "{bio}"
          </p>
        )}

        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/[0.06] text-xs">
          <div className="flex items-center justify-between text-slate-700 dark:text-[#B8C3D9]">
            <span className="text-slate-400 dark:text-[#7F8DA8]">Primary Category</span>
            <span className="font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-[#0E1628] px-2.5 py-0.5 rounded-full">
              {provider.category}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-700 dark:text-[#B8C3D9]">
            <span className="text-slate-400 dark:text-[#7F8DA8]">Hourly Rate</span>
            <span className="font-semibold text-slate-900 dark:text-white">${provider.hourlyRate}/hr</span>
          </div>

          <div className="flex items-center justify-between text-slate-700 dark:text-[#B8C3D9]">
            <span className="text-slate-400 dark:text-[#7F8DA8]">Service Vehicle</span>
            <span className="font-semibold text-slate-900 dark:text-white">{provider.vehicle}</span>
          </div>
        </div>
      </div>

      {/* Specialties & Tags */}
      <div
        className="bg-white dark:bg-[#131E33] p-5 rounded-[28px] card-shadow border border-slate-100 dark:border-white/[0.06] space-y-3"
      >
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#7F8DA8]">
          Specialized Skillset
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Electrical DB Boards', 'Emergency Wiring', 'Solar Battery Hookup', 'Leaking Sump Repair', 'Commercial Outlets', '24/7 Roadside'].map((skill, idx) => (
            <span
              key={idx}
              className="text-xs font-medium text-slate-700 dark:text-[#B8C3D9] bg-slate-100 dark:bg-[#0E1628] px-3 py-1.5 rounded-full flex items-center space-x-1 border border-transparent dark:border-white/[0.06]"
            >
              <Check className="w-3 h-3 text-[#3F73C7] dark:text-[#21C7F6]" />
              <span>{skill}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Working Radius Config */}
      <div
        className="bg-white dark:bg-[#131E33] p-5 rounded-[28px] card-shadow border border-slate-100 dark:border-white/[0.06] space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#3F73C7] dark:text-[#21C7F6]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#B8C3D9]">
              Working Radius
            </h3>
          </div>
          <span className="text-xs font-bold text-[#3F73C7] dark:text-[#21C7F6] bg-[#3F73C7]/10 dark:bg-[#21C7F6]/10 px-2.5 py-0.5 rounded-full">
            {workingRadius} km coverage
          </span>
        </div>

        <input
          type="range"
          min={5}
          max={50}
          value={workingRadius}
          onChange={(e) => setWorkingRadius(Number(e.target.value))}
          className="w-full accent-[#3F73C7] dark:accent-[#21C7F6] cursor-pointer"
        />

        <p className="text-[11px] text-slate-500 dark:text-[#7F8DA8]">
          You will automatically receive job requests within {workingRadius} km from your current live GPS coordinates.
        </p>
      </div>

      {/* Portfolio Showcase */}
      <div
        className="bg-white dark:bg-[#131E33] p-5 rounded-[28px] card-shadow border border-slate-100 dark:border-white/[0.06] space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-4 h-4 text-[#3F73C7] dark:text-[#21C7F6]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#B8C3D9]">
              Work Portfolio ({portfolio.length})
            </h3>
          </div>

          <button
            onClick={handleAddPortfolioSample}
            className="text-xs font-semibold text-[#3F73C7] dark:text-[#21C7F6] hover:underline flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Work Photo</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {portfolio.map((item) => (
            <div key={item.id} className="relative group rounded-2xl overflow-hidden aspect-square border border-slate-100 dark:border-white/[0.06]">
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                <span className="text-[9px] text-white font-medium line-clamp-2">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Notifications */}
      <div
        className="bg-white dark:bg-[#131E33] p-5 rounded-[28px] card-shadow border border-slate-100 dark:border-white/[0.06] space-y-3"
      >
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#7F8DA8]">
          Notifications
        </h3>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-700 dark:text-[#B8C3D9] font-medium">Push Job Alerts</span>
          <button
            type="button"
            onClick={async () => {
              const nextState = !pushAlerts;
              setPushAlerts(nextState);
              if (nextState) {
                await requestNotificationPermission();
              }
            }}
            className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${pushAlerts ? 'bg-[#3F73C7] dark:bg-[#21C7F6]' : 'bg-slate-300 dark:bg-slate-700'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${pushAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Account Settings & Logout */}
      <div
        className="bg-white dark:bg-[#131E33] p-4 rounded-[28px] card-shadow border border-slate-100 dark:border-white/[0.06] space-y-2"
      >
        <button
          onClick={onLogout}
          className="w-full p-3 bg-rose-50 dark:bg-[#FF5D73]/10 hover:bg-rose-100 dark:hover:bg-[#FF5D73]/20 text-rose-600 dark:text-[#FF5D73] rounded-2xl font-semibold text-xs transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Partner Account</span>
        </button>
      </div>
    </div>
  );
};
