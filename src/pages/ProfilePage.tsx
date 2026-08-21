import { useParams } from 'react-router-dom';
import BusinessCard from '@/components/BusinessCard';
import { getProfileBySlug } from '@/data/profiles';
import NotFound from './NotFound';

function ProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const profile = slug ? getProfileBySlug(slug) : undefined;

  if (!profile) {
    return <NotFound />;
  }

  return <BusinessCard profile={profile} />;
}

export default ProfilePage;
