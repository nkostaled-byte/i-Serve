import React from 'react';

interface IllustrationProps {
  categoryKey: 'electrical' | 'plumbing' | 'maintenance' | 'cleaning' | 'mechanic' | 'beauty' | 'technical' | 'nanny' | 'errands';
  className?: string;
}

export const ServiceIllustration: React.FC<IllustrationProps> = ({ categoryKey, className = "w-20 h-20" }) => {
  switch (categoryKey) {
    case 'electrical':
      return (
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="120" rx="24" fill="url(#grad_elec)" />
          <path d="M60 20L32 68H58L52 100L88 48H62L60 20Z" fill="#FFFFFF" />
          <path d="M52 100L88 48H62L60 20L32 68H58L52 100Z" stroke="#27C2D4" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="90" cy="30" r="6" fill="#27C2D4" opacity="0.8" />
          <circle cx="30" cy="90" r="4" fill="#3F73C7" opacity="0.8" />
          <defs>
            <linearGradient id="grad_elec" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#27C2D4" />
              <stop offset="1" stopColor="#3F73C7" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'plumbing':
      return (
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="120" rx="24" fill="url(#grad_plumb)" />
          {/* Water Pipe */}
          <path d="M30 45H65V85H85" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          {/* Faucet head */}
          <rect x="25" y="38" width="12" height="14" rx="3" fill="#FFFFFF" />
          {/* Water Drop */}
          <path d="M85 85C85 93.2843 78.2843 100 70 100C61.7157 100 55 93.2843 55 85C55 77 70 60 70 60C70 60 85 77 85 85Z" fill="#27C2D4" />
          <path d="M72 80C72 83.3137 69.3137 86 66 86" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="grad_plumb" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3F73C7" />
              <stop offset="1" stopColor="#4340A8" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'maintenance':
      return (
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="120" rx="24" fill="url(#grad_maint)" />
          {/* Crossed Wrench & Hammer */}
          <path d="M38 82L78 42M78 42C82 38 88 38 92 42C96 46 96 52 92 56L82 66" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          <path d="M82 82L42 42M42 42C38 38 32 38 28 42C24 46 24 52 28 56L38 66" stroke="#27C2D4" strokeWidth="6" strokeLinecap="round" />
          <rect x="48" y="48" width="24" height="24" rx="6" fill="#FFFFFF" opacity="0.9" />
          <defs>
            <linearGradient id="grad_maint" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E293B" />
              <stop offset="1" stopColor="#3F73C7" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'cleaning':
      return (
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="120" rx="24" fill="url(#grad_clean)" />
          {/* Spray bottle */}
          <rect x="42" y="55" width="28" height="42" rx="8" fill="#FFFFFF" />
          <path d="M56 35V55M48 35H64M64 35L76 42" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          {/* Bubbles */}
          <circle cx="82" cy="32" r="10" fill="#27C2D4" opacity="0.9" />
          <circle cx="94" cy="50" r="6" fill="#FFFFFF" opacity="0.8" />
          <circle cx="32" cy="75" r="7" fill="#FFFFFF" opacity="0.7" />
          <defs>
            <linearGradient id="grad_clean" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#27C2D4" />
              <stop offset="1" stopColor="#4340A8" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'mechanic':
      return (
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="120" rx="24" fill="url(#grad_mech)" />
          {/* Car outline */}
          <path d="M25 70C25 65 30 60 40 58L52 40C55 36 62 34 72 34H80C88 34 93 38 96 42L102 58C108 60 110 65 110 70V80H25V70Z" fill="#FFFFFF" />
          {/* Wheels */}
          <circle cx="42" cy="82" r="10" fill="#1E293B" stroke="#27C2D4" strokeWidth="3" />
          <circle cx="90" cy="82" r="10" fill="#1E293B" stroke="#27C2D4" strokeWidth="3" />
          <defs>
            <linearGradient id="grad_mech" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3F73C7" />
              <stop offset="1" stopColor="#1E293B" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'beauty':
      return (
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="120" rx="24" fill="url(#grad_beauty)" />
          {/* Scissors & Comb */}
          <circle cx="42" cy="85" r="10" stroke="#FFFFFF" strokeWidth="5" />
          <circle cx="68" cy="85" r="10" stroke="#FFFFFF" strokeWidth="5" />
          <path d="M48 76L75 32M62 76L35 32" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
          <rect x="75" y="30" width="22" height="40" rx="4" fill="#27C2D4" />
          <path d="M75 38H97M75 46H97M75 54H97M75 62H97" stroke="#FFFFFF" strokeWidth="2" />
          <defs>
            <linearGradient id="grad_beauty" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4340A8" />
              <stop offset="1" stopColor="#27C2D4" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'technical':
      return (
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="120" rx="24" fill="url(#grad_tech)" />
          {/* Laptop */}
          <rect x="32" y="32" width="56" height="38" rx="6" fill="#FFFFFF" />
          <path d="M22 75H98C101 75 101 80 98 82H22C19 82 19 75 22 75Z" fill="#27C2D4" />
          {/* Code/Terminal screen */}
          <path d="M42 45L48 51L42 57M52 57H64" stroke="#3F73C7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="grad_tech" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E293B" />
              <stop offset="1" stopColor="#4340A8" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'nanny':
      return (
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="120" rx="24" fill="url(#grad_nanny)" />
          {/* Teddy Bear / Heart outline */}
          <path d="M60 92C60 92 28 70 28 48C28 36 38 28 48 28C54 28 60 32 60 32C60 32 66 28 72 28C82 28 92 36 92 48C92 70 60 92 60 92Z" fill="#FFFFFF" />
          <path d="M60 42L63 48L70 49L65 54L66 61L60 58L54 61L55 54L50 49L57 48L60 42Z" fill="#27C2D4" />
          <defs>
            <linearGradient id="grad_nanny" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#27C2D4" />
              <stop offset="1" stopColor="#3F73C7" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'errands':
      return (
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="120" height="120" rx="24" fill="url(#grad_errands)" />
          {/* Shopping Bag & Parcel */}
          <path d="M35 48H85L80 92H40L35 48Z" fill="#FFFFFF" />
          <path d="M48 48V36C48 30 52 26 60 26C68 26 72 30 72 36V48" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
          <rect x="52" y="60" width="28" height="24" rx="4" fill="#27C2D4" />
          <path d="M66 60V84M52 72H80" stroke="#FFFFFF" strokeWidth="2" />
          <defs>
            <linearGradient id="grad_errands" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3F73C7" />
              <stop offset="1" stopColor="#27C2D4" />
            </linearGradient>
          </defs>
        </svg>
      );

    default:
      return null;
  }
};
