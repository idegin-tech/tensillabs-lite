import PWAUpdateNotification from './components/pwa-update-notification';
import AppLoading from './components/AppLoading';
import HomeRoutes from './pages/home/routes';
import AppRoutes from './pages/apps/routes';
import { useAuth } from './context/auth.context';

function App() {
  const {
    state: { user, loading },
  } = useAuth();

  if (loading) {
    return <AppLoading />;
  }

  return (
    <>
      {!user ? <HomeRoutes /> : <AppRoutes />}
      <PWAUpdateNotification />
    </>
  );
}

export default App;
