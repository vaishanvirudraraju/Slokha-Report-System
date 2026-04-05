"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { sanitizeStudentNextPath } from "@/lib/sanitize-student-next";
import {
  getStoredStudentProfile,
  getStudentToken,
  setStoredStudentProfile,
  setStudentToken,
} from "@/services/student-auth-storage";
import { studentLogin } from "@/services/student-api";

export default function StudentLoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getStudentToken();
    const profile = getStoredStudentProfile();
    if (token && profile) {
      const next =
        typeof window !== "undefined"
          ? sanitizeStudentNextPath(
              new URLSearchParams(window.location.search).get("next"),
            )
          : null;
      router.replace(next ?? "/student/quizzes");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const sid = studentId.trim();
    const cls = className.trim();
    if (!sid || !cls) {
      setError("Student ID and class are required.");
      return;
    }
    setLoading(true);
    try {
      const body = {
        studentId: sid,
        class: cls,
        ...(section.trim() ? { section: section.trim() } : {}),
        ...(dateOfBirth.trim() ? { dateOfBirth: dateOfBirth.trim() } : {}),
      };
      const { token, profile } = await studentLogin(body);
      setStudentToken(token);
      setStoredStudentProfile({
        studentId: profile.studentId,
        class: profile.class,
        section: profile.section,
        name: profile.name,
      });
      const next =
        typeof window !== "undefined"
          ? sanitizeStudentNextPath(
              new URLSearchParams(window.location.search).get("next"),
            )
          : null;
      router.push(next ?? "/student/quizzes");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-neutral-200/80 bg-white/95 p-8 shadow-sm">
        <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-[#004d40]">
          Student quiz portal
        </p>
        <h1 className="mt-3 text-center font-['Georgia',ui-serif,serif] text-2xl font-bold text-neutral-900">
          Sign in
        </h1>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Use your student ID and class. Add section or date of birth if your
          school requires them.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="studentId"
              className="block text-sm font-semibold text-neutral-800"
            >
              Student ID / roll no.
            </label>
            <input
              id="studentId"
              name="studentId"
              autoComplete="username"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none ring-[#004d40]/0 transition focus:border-[#004d40] focus:ring-4 focus:ring-[#004d40]/15"
              required
            />
          </div>
          <div>
            <label
              htmlFor="class"
              className="block text-sm font-semibold text-neutral-800"
            >
              Class
            </label>
            <input
              id="class"
              name="class"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g. 5"
              className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none ring-[#004d40]/0 transition focus:border-[#004d40] focus:ring-4 focus:ring-[#004d40]/15"
              required
            />
          </div>
          <div>
            <label
              htmlFor="section"
              className="block text-sm font-semibold text-neutral-800"
            >
              Section <span className="font-normal text-neutral-500">(optional)</span>
            </label>
            <input
              id="section"
              name="section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none ring-[#004d40]/0 transition focus:border-[#004d40] focus:ring-4 focus:ring-[#004d40]/15"
            />
          </div>
          <div>
            <label
              htmlFor="dob"
              className="block text-sm font-semibold text-neutral-800"
            >
              Date of birth{" "}
              <span className="font-normal text-neutral-500">(optional)</span>
            </label>
            <input
              id="dob"
              name="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none ring-[#004d40]/0 transition focus:border-[#004d40] focus:ring-4 focus:ring-[#004d40]/15"
            />
          </div>

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#f9c200] py-3.5 text-sm font-bold uppercase tracking-wide text-[#004d40] shadow-[0_4px_14px_rgba(249,194,0,0.45)] transition hover:bg-[#e6b000] disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Continue"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          <Link href="/" className="font-semibold text-[#004d40] underline-offset-4 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
