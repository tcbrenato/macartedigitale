export function initialsAvatar(initials: string, background: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="100" fill="${background}"/><text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" font-family="'Plus Jakarta Sans', 'Inter', sans-serif" font-size="76" font-weight="800" fill="#ffffff">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
