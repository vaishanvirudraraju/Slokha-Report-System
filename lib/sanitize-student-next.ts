/**
 * Only allow same-origin student routes as post-login redirects (no open redirects).
 */
export function sanitizeStudentNextPath(raw: string | null | undefined): string | null {
  if (raw == null || typeof raw !== "string") return null;
  const t = raw.trim();
  if (t === "" || t.startsWith("//") || t.includes("://")) return null;
  if (!t.startsWith("/")) return null;
  if (!t.startsWith("/student/")) return null;
  if (t.startsWith("/student/login")) return null;
  return t;
}
