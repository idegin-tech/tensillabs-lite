import { Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import TasksAppPage from './tasks/TasksAppPage';
import AdminAppPage from './admin/AdminAppPage';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<HomePage/>} path="/" />
      <Route path="/workspaces/:member_id/apps">
        <Route element={<TasksAppPage/>} path="tasks" />
        <Route element={<AdminAppPage/>} path="admin" />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
