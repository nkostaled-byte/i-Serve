import React from 'react';
import { ServiceCategory } from '../types';
import { ServiceIllustration } from './ServiceIllustrations';

interface ServiceGridProps {
  categories: ServiceCategory[];
  onSelectCategory: (category: ServiceCategory) => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({ categories, onSelectCategory }) => {
  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-serif text-slate-900 dark:text-white font-normal">
            Explore Services
          </h2>
          <p className="text-xs text-slate-400 dark:text-[#7F8DA8] font-sans">
            Guaranteed upfront rates & vetted local experts
          </p>
        </div>
      </div>

      {/* Exactly 3 columns x 3 rows grid = 9 cards */}
      <div className="grid grid-cols-3 gap-3">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            id={`service-grid-card-${cat.id}`}
            onClick={() => onSelectCategory(cat)}
            className="bg-white dark:bg-[#131E33] rounded-[24px] p-3 card-shadow cursor-pointer flex flex-col items-center text-center transition-all duration-200 border border-transparent dark:border-white/[0.06] hover:border-[#27C2D4]/30 dark:hover:border-[#21C7F6]/40 hover:-translate-y-1"
          >
            {/* Custom Vector Illustration */}
            <div className="w-16 h-16 my-1 flex items-center justify-center">
              <ServiceIllustration categoryKey={cat.illustrationKey} className="w-14 h-14" />
            </div>

            {/* Title & Subtitle */}
            <h3 className="font-semibold text-slate-900 dark:text-white text-xs mt-2 leading-tight line-clamp-1">
              {cat.title}
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-[#7F8DA8] font-sans mt-0.5 leading-snug line-clamp-1">
              {cat.subtitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
