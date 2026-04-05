"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { sanitizeStudentNextPath } from "@/lib/sanitize-student-next";
import {
  getStoredStudentProfile,
  getStudentToken,
} from "@/services/student-auth-storage";

/**
 * For protected `/student/*` pages (except login). Returns `true` only when the
 * student session is valid; otherwise redirects to `/student/login` with a safe
 * `?next=` URL. Does not fetch data until this is `true`.
 */
export function useRequireStudentAuth(): boolean {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const token = getStudentToken();
    const profile = getStoredStudentProfile();
    if (!token || !profile) {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const fullPath = `${pathname}${search}`;
      const next = sanitizeStudentNextPath(fullPath);
      const loginUrl = next
        ? `/student/login?next=${encodeURIComponent(next)}`
        : "/student/login";
      router.replace(loginUrl);
      return;
    }
    setAuthed(true);
  }, [router, pathname]);

  return authed;
}
