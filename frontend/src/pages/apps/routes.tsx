import { Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<HomePage/>} path="/" />
    </Routes>
  );
}

export default AppRoutes;
