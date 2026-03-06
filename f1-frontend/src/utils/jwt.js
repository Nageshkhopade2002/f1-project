// src/utils/jwt.js
export function parseJwt(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    // Replace URL-safe chars and pad base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
    const json = atob(padded);
    return JSON.parse(json);
  } catch (e) {
    console.error("Invalid JWT", e);
    return null;
  }
}

export function isTokenExpired(token) {
  const p = parseJwt(token);
  if (!p || !p.exp) return true;
  // exp is in seconds, Date.now() is ms
  return p.exp * 1000 < Date.now();
}
