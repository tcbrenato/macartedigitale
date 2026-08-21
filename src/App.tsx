import { Routes, Route, Navigate } from 'react-router-dom';
import ProfilePage from '@/pages/ProfilePage';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/renato" replace />} />
      <Route path="/:slug" element={<ProfilePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
