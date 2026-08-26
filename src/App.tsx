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
import Directory from '@/pages/dashboard/Directory';
import Connections from '@/pages/dashboard/Connections';
import AdminContactMessages from '@/pages/dashboard/AdminContactMessages';
import AdminEvents from '@/pages/dashboard/AdminEvents';
import AdminEventMembers from '@/pages/dashboard/AdminEventMembers';
import ProfilePage from '@/pages/ProfilePage';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
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
        <Route path="directory" element={<Directory />} />
        <Route path="connections" element={<Connections />} />
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
        <Route
          path="admin/contact"
          element={
            <RequireAdmin>
              <AdminContactMessages />
            </RequireAdmin>
          }
        />
        <Route
          path="admin/events"
          element={
            <RequireAdmin>
              <AdminEvents />
            </RequireAdmin>
          }
        />
        <Route
          path="admin/events/:id"
          element={
            <RequireAdmin>
              <AdminEventMembers />
            </RequireAdmin>
          }
        />
      </Route>
      <Route path="/contact" element={<Contact />} />
      <Route path="/confidentialite" element={<Privacy />} />
      <Route path="/cgu" element={<Terms />} />
      <Route path="/:slug" element={<ProfilePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
