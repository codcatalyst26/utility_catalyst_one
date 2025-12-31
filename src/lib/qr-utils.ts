import type { EmailInput, PhoneInput, VCardInput } from './validation';

export function formatEmailData(data: EmailInput): string {
  const { email, subject, body } = data;
  let mailto = `mailto:${email}`;
  const params: string[] = [];
  
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  
  if (params.length > 0) {
    mailto += `?${params.join('&')}`;
  }
  
  return mailto;
}

export function formatPhoneData(data: PhoneInput): string {
  return `tel:${data.countryCode}${data.number}`;
}

export function formatVCardData(data: VCardInput): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${data.lastName || ''};${data.firstName};;;`,
    `FN:${data.firstName}${data.lastName ? ` ${data.lastName}` : ''}`,
  ];

  if (data.phone) lines.push(`TEL:${data.phone}`);
  if (data.email) lines.push(`EMAIL:${data.email}`);
  if (data.company) lines.push(`ORG:${data.company}`);
  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.address) lines.push(`ADR:;;${data.address};;;;`);
  if (data.website) lines.push(`URL:${data.website}`);

  lines.push('END:VCARD');
  return lines.join('\n');
}

export function getQRTypeName(type: string): string {
  const names: Record<string, string> = {
    url: 'URL',
    text: 'Text',
    email: 'Email',
    phone: 'Phone',
    vcard: 'Contact',
  };
  return names[type] || type;
}

export function generateDefaultName(type: string, data: string): string {
  const typeName = getQRTypeName(type);
  const preview = data.length > 30 ? data.substring(0, 30) + '...' : data;
  return `${typeName}: ${preview}`;
}

export const countryCodes = [
  { code: '+1', country: 'US/CA' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'India' },
  { code: '+86', country: 'China' },
  { code: '+81', country: 'Japan' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+39', country: 'Italy' },
  { code: '+34', country: 'Spain' },
  { code: '+61', country: 'Australia' },
  { code: '+55', country: 'Brazil' },
  { code: '+52', country: 'Mexico' },
  { code: '+82', country: 'South Korea' },
  { code: '+7', country: 'Russia' },
  { code: '+971', country: 'UAE' },
  { code: '+65', country: 'Singapore' },
  { code: '+60', country: 'Malaysia' },
  { code: '+62', country: 'Indonesia' },
  { code: '+63', country: 'Philippines' },
  { code: '+66', country: 'Thailand' },
];
