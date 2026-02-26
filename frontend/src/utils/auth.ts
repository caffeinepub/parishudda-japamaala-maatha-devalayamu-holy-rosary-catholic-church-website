const AUTH_SESSION_KEY = 'auth_session';
const ADMIN_PASSWORD = 'ChurchofHolyRosary@2026';

const DRAFT_KEYS = [
  'massScheduleDraft',
  'spiritualMessageDraft',
  'mediaGalleryDraft',
  'announcementDraft',
];

export function isAuthenticated(): boolean {
  const session = localStorage.getItem(AUTH_SESSION_KEY);
  return session === 'authenticated';
}

export function login(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_SESSION_KEY, 'authenticated');
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_SESSION_KEY);
  DRAFT_KEYS.forEach((key) => localStorage.removeItem(key));
}
