import PWAUpdateNotification from './components/pwa-update-notification';
import AppLoading from './components/AppLoading';
import HomeRoutes from './pages/home/routes';
import AppRoutes from './pages/apps/routes';
import { useAuth } from './context/auth.context';
import { AppLayoutProvider } from './components/layouts/app-layouts/AppLayoutContext';

function App() {
  const {
    state: { user, loading },
  } = useAuth();

  if (loading) {
    return <AppLoading />;
  }

  return (
    <>
      <AppLayoutProvider>
        {!user ? <HomeRoutes /> : <AppRoutes />}
      <PWAUpdateNotification />
      </AppLayoutProvider>
    </>
  );
}

export default App;
