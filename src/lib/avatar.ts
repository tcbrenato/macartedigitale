export function initialsAvatar(initials: string, background: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="${background}"/><text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" font-family="'Plus Jakarta Sans', 'Inter', sans-serif" font-size="150" font-weight="800" fill="#ffffff" fill-opacity="0.92">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
