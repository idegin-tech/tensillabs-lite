import { Route, Routes } from 'react-router-dom';

import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

function HomeRoutes() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/" />
      <Route element={<SignupPage />} path="/register" />
    </Routes>
  );
}

export default HomeRoutes;
