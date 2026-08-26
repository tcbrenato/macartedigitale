import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Download, RefreshCw, Copy, Check } from 'lucide-react';
import { downloadImage, generateAndUploadQrCode } from '@/lib/qrcode';
import { saveProfile } from '@/lib/profiles';
import { useAuth } from '@/lib/auth';
import type { DashboardContext } from './DashboardLayout';

function QrCode() {
  const { draft, setDraft, message, error } = useOutletContext<DashboardContext>();
  const { user } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const cardUrl = draft.slug ? `${window.location.origin}/${draft.slug}` : '';

  const handleGenerate = async () => {
    if (!user || !draft.slug) return;
    setGenerating(true);
    setLocalError(null);
    try {
      const qrCodeUrl = await generateAndUploadQrCode(user.id, draft.slug);
      const saved = await saveProfile({ ...draft, qrCodeUrl });
      setDraft(saved);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Échec de la génération du QR code.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!draft.qrCodeUrl) return;
    downloadImage(draft.qrCodeUrl, `qrcode-${draft.slug}.png`);
  };

  const handleCopyLink = async () => {
    if (!cardUrl) return;
    await navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-extrabold text-gray-900">QR Code</h2>
        <p className="text-sm text-gray-500 mt-1">
          Ton QR code pointe vers ta carte publiée et se met à jour automatiquement à chaque publication.
        </p>
      </div>

      {draft.status !== 'published' ? (
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6 text-center">
          <p className="text-sm text-gray-500">
            Publie d'abord ta carte (dans "Modifier ma carte") pour pouvoir générer ton QR code.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6 flex flex-col items-center gap-4">
          {draft.qrCodeUrl ? (
            <img src={draft.qrCodeUrl} alt="QR code" className="w-56 h-56 rounded-xl border border-gray-100" />
          ) : (
            <div className="w-56 h-56 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 text-center px-4">
              Pas encore généré
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2 w-full">
            <span className="truncate flex-1">{cardUrl}</span>
            <button onClick={handleCopyLink} className="shrink-0 text-gray-500 hover:text-gray-900">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex-1 min-h-[48px] flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-900 font-bold rounded-xl text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
              {draft.qrCodeUrl ? 'Régénérer' : 'Générer'}
            </button>
            <button
              onClick={handleDownload}
              disabled={!draft.qrCodeUrl}
              className="flex-1 min-h-[48px] flex items-center justify-center gap-2 disabled:opacity-40 text-white font-bold rounded-xl text-sm"
              style={{ backgroundColor: draft.themePrimary }}
            >
              <Download className="w-4 h-4" /> Télécharger
            </button>
          </div>
        </div>
      )}

      {(localError || error) && <p className="text-xs text-red-600">{localError ?? error}</p>}
      {message && <p className="text-xs text-emerald-600">{message}</p>}
    </div>
  );
}

export default QrCode;
