import { useOutletContext } from 'react-router-dom';
import SettingsForm from './SettingsForm';
import type { DashboardContext } from './DashboardLayout';

function Settings() {
  const context = useOutletContext<DashboardContext>();
  return <SettingsForm {...context} />;
}

export default Settings;
