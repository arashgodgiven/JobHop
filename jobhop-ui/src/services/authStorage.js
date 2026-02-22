export function saveSession(session) {
  localStorage.setItem("session", JSON.stringify(session));
}

export function loadSession() {
  const raw = localStorage.getItem("session");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem("session");
  localStorage.removeItem("token");
}
