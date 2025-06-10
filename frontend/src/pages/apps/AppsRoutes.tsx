import { Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import AdminAppRoutes from './admin/AdminAppRoutes';
import TaskAppRoutes from './tasks/pages/TaskAppRoutes';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route path="/workspaces/:member_id/apps">
        <Route path="tasks/*" element={<TaskAppRoutes />} />
        <Route path="admin/*" element={<AdminAppRoutes />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
