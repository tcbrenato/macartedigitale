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
    <div className="w-full max-w-xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-black text-gray-900 tracking-tight">QR Code</h2>
        <p className="text-sm text-gray-500 mt-1">
          Ton QR code pointe vers ta carte publiée et se met à jour automatiquement à chaque publication.
        </p>
      </div>

      {draft.status !== 'published' ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-500">
            Publie d'abord ta carte (dans <span className="font-semibold text-gray-700">"Modifier ma carte"</span>) pour pouvoir générer ton QR code.
          </p>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center gap-6">
          {draft.qrCodeUrl ? (
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
              <img src={draft.qrCodeUrl} alt="QR code" className="w-56 h-56 rounded-xl" />
            </div>
          ) : (
            <div className="w-56 h-56 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400 font-medium text-center px-4 bg-gray-50/50">
              Pas encore généré
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-gray-600 bg-gray-50/80 border border-gray-100 rounded-2xl px-4 py-3 w-full">
            <span className="truncate flex-1 font-medium">{cardUrl}</span>
            <button
              onClick={handleCopyLink}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:bg-white hover:text-gray-900 shadow-xs transition-all"
              title="Copier le lien"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex-1 min-h-[48px] flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-900 font-bold rounded-2xl text-sm transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
              {draft.qrCodeUrl ? 'Régénérer' : 'Générer'}
            </button>
            <button
              onClick={handleDownload}
              disabled={!draft.qrCodeUrl}
              className="flex-1 min-h-[48px] flex items-center justify-center gap-2 disabled:opacity-40 text-white font-bold rounded-2xl text-sm shadow-md transition-all hover:opacity-95"
              style={{ backgroundColor: draft.themePrimary }}
            >
              <Download className="w-4 h-4" /> Télécharger
            </button>
          </div>
        </div>
      )}

      {(localError || error) && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 font-medium">
          {localError ?? error}
        </div>
      )}
      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-600 font-medium">
          {message}
        </div>
      )}
    </div>
  );
}

export default QrCode;