import QRCode from 'qrcode';
import { supabase } from '@/lib/supabase';

export async function generateAndUploadQrCode(userId: string, slug: string): Promise<string> {
  const targetUrl = `${window.location.origin}/${slug}`;
  const dataUrl = await QRCode.toDataURL(targetUrl, {
    width: 512,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  });
  const blob = await (await fetch(dataUrl)).blob();

  const path = `${userId}/qr-${Date.now()}.png`;
  const { error } = await supabase.storage.from('qrcodes').upload(path, blob, {
    upsert: true,
    contentType: 'image/png',
  });
  if (error) throw error;

  const { data } = supabase.storage.from('qrcodes').getPublicUrl(path);
  return data.publicUrl;
}

export async function downloadImage(url: string, filename: string): Promise<void> {
  const res = await fetch(url);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}
