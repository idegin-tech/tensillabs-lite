import { Workbox } from 'workbox-window';

let wb: Workbox;

if ('serviceWorker' in navigator) {
  wb = new Workbox('/sw.js');

  wb.addEventListener('installed', (event) => {
    if (event.isUpdate) {
      const updateEvent = new CustomEvent('sw-update-available');

      window.dispatchEvent(updateEvent);
    }
  });

  wb.addEventListener('waiting', () => {
    const updateEvent = new CustomEvent('sw-update-available');

    window.dispatchEvent(updateEvent);
  });

  wb.addEventListener('controlling', () => {
    window.location.reload();
  });

  wb.register().catch((err) => {
    console.error('Service Worker registration failed:', err);
  });
}

export { wb };
