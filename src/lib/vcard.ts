export interface VCardData {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phone: string;
  email: string;
  url: string;
  address: string;
}

export function generateVCard(data: VCardData): string {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${data.lastName};${data.firstName};;;`,
    `FN:${data.firstName} ${data.lastName}`,
    `ORG:${data.organization}`,
    `TITLE:${data.title}`,
    `TEL;TYPE=CELL:${data.phone}`,
    `EMAIL:${data.email}`,
    `URL:${data.url}`,
    `ADR;TYPE=WORK:;;${data.address};;;`,
    'END:VCARD',
  ].join('\r\n');
}

export function downloadVCard(data: VCardData): void {
  const vcard = generateVCard(data);
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Renato_Tchobo.vcf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
