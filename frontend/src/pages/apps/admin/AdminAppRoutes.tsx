
import { Route, Routes } from 'react-router-dom';
import AppLayout from '@/components/layouts/app-layouts/AppLayout';
import OverviewPage from './pages/overview/OverviewPage';
import UsersManagementPage from './pages/users/UsersManagementPage';
import AdminAppNav from './components/AdminAppNav';
import BillingOverviewPage from './pages/billing/BillingOverviewPage';

export default function AdminAppRoutes() {
    return (
        <AppLayout sideNavContent={<AdminAppNav/>}>
            <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/billing" element={<BillingOverviewPage />} />
                <Route path="/users" element={<UsersManagementPage />} />
            </Routes>
        </AppLayout>
    )
}
