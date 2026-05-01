import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const ACCENT_COLORS = [
  { label: 'Violet', value: '#7c3aed' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Cyan', value: '#0891b2' },
  { label: 'Green', value: '#059669' },
  { label: 'Pink', value: '#db2777' },
  { label: 'Orange', value: '#ea580c' },
];

export const ThemeProvider = ({ children }) => {
  const [accentColor, setAccentColor] = useState(
    () => localStorage.getItem('accent_color') || '#7c3aed'
  );
  const [timeFormat, setTimeFormat] = useState(
    () => localStorage.getItem('time_format') || '12h'
  );

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accentColor);
    localStorage.setItem('accent_color', accentColor);
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem('time_format', timeFormat);
  }, [timeFormat]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: timeFormat === '12h',
    });
  };

  return (
    <ThemeContext.Provider value={{ accentColor, setAccentColor, timeFormat, setTimeFormat, formatTime, ACCENT_COLORS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
