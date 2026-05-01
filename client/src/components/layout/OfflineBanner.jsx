import { useState, useEffect } from 'react';

const OfflineBanner = () => {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const onOffline = () => setOffline(true);
    const onOnline = () => setOffline(false);
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    return () => {
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-yellow-500/90 backdrop-blur-sm text-black text-sm font-semibold text-center py-2 flex items-center justify-center gap-2">
      <span>📡</span>
      <span>You're offline — viewing cached data</span>
    </div>
  );
};

export default OfflineBanner;
