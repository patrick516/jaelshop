import type { Session } from "@/types";

const KEY = "jael-admin-auth"; // the name the login is saved under in localStorage

// Reads the saved login. null when nobody is logged in or the browser blocks storage
export function getSession(): Session | null {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? (JSON.parse(saved) as Session) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: Session) {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    // storage blocked: the login simply lasts until the page closes
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nothing to clear
  }
}
