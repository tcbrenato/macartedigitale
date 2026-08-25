/**
 * Derives the display / tel-link / WhatsApp phone fields from raw digits.
 * Assumes a 3-digit country code (fits this app's Bénin/Togo audience: 229, 228).
 */
export function derivePhoneFields(input: string): { phone: string; phoneRaw: string; whatsapp: string } {
  const digits = input.replace(/\D/g, '');
  if (!digits) return { phone: '', phoneRaw: '', whatsapp: '' };

  const countryCode = digits.slice(0, 3);
  const rest = digits.slice(3);
  const groups = rest.match(/.{1,2}/g) ?? [];
  const phone = `+${countryCode}${groups.length ? ' ' + groups.join(' ') : ''}`;

  return { phone, phoneRaw: `+${digits}`, whatsapp: digits };
}
