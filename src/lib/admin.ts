export const ADMIN_EMAIL = 'renatotchobo0@gmail.com';

export function isAdmin(email?: string | null): boolean {
  return email === ADMIN_EMAIL;
}
