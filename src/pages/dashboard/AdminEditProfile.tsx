import { useEffect, useState, type ChangeEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getProfileById, saveProfile, uploadPhoto } from '@/lib/profiles';
import { generateAndUploadQrCode } from '@/lib/qrcode';
import ProfileForm from './ProfileForm';
import type { DraftProfile } from './DashboardLayout';

function AdminEditProfile() {
  const { id } = useParams<{ id: string }>();
  const [draft, setDraft] = useState<DraftProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getProfileById(id)
      .then(setDraft)
      .catch((err) => setError(err instanceof Error ? err.message : 'Une erreur est survenue.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !draft) return;
    const previewUrl = URL.createObjectURL(file);
    setDraft((prev) => (prev ? { ...prev, photo: previewUrl } : prev));
    setUploading(true);
    setError(null);
    try {
      const publicUrl = await uploadPhoto(draft.userId ?? draft.id ?? 'unassigned', file);
      setDraft((prev) => (prev ? { ...prev, photo: publicUrl } : prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'upload de la photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!draft) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      let saved = await saveProfile({ ...draft, status });
      if (status === 'published' && saved.userId) {
        try {
          const qrCodeUrl = await generateAndUploadQrCode(saved.userId, saved.slug);
          saved = await saveProfile({ ...saved, qrCodeUrl });
        } catch {
          // Publishing still succeeds even if QR generation fails.
        }
      }
      setDraft(saved);
      setMessage(status === 'published' ? 'Carte publiée !' : 'Brouillon enregistré.');
    } catch (err) {
      if (err instanceof Error && err.message.includes('duplicate key')) {
        setError('Ce lien (slug) est déjà pris par une autre carte.');
      } else {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="px-4 sm:px-8 py-8 text-sm text-gray-400 font-medium">Chargement…</div>;
  }

  if (!draft) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-medium">
          {error ?? 'Carte introuvable.'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 flex flex-col gap-2">
        <Link
          to="/dashboard/admin/profiles"
          className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-950 w-fit transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Retour à la liste
        </Link>
        <p className="text-xs text-gray-500 font-medium mt-1">
          Tu modifies la carte de{' '}
          <span className="font-bold text-gray-950">
            {draft.firstName} {draft.lastName}
          </span>
          {!draft.userId && ' — non réclamée pour l\'instant.'}
        </p>
      </div>
      <ProfileForm
        draft={draft}
        setDraft={setDraft}
        saving={saving}
        uploading={uploading}
        message={message}
        error={error}
        handleSave={handleSave}
        handlePhotoChange={handlePhotoChange}
      />
    </div>
  );
}

export default AdminEditProfile;