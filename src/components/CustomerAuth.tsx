import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { requestNotificationPermission } from '../utils/notifications';

interface CustomerAuthProps {
  onLoginSuccess: () => void;
  onGoToRegister: () => void;
  onBack: () => void;
}

export const CustomerAuth: React.FC<CustomerAuthProps> = ({ onLoginSuccess, onGoToRegister, onBack }) => {
  const [email, setEmail] = useState('nathi.gumede@iserve.app');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await requestNotificationPermission();
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] dark:bg-[#070B14] flex flex-col justify-between px-6 pb-6 pt-[calc(env(safe-area-inset-top)+1.5rem)] max-w-md mx-auto relative transition-colors">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-white dark:bg-[#131E33] rounded-full flex items-center justify-center text-slate-700 dark:text-[#B8C3D9] card-shadow hover:bg-slate-50 dark:hover:bg-[#17243C] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold text-[#27C2D4] dark:text-[#21C7F6] bg-[#27C2D4]/10 dark:bg-[#21C7F6]/20 px-3 py-1 rounded-full">
          Customer Portal
        </span>
      </div>

      {/* Main Glass Card */}
      <div 
        className="bg-white dark:bg-[#131E33] p-7 rounded-[32px] card-shadow my-auto my-6 border border-transparent dark:border-white/[0.06]"
      >
        <h1 className="text-3xl font-serif text-slate-900 dark:text-white font-normal">
          Welcome back
        </h1>
        <p className="text-slate-500 dark:text-[#B8C3D9] text-sm mt-1 font-sans mb-6">
          Sign in to request trusted professionals in real time.
        </p>

        {/* Continue with Google */}
        <button 
          type="button"
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              onLoginSuccess();
            }, 600);
          }}
          className="w-full py-3.5 px-4 bg-slate-50 dark:bg-[#0E1628] border border-slate-200/60 dark:border-white/[0.06] rounded-[20px] text-slate-700 dark:text-white font-medium text-sm flex items-center justify-center space-x-3 hover:bg-slate-100 dark:hover:bg-[#17243C] transition-colors mb-4 active:scale-[0.99]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-white/[0.06]" /></div>
          <span className="relative px-3 bg-white dark:bg-[#131E33] text-xs text-slate-400 dark:text-[#7F8DA8] font-sans uppercase tracking-wider">or email</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-[#B8C3D9] mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-4 top-3.5 text-slate-400 dark:text-[#7F8DA8]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#0E1628] border border-slate-100 dark:border-white/[0.06] rounded-[20px] text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#27C2D4]/50 transition-all font-sans"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-[#B8C3D9] mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-4 top-3.5 text-slate-400 dark:text-[#7F8DA8]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#0E1628] border border-slate-100 dark:border-white/[0.06] rounded-[20px] text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#27C2D4]/50 transition-all font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-[#27C2D4] to-[#3F73C7] dark:from-[#21C7F6] dark:to-[#4D5DFA] text-white dark:text-[#070B14] font-medium rounded-[20px] float-shadow flex items-center justify-center space-x-2 text-base active:scale-[0.98] transition-transform mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-[#B8C3D9] font-sans">
          Don't have an account?{' '}
          <button 
            type="button"
            onClick={onGoToRegister}
            className="text-[#27C2D4] dark:text-[#21C7F6] font-semibold hover:underline"
          >
            Sign up now
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 dark:text-[#7F8DA8] pb-4 font-sans">
        Protected by 256-bit encryption.
      </div>
    </div>
  );
};
