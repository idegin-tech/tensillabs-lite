import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import PWAInstallHandler from '../utils/pwa-install';

export const PWAInstallButton: React.FC = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    PWAInstallHandler.init();

    const handleInstallAvailable = () => setCanInstall(true);
    const handleInstallCompleted = () => setCanInstall(false);

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-install-completed', handleInstallCompleted);

    setCanInstall(PWAInstallHandler.canInstall());

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-install-completed', handleInstallCompleted);
    };
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await PWAInstallHandler.promptInstall();
    } finally {
      setIsInstalling(false);
    }
  };

  if (!canInstall || PWAInstallHandler.isStandalone()) {
    return null;
  }

  return (
    <Button
      color="primary"
      variant="ghost"
      size="sm"
      onPress={handleInstall}
      isLoading={isInstalling}
      className="text-sm"
    >
      Install App
    </Button>
  );
};

export default PWAInstallButton;
