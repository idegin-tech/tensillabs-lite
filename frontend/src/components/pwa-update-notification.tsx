import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/button';

export const PWAUpdateNotification: React.FC = () => {
  const [showUpdateAvailable, setShowUpdateAvailable] = useState(false);

  useEffect(() => {
    const handleSWUpdate = () => {
      setShowUpdateAvailable(true);
    };

    window.addEventListener('sw-update-available', handleSWUpdate);

    return () => {
      window.removeEventListener('sw-update-available', handleSWUpdate);
    };
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdateAvailable(false);
  };

  if (!showUpdateAvailable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="font-semibold text-sm">Update Available</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            A new version of the app is available. Refresh to update.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex-1"
            color="primary"
            size="sm"
            onPress={handleUpdate}
          >
            Update
          </Button>
          <Button
            className="flex-1"
            size="sm"
            variant="ghost"
            onPress={handleDismiss}
          >
            Later
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdateNotification;
