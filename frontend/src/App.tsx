import { Route, Routes } from "react-router-dom";
import PWAUpdateNotification from "./components/pwa-update-notification";
import HomePage from "./pages/home/HomePage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<HomePage />} path="/" />
      </Routes>
      <PWAUpdateNotification />
    </>
  );
}

export default App;
