import { useState, useEffect } from 'react';

interface InternetConnectionState {
  isOnline: boolean;
  isChecking: boolean;
}

export const useInternetConnection = (): InternetConnectionState => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true);
      
      try {
        // Try to fetch a small resource to verify actual connectivity
        // const response = await fetch('https://httpbin.org/status/200', {
        //   method: 'HEAD',
        //   mode: 'no-cors',
        //   cache: 'no-cache'
        // });
        
        // If we get here, we have internet
        setIsOnline(true);
      } catch (error) {
        // If fetch fails, we're offline
        setIsOnline(false);
      } finally {
        setIsChecking(false);
      }
    };

    // Check connection on mount
    checkConnection();

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      // Re-check connection when browser says we're online
      checkConnection();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isChecking };
};
