import { useEffect, useState } from 'react';
import { getUserPreferences, saveUserPreferences } from '@/utils/userPreferences';

export default function useTheme() {
  const [theme, setTheme] = useState(() => getUserPreferences().theme);
  const [animationsEnabled, setAnimationsEnabled] = useState(() => 
    getUserPreferences().animationsEnabled);

  // Apply theme to document on component mount and theme change
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, [theme]);

  // Listen for system theme changes if using system theme
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(mediaQuery.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveUserPreferences({ theme: newTheme });
  };
  
  const toggleAnimations = () => {
    const newValue = !animationsEnabled;
    setAnimationsEnabled(newValue);
    saveUserPreferences({ animationsEnabled: newValue });
  };
  
 
  };
}