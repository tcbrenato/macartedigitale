import { Routes, Route } from 'react-router-dom';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import DashboardLayout from '@/pages/dashboard/DashboardLayout';
import Overview from '@/pages/dashboard/Overview';
import EditCard from '@/pages/dashboard/EditCard';
import QrCode from '@/pages/dashboard/QrCode';
import RfidOrder from '@/pages/dashboard/RfidOrder';
import AdminRfidOrders from '@/pages/dashboard/AdminRfidOrders';
import AdminProfiles from '@/pages/dashboard/AdminProfiles';
import AdminEditProfile from '@/pages/dashboard/AdminEditProfile';
import ProfilePage from '@/pages/ProfilePage';
import NotFound from '@/pages/NotFound';
import RequireAuth from '@/components/RequireAuth';
import RequireAdmin from '@/components/RequireAdmin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Overview />} />
        <Route path="edit" element={<EditCard />} />
        <Route path="qrcode" element={<QrCode />} />
        <Route path="rfid" element={<RfidOrder />} />
        <Route
          path="admin/rfid"
          element={
            <RequireAdmin>
              <AdminRfidOrders />
            </RequireAdmin>
          }
        />
        <Route
          path="admin/profiles"
          element={
            <RequireAdmin>
              <AdminProfiles />
            </RequireAdmin>
          }
        />
        <Route
          path="admin/profiles/:id"
          element={
            <RequireAdmin>
              <AdminEditProfile />
            </RequireAdmin>
          }
        />
      </Route>
      <Route path="/:slug" element={<ProfilePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
