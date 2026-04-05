/**
 * Student session storage — separate keys from any staff/teacher JWT so
 * logging out a student does not clear teacher sessions (and vice versa).
 */

const TOKEN_KEY = "sloka_student_jwt";
const PROFILE_KEY = "sloka_student_profile";

export type StoredStudentProfile = {
  studentId: string;
  class: string;
  section?: string;
  name?: string;
};

export function getStudentToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

/** True when both JWT and minimal profile exist (protected student routes). */
export function isStudentLoggedIn(): boolean {
  return Boolean(getStudentToken() && getStoredStudentProfile());
}

export function setStudentToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearStudentSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(PROFILE_KEY);
}

export function getStoredStudentProfile(): StoredStudentProfile | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const o = parsed as Record<string, unknown>;
    const studentId = String(o.studentId ?? "");
    const cls = String(o.class ?? "");
    if (!studentId || !cls) return null;
    return {
      studentId,
      class: cls,
      section: o.section != null ? String(o.section) : undefined,
      name: o.name != null ? String(o.name) : undefined,
    };
  } catch {
    return null;
  }
}

export function setStoredStudentProfile(profile: StoredStudentProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
