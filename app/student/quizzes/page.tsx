"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useRequireStudentAuth } from "@/hooks/useRequireStudentAuth";
import {
  clearStudentSession,
  getStoredStudentProfile,
} from "@/services/student-auth-storage";
import {
  fetchAvailableQuizzes,
  fetchMyAttempts,
  type QuizAttemptRecord,
  type QuizSummary,
} from "@/services/student-api";

export default function StudentQuizzesPage() {
  const router = useRouter();
  const authed = useRequireStudentAuth();
  const [profile, setProfile] = useState<ReturnType<
    typeof getStoredStudentProfile
  > | null>(null);
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [attempts, setAttempts] = useState<QuizAttemptRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (cls: string) => {
    setError(null);
    try {
      const [list, past] = await Promise.all([
        fetchAvailableQuizzes(cls),
        fetchMyAttempts(),
      ]);
      setQuizzes(list);
      setAttempts(past);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not load quizzes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    const p = getStoredStudentProfile();
    if (!p) return;
    setProfile(p);
    void load(p.class);
  }, [authed, load]);

  function handleLogout() {
    clearStudentSession();
    router.replace("/student/login");
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-neutral-600">
        <p className="font-medium text-neutral-800">Checking sign-in…</p>
        <p className="mt-2 text-sm text-neutral-500">
          Sign in is required to view quizzes. Redirecting you if needed.
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-neutral-600">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 border-b border-neutral-200 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-[#004d40]">
            Your quizzes
          </p>
          <h1 className="mt-1 font-['Georgia',ui-serif,serif] text-2xl font-bold text-neutral-900">
            Class {profile.class}
            {profile.section ? ` · ${profile.section}` : ""}
          </h1>
          {profile.name ? (
            <p className="mt-1 text-sm text-neutral-600">{profile.name}</p>
          ) : (
            <p className="mt-1 text-sm text-neutral-600">
              ID: {profile.studentId}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center justify-center rounded-full border-2 border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          Log out
        </button>
      </div>

      {loading ? (
        <p className="mt-10 text-neutral-600">Loading quizzes…</p>
      ) : error ? (
        <p className="mt-10 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error}
        </p>
      ) : quizzes.length === 0 ? (
        <p className="mt-10 text-neutral-600">
          No published quizzes for your class right now. Check back later.
        </p>
      ) : (
        <ul className="mt-10 space-y-4">
          {quizzes.map((q) => (
            <li key={q.id}>
              <Link
                href={`/student/quiz/${encodeURIComponent(q.id)}`}
                className="flex flex-col gap-1 rounded-2xl border border-neutral-200/90 bg-white/95 p-5 shadow-sm transition hover:border-[#004d40]/40 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <span className="font-semibold text-neutral-900">{q.title}</span>
                  {q.subject ? (
                    <span className="mt-1 block text-sm text-neutral-600">
                      {q.subject}
                    </span>
                  ) : null}
                </div>
                <span className="text-sm font-medium text-[#004d40]">
                  {q.durationMinutes} min →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <section className="mt-14">
        <h2 className="font-['Georgia',ui-serif,serif] text-lg font-bold text-neutral-900">
          Recent attempts
        </h2>
        {attempts.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-600">
            No past attempts yet, or the server did not return a list.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {attempts.map((a, i) => (
              <li
                key={`${a.quizId}-${i}`}
                className="rounded-xl border border-neutral-200 bg-white/90 px-4 py-3 text-sm"
              >
                <span className="font-medium text-neutral-900">
                  {a.quizTitle ?? `Quiz ${a.quizId}`}
                </span>
                <span className="mt-1 block text-neutral-600">
                  Score: {a.score} / {a.total}
                  {a.submittedAt ? ` · ${a.submittedAt}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
