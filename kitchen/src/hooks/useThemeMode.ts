import { useEffect } from 'react';

const useThemeMode = (theme: 'light' | 'dark') => {
  useEffect(() => {
    const body = document.body;    
    body.classList.remove('light', 'dark');
    body.classList.add(theme);
  }, [theme]);
};

export default useThemeMode;
