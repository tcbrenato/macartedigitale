import { useOutletContext } from 'react-router-dom';
import ProfileForm from './ProfileForm';
import type { DashboardContext } from './DashboardLayout';

function EditCard() {
  const context = useOutletContext<DashboardContext>();
  return <ProfileForm {...context} />;
}

export default EditCard;
