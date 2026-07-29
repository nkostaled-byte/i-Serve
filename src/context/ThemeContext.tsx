import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'system',
  setThemeMode: () => {},
  isDark: false,
});

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  userThemeMode?: ThemeMode;
  onThemeChange?: (mode: ThemeMode) => void;
}> = ({ children, userThemeMode, onThemeChange }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (userThemeMode) return userThemeMode;
    const saved = localStorage.getItem('iserve_theme') as ThemeMode | null;
    return saved || 'system';
  });

  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    if (userThemeMode && userThemeMode !== themeMode) {
      setThemeModeState(userThemeMode);
    }
  }, [userThemeMode]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('iserve_theme', mode);
    if (onThemeChange) {
      onThemeChange(mode);
    }
  };

  useEffect(() => {
    const updateTheme = () => {
      let activeDark = false;
      if (themeMode === 'dark') {
        activeDark = true;
      } else if (themeMode === 'light') {
        activeDark = false;
      } else {
        activeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setIsDark(activeDark);

      if (activeDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    };

    updateTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (themeMode === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, isDark }}>
      <div className={`transition-colors duration-300 min-h-screen ${isDark ? 'bg-[#070B14] text-white dark' : 'bg-[#F6F8FB] text-slate-800'}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
