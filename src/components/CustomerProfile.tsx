import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, MapPin, Phone, Mail, Bell, LogOut, ShieldCheck, Check, Edit2, Key, CreditCard, UserPlus, Plus, Trash2, X, Lock, Sun, Moon, Monitor } from 'lucide-react';
import { UserProfile, SavedLocation } from '../types';
import { useTheme } from '../context/ThemeContext';
import { requestNotificationPermission, checkNotificationPermission } from '../utils/notifications';

interface CustomerProfileProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onLogout: () => void;
  onSwitchRole: () => void;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onSwitchRole,
}) => {
  const { themeMode, setThemeMode } = useTheme();

  // Editing modes
  const [editingField, setEditingField] = useState<'name' | 'phone' | 'address' | null>(null);
  
  // Temporary input states
  const [nameInput, setNameInput] = useState(user.name);
  const [phoneInput, setPhoneInput] = useState(user.phone);
  const [addressInput, setAddressInput] = useState(user.address);

  // Photo uploading
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Notification toggles
  const [pushAlerts, setPushAlerts] = useState(user.notificationsEnabled ?? true);
  const [emailReceipts, setEmailReceipts] = useState(true);

  useEffect(() => {
    setPushAlerts(checkNotificationPermission() && user.notificationsEnabled !== false);
  }, []);

  // Modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [newLocation, setNewLocation] = useState({ label: 'Office', address: '' });

  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState({ cardNumber: '', expiry: '', cvc: '', name: '' });
  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', type: 'Apple Pay', last4: '8821', isDefault: true },
    { id: '2', type: 'Visa', last4: '4242', isDefault: false },
  ]);

  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: '1', name: 'Sarah Jenkins', relationship: 'Spouse', phone: '+1 (555) 234-5678' },
  ]);
  const [newContact, setNewContact] = useState({ name: '', relationship: 'Family', phone: '' });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(10);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            const objectUrl = URL.createObjectURL(file);
            onUpdateUser({ avatarUrl: objectUrl });
            return 100;
          }
          return prev + 25;
        });
      }, 150);
    }
  };

  const handleSaveField = (field: 'name' | 'phone' | 'address') => {
    if (field === 'name') onUpdateUser({ name: nameInput });
    if (field === 'phone') onUpdateUser({ phone: phoneInput });
    if (field === 'address') onUpdateUser({ address: addressInput });
    setEditingField(null);
  };

  const handleAddLocation = () => {
    if (!newLocation.address.trim()) return;
    const added: SavedLocation = {
      id: String(Date.now()),
      label: newLocation.label,
      address: newLocation.address,
      isDefault: false,
    };
    onUpdateUser({ savedLocations: [...(user.savedLocations || []), added] });
    setNewLocation({ label: 'Office', address: '' });
    setShowAddLocationModal(false);
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) return;
    setEmergencyContacts((prev) => [
      ...prev,
      { id: String(Date.now()), name: newContact.name, relationship: newContact.relationship, phone: newContact.phone },
    ]);
    setNewContact({ name: '', relationship: 'Family', phone: '' });
    setShowAddContactModal(false);
  };

  const handleAddPayment = () => {
    if (!newPayment.cardNumber) return;
    const last4 = newPayment.cardNumber.slice(-4) || '1234';
    setPaymentMethods((prev) => [
      ...prev,
      { id: String(Date.now()), type: 'Mastercard', last4, isDefault: false },
    ]);
    setNewPayment({ cardNumber: '', expiry: '', cvc: '', name: '' });
    setShowAddPaymentModal(false);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.next && passwordForm.next === passwordForm.confirm) {
      setPasswordSuccess(true);
      setTimeout(() => {
        setPasswordSuccess(false);
        setShowPasswordModal(false);
        setPasswordForm({ current: '', next: '', confirm: '' });
      }, 1200);
    }
  };

  return (
    <div className="pb-28 pt-[calc(env(safe-area-inset-top)+1rem)] px-4 max-w-md mx-auto space-y-5 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#27C2D4] dark:text-[#2EC5F4]">
            My Account
          </span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
            Profile & Preferences
          </h1>
        </div>
        <button
          onClick={onSwitchRole}
          className="px-3 py-1.5 bg-[#3F73C7]/10 dark:bg-[#5B6DFF]/20 text-[#3F73C7] dark:text-[#2EC5F4] text-xs font-semibold rounded-full hover:bg-[#3F73C7]/20 transition-colors shrink-0"
        >
          Switch to Partner
        </button>
      </div>

      {/* Profile Avatar Header Card */}
      <div className="bg-gradient-to-tr from-slate-900 via-[#3F73C7] to-[#27C2D4] dark:from-[#111827] dark:via-[#1A2333] dark:to-[#2EC5F4]/40 p-5 rounded-[28px] text-white float-shadow text-center relative overflow-hidden">
        <div className="relative w-24 h-24 mx-auto mb-2.5">
          <img
            src={user.avatarUrl}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded-full object-cover border-4 border-white/90 dark:border-[#2EC5F4]/60 float-shadow"
          />
        </div>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="w-40 mx-auto bg-white/20 h-1.5 rounded-full overflow-hidden mb-2">
            <motion.div
              className="bg-cyan-300 h-full"
              initial={{ width: '0%' }}
              animate={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {/* Name with edit toggle */}
        {editingField === 'name' ? (
          <div className="flex items-center justify-center space-x-2 max-w-xs mx-auto my-1">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="px-3 py-1 bg-white text-slate-900 text-xs font-semibold rounded-lg focus:outline-none"
            />
            <button onClick={() => handleSaveField('name')} className="p-1 bg-emerald-500 text-white rounded-lg">
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-1.5">
            <h2 className="text-lg font-semibold text-white">{user.name}</h2>
            <button onClick={() => { setNameInput(user.name); setEditingField('name'); }} className="text-white/80 hover:text-white p-1">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <p className="text-xs text-cyan-100 dark:text-[#C7D2E0] font-sans">{user.email}</p>
        <span className="inline-flex items-center space-x-1 text-[10px] bg-white/15 dark:bg-white/10 text-white px-2.5 py-0.5 rounded-full mt-2 font-medium">
          <ShieldCheck className="w-3 h-3 text-cyan-300 dark:text-[#2EC5F4]" />
          <span>Verified Account</span>
        </span>
      </div>

      {/* Account Details Form */}
      <div className="bg-white dark:bg-[#1A2333] p-4 rounded-[24px] card-shadow space-y-3 transition-colors">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#94A3B8]">
          Personal Details
        </h3>

        <div className="space-y-2 text-xs">
          {/* Email (Read-only) */}
          <div className="p-3 bg-[#F6F8FB] dark:bg-[#111827] rounded-[18px] flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0 pr-2">
              <Mail className="w-4 h-4 text-[#27C2D4] dark:text-[#2EC5F4] shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 dark:text-[#94A3B8] block">Email Address</span>
                <span className="font-semibold text-slate-800 dark:text-white truncate block">{user.email}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 px-2 py-0.5 bg-slate-200/60 dark:bg-white/10 rounded-full text-[10px] font-medium text-slate-500 dark:text-[#C7D2E0] shrink-0">
              <Lock className="w-3 h-3 text-slate-400 dark:text-[#94A3B8]" />
              <span>Verified</span>
            </div>
          </div>

          {/* Phone */}
          <div className="p-3 bg-[#F6F8FB] dark:bg-[#111827] rounded-[18px] flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0 pr-2">
              <Phone className="w-4 h-4 text-[#3F73C7] dark:text-[#5B6DFF] shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 dark:text-[#94A3B8] block">Mobile Phone</span>
                {editingField === 'phone' ? (
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full bg-white dark:bg-[#1A2333] px-2 py-0.5 border dark:border-white/10 rounded text-xs text-slate-800 dark:text-white"
                  />
                ) : (
                  <span className="font-semibold text-slate-800 dark:text-white truncate block">{user.phone}</span>
                )}
              </div>
            </div>
            {editingField === 'phone' ? (
              <button onClick={() => handleSaveField('phone')} className="p-1 bg-emerald-500 text-white rounded-lg shrink-0">
                <Check className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button onClick={() => { setPhoneInput(user.phone); setEditingField('phone'); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Primary Address */}
          <div className="p-3 bg-[#F6F8FB] dark:bg-[#111827] rounded-[18px] flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0 pr-2">
              <MapPin className="w-4 h-4 text-[#4340A8] dark:text-[#2EC5F4] shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 dark:text-[#94A3B8] block">Primary Address</span>
                {editingField === 'address' ? (
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    className="w-full bg-white dark:bg-[#1A2333] px-2 py-0.5 border dark:border-white/10 rounded text-xs text-slate-800 dark:text-white"
                  />
                ) : (
                  <span className="font-semibold text-slate-800 dark:text-white truncate block">{user.address}</span>
                )}
              </div>
            </div>
            {editingField === 'address' ? (
              <button onClick={() => handleSaveField('address')} className="p-1 bg-emerald-500 text-white rounded-lg shrink-0">
                <Check className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button onClick={() => { setAddressInput(user.address); setEditingField('address'); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Saved Addresses */}
      <div className="bg-white dark:bg-[#1A2333] p-4 rounded-[24px] card-shadow space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#94A3B8]">
            Saved Locations
          </h3>
          <button
            onClick={() => setShowAddLocationModal(true)}
            className="text-xs text-[#27C2D4] dark:text-[#2EC5F4] font-semibold flex items-center space-x-1 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Location</span>
          </button>
        </div>

        <div className="space-y-2">
          {user.savedLocations?.map((loc) => (
            <div key={loc.id} className="p-2.5 bg-[#F6F8FB] dark:bg-[#111827] rounded-[16px] flex items-center justify-between text-xs">
              <div className="min-w-0 pr-2">
                <div className="flex items-center space-x-1.5">
                  <span className="font-semibold text-slate-800 dark:text-white">{loc.label}</span>
                  {loc.isDefault && (
                    <span className="text-[9px] bg-[#27C2D4]/10 dark:bg-[#2EC5F4]/20 text-[#27C2D4] dark:text-[#2EC5F4] px-1.5 py-0.2 rounded font-semibold">
                      Default
                    </span>
                  )}
                </div>
                <span className="text-slate-500 dark:text-[#94A3B8] text-[11px] truncate block">{loc.address}</span>
              </div>
              <button
                onClick={() => {
                  const filtered = user.savedLocations?.filter((l) => l.id !== loc.id);
                  onUpdateUser({ savedLocations: filtered });
                }}
                className="text-slate-400 hover:text-rose-500 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white dark:bg-[#1A2333] p-4 rounded-[24px] card-shadow space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#94A3B8]">
            Payment Methods
          </h3>
          <button
            onClick={() => setShowAddPaymentModal(true)}
            className="text-xs text-[#27C2D4] dark:text-[#2EC5F4] font-semibold flex items-center space-x-1 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>
        </div>

        <div className="space-y-2">
          {paymentMethods.map((pm) => (
            <div key={pm.id} className="p-2.5 bg-[#F6F8FB] dark:bg-[#111827] rounded-[16px] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                <CreditCard className="w-4 h-4 text-[#3F73C7] dark:text-[#5B6DFF]" />
                <div>
                  <span className="font-semibold text-slate-800 dark:text-white block">{pm.type} •••• {pm.last4}</span>
                  <span className="text-[10px] text-slate-400 dark:text-[#94A3B8]">Primary checkout card</span>
                </div>
              </div>
              {pm.isDefault && (
                <span className="text-[9px] bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-semibold">
                  Active
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white dark:bg-[#1A2333] p-4 rounded-[24px] card-shadow space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#94A3B8]">
            Emergency Contacts
          </h3>
          <button
            onClick={() => setShowAddContactModal(true)}
            className="text-xs text-[#27C2D4] dark:text-[#2EC5F4] font-semibold flex items-center space-x-1 hover:underline"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>

        <div className="space-y-2">
          {emergencyContacts.map((c) => (
            <div key={c.id} className="p-2.5 bg-[#F6F8FB] dark:bg-[#111827] rounded-[16px] flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-800 dark:text-white block">{c.name} ({c.relationship})</span>
                <span className="text-slate-500 dark:text-[#94A3B8] text-[11px]">{c.phone}</span>
              </div>
              <button
                onClick={() => setEmergencyContacts((prev) => prev.filter((p) => p.id !== c.id))}
                className="text-slate-400 hover:text-rose-500 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-[#1A2333] p-4 rounded-[24px] card-shadow space-y-3 transition-colors">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#94A3B8]">
          Appearance
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setThemeMode('light');
              onUpdateUser({ themeMode: 'light' });
            }}
            className={`p-3 rounded-[18px] flex flex-col items-center justify-center space-y-1.5 border transition-all cursor-pointer ${
              themeMode === 'light'
                ? 'bg-cyan-50 border-[#27C2D4] text-[#27C2D4] dark:bg-[#2EC5F4]/15 dark:border-[#2EC5F4] dark:text-[#2EC5F4] font-semibold shadow-sm'
                : 'bg-[#F6F8FB] dark:bg-[#111827] border-transparent text-slate-600 dark:text-[#C7D2E0] hover:bg-slate-100 dark:hover:bg-[#111827]/80'
            }`}
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs">Light Mode</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setThemeMode('dark');
              onUpdateUser({ themeMode: 'dark' });
            }}
            className={`p-3 rounded-[18px] flex flex-col items-center justify-center space-y-1.5 border transition-all cursor-pointer ${
              themeMode === 'dark'
                ? 'bg-cyan-50 border-[#27C2D4] text-[#27C2D4] dark:bg-[#2EC5F4]/15 dark:border-[#2EC5F4] dark:text-[#2EC5F4] font-semibold shadow-sm'
                : 'bg-[#F6F8FB] dark:bg-[#111827] border-transparent text-slate-600 dark:text-[#C7D2E0] hover:bg-slate-100 dark:hover:bg-[#111827]/80'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span className="text-xs">Dark Mode</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setThemeMode('system');
              onUpdateUser({ themeMode: 'system' });
            }}
            className={`p-3 rounded-[18px] flex flex-col items-center justify-center space-y-1.5 border transition-all cursor-pointer ${
              themeMode === 'system'
                ? 'bg-cyan-50 border-[#27C2D4] text-[#27C2D4] dark:bg-[#2EC5F4]/15 dark:border-[#2EC5F4] dark:text-[#2EC5F4] font-semibold shadow-sm'
                : 'bg-[#F6F8FB] dark:bg-[#111827] border-transparent text-slate-600 dark:text-[#C7D2E0] hover:bg-slate-100 dark:hover:bg-[#111827]/80'
            }`}
          >
            <Monitor className="w-5 h-5" />
            <span className="text-xs text-center leading-tight">System Default</span>
          </button>
        </div>
      </div>

      {/* Security & Notifications */}
      <div className="bg-white dark:bg-[#1A2333] p-4 rounded-[24px] card-shadow space-y-3 transition-colors">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#94A3B8]">
          Security & Notifications
        </h3>

        {/* Change Password Button */}
        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full p-2.5 bg-[#F6F8FB] dark:bg-[#111827] rounded-[16px] flex items-center justify-between text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center space-x-2.5">
            <Key className="w-4 h-4 text-[#3F73C7] dark:text-[#5B6DFF]" />
            <span className="font-semibold text-slate-800 dark:text-white">Change Account Password</span>
          </div>
          <span className="text-[10px] text-[#27C2D4] dark:text-[#2EC5F4] font-semibold">Update</span>
        </button>

        {/* Notification Toggles */}
        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 dark:text-[#C7D2E0] font-medium">Push Dispatch Alerts</span>
            <button
              onClick={async () => {
                if (!pushAlerts) {
                  const granted = await requestNotificationPermission();
                  if (granted) {
                    setPushAlerts(true);
                    onUpdateUser({ notificationsEnabled: true });
                  } else {
                    alert('Please enable notifications in your browser settings.');
                  }
                } else {
                  setPushAlerts(false);
                  onUpdateUser({ notificationsEnabled: false });
                }
              }}
              className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${pushAlerts ? 'bg-[#27C2D4] dark:bg-[#2EC5F4]' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${pushAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 dark:text-[#C7D2E0] font-medium">Email Invoices & Receipts</span>
            <button
              onClick={() => setEmailReceipts(!emailReceipts)}
              className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${emailReceipts ? 'bg-[#27C2D4] dark:bg-[#2EC5F4]' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${emailReceipts ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-white/10 pt-3">
          <button
            onClick={onLogout}
            className="w-full py-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold text-xs rounded-[18px] flex items-center justify-center space-x-2 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Account</span>
          </button>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#1A2333] text-slate-800 dark:text-white w-full max-w-sm rounded-[28px] p-5 space-y-4 shadow-2xl relative border dark:border-white/10"
            >
              <button
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 bg-cyan-50 dark:bg-[#2EC5F4]/20 text-[#27C2D4] dark:text-[#2EC5F4] rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Change Password</h3>
                  <p className="text-[11px] text-slate-500 dark:text-[#94A3B8]">Ensure a minimum of 8 characters</p>
                </div>
              </div>

              {passwordSuccess ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl text-center font-semibold">
                  Password updated successfully!
                </div>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-500 dark:text-[#94A3B8] block mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-[#111827] border dark:border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#27C2D4] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 dark:text-[#94A3B8] block mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.next}
                      onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-[#111827] border dark:border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#27C2D4] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 dark:text-[#94A3B8] block mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-[#111827] border dark:border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#27C2D4] dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#27C2D4] dark:bg-[#2EC5F4] text-white font-semibold rounded-xl hover:bg-[#20b2c3] transition-colors"
                  >
                    Update Password
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Location Modal */}
      <AnimatePresence>
        {showAddLocationModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#1A2333] text-slate-800 dark:text-white w-full max-w-sm rounded-[28px] p-5 space-y-4 shadow-2xl relative border dark:border-white/10"
            >
              <button
                onClick={() => setShowAddLocationModal(false)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Add Saved Location</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-500 dark:text-[#94A3B8] block mb-1">Label (e.g. Work, Parents)</label>
                  <input
                    type="text"
                    value={newLocation.label}
                    onChange={(e) => setNewLocation({ ...newLocation, label: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#111827] border dark:border-white/10 rounded-xl focus:outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 dark:text-[#94A3B8] block mb-1">Street Address</label>
                  <input
                    type="text"
                    placeholder="123 Main St, San Francisco, CA"
                    value={newLocation.address}
                    onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#111827] border dark:border-white/10 rounded-xl focus:outline-none dark:text-white"
                  />
                </div>
                <button
                  onClick={handleAddLocation}
                  className="w-full py-2.5 bg-[#27C2D4] dark:bg-[#2EC5F4] text-white font-semibold rounded-xl hover:bg-[#20b2c3]"
                >
                  Save Address
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Contact Modal */}
      <AnimatePresence>
        {showAddContactModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#1A2333] text-slate-800 dark:text-white w-full max-w-sm rounded-[28px] p-5 space-y-4 shadow-2xl relative border dark:border-white/10"
            >
              <button
                onClick={() => setShowAddContactModal(false)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Add Emergency Contact</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-500 dark:text-[#94A3B8] block mb-1">Contact Name</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#111827] border dark:border-white/10 rounded-xl focus:outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 dark:text-[#94A3B8] block mb-1">Relationship</label>
                  <input
                    type="text"
                    placeholder="Spouse, Parent, Neighbor"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#111827] border dark:border-white/10 rounded-xl focus:outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 dark:text-[#94A3B8] block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#111827] border dark:border-white/10 rounded-xl focus:outline-none dark:text-white"
                  />
                </div>
                <button
                  onClick={handleAddContact}
                  className="w-full py-2.5 bg-[#27C2D4] dark:bg-[#2EC5F4] text-white font-semibold rounded-xl hover:bg-[#20b2c3]"
                >
                  Save Emergency Contact
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Payment Modal */}
      <AnimatePresence>
        {showAddPaymentModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#131E33] text-slate-800 dark:text-white w-full max-w-sm rounded-[28px] p-5 space-y-4 shadow-2xl relative border border-slate-100 dark:border-white/[0.06]"
            >
              <button
                onClick={() => setShowAddPaymentModal(false)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Add Payment Card</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-500 dark:text-[#7F8DA8] block mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="4532 •••• •••• 8892"
                    value={newPayment.cardNumber}
                    onChange={(e) => setNewPayment({ ...newPayment, cardNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#0E1628] border border-slate-200 dark:border-white/[0.06] rounded-xl focus:outline-none dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-500 dark:text-[#7F8DA8] block mb-1">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={newPayment.expiry}
                      onChange={(e) => setNewPayment({ ...newPayment, expiry: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-[#0E1628] border border-slate-200 dark:border-white/[0.06] rounded-xl focus:outline-none dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 dark:text-[#7F8DA8] block mb-1">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={newPayment.cvc}
                      onChange={(e) => setNewPayment({ ...newPayment, cvc: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-[#0E1628] border border-slate-200 dark:border-white/[0.06] rounded-xl focus:outline-none dark:text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddPayment}
                  className="w-full py-2.5 bg-[#27C2D4] dark:bg-[#21C7F6] text-white dark:text-[#070B14] font-semibold rounded-xl hover:bg-[#20b2c3] dark:hover:bg-[#21C7F6]/90 transition-colors"
                >
                  Save Payment Card
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
