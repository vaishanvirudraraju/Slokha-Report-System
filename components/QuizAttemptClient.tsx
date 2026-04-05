"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRequireStudentAuth } from "@/hooks/useRequireStudentAuth";
import {
  fetchQuizForAttempt,
  submitQuizAttempt,
  type QuizForAttempt,
} from "@/services/student-api";

type Props = {
  quizId: string;
};

function formatTime(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function QuizAttemptClient({ quizId }: Props) {
  const router = useRouter();
  const authed = useRequireStudentAuth();
  const [quiz, setQuiz] = useState<QuizForAttempt | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    score: number;
    total: number;
  } | null>(null);
  const autoSubmitSent = useRef(false);

  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    fetchQuizForAttempt(quizId)
      .then((data) => {
        if (cancelled) return;
        autoSubmitSent.current = false;
        setQuiz(data);
        setTimeLeft(Math.max(1, data.durationMinutes) * 60);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setLoadError(e instanceof Error ? e.message : "Could not load quiz.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [quizId, authed]);

  const doSubmit = useCallback(async () => {
    if (!quiz || submitting || result) return;
    setSubmitting(true);
    setSubmitError(null);
    const payload = {
      quizId: quiz.id,
      answers: quiz.questions.map((_, index) => ({
        questionIndex: index,
        selectedOption: answers[index] ?? "",
      })),
    };
    try {
      const res = await submitQuizAttempt(payload);
      setResult({ score: res.score, total: res.total });
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : "Submit failed.");
    } finally {
      setSubmitting(false);
    }
  }, [answers, quiz, result, submitting]);

  useEffect(() => {
    if (!quiz || result) return;
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0) return prev;
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [quiz, result]);

  useEffect(() => {
    if (timeLeft !== 0 || !quiz || result || submitting) return;
    if (autoSubmitSent.current) return;
    autoSubmitSent.current = true;
    void doSubmit();
  }, [timeLeft, quiz, result, submitting, doSubmit]);

  if (!authed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-neutral-600">
        <p className="font-medium text-neutral-800">Checking sign-in…</p>
        <p className="mt-2 text-sm text-neutral-500">
          Sign in is required to attempt a quiz. Redirecting you if needed.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-neutral-600">
        Loading quiz…
      </div>
    );
  }

  if (loadError || !quiz) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50/90 p-6 text-red-900">
          <p className="font-semibold">Could not open this quiz</p>
          <p className="mt-2 text-sm">{loadError ?? "Unknown error"}</p>
          <Link
            href="/student/quizzes"
            className="mt-6 inline-flex rounded-full bg-[#004d40] px-5 py-2.5 text-sm font-bold text-white"
          >
            Back to quizzes
          </Link>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-[#004d40]/20 bg-white/95 p-8 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wider text-[#004d40]">
            Submitted
          </p>
          <h1 className="mt-2 font-['Georgia',ui-serif,serif] text-2xl font-bold text-neutral-900">
            {quiz.title}
          </h1>
          <p className="mt-6 text-lg text-neutral-700">
            Your score:{" "}
            <span className="font-bold text-[#9d1b1f]">
              {result.score}
            </span>{" "}
            / {result.total}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/student/quizzes"
              className="inline-flex rounded-full bg-[#f9c200] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#004d40] shadow-sm hover:bg-[#e6b000]"
            >
              Back to quizzes
            </Link>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex rounded-full border-2 border-[#004d40] bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#004d40] hover:bg-[#004d40]/5"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-[#004d40]">
            Quiz
          </p>
          <h1 className="mt-1 font-['Georgia',ui-serif,serif] text-2xl font-bold text-neutral-900">
            {quiz.title}
          </h1>
          {quiz.subject ? (
            <p className="mt-1 text-sm text-neutral-600">{quiz.subject}</p>
          ) : null}
        </div>
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold tabular-nums ${
            timeLeft !== null && timeLeft <= 60
              ? "bg-[#9d1b1f]/15 text-[#9d1b1f]"
              : "bg-[#004d40]/10 text-[#004d40]"
          }`}
          aria-live="polite"
        >
          <span aria-hidden>⏳</span>
          Time left: {timeLeft !== null ? formatTime(timeLeft) : "—"}
        </div>
      </div>

      <ol className="mt-8 space-y-10">
        {quiz.questions.map((q, qIndex) => (
          <li key={q.questionId ?? qIndex}>
            <p className="text-base font-semibold text-neutral-900">
              <span className="text-[#004d40]">{qIndex + 1}.</span>{" "}
              {q.question}
            </p>
            <div className="mt-4 space-y-3">
              {q.options.map((opt, oIndex) => {
                const id = `q${qIndex}-opt${oIndex}`;
                const checked = answers[qIndex] === opt;
                return (
                  <label
                    key={id}
                    htmlFor={id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition ${
                      checked
                        ? "border-[#004d40] bg-[#004d40]/5"
                        : "border-neutral-200 bg-white hover:border-[#004d40]/40"
                    }`}
                  >
                    <input
                      id={id}
                      type="radio"
                      name={`question-${qIndex}`}
                      className="mt-1 size-4 shrink-0 accent-[#004d40]"
                      checked={checked}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, [qIndex]: opt }))
                      }
                    />
                    <span className="text-sm leading-relaxed text-neutral-800">
                      {opt}
                    </span>
                  </label>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      {submitError ? (
        <p className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {submitError}
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={submitting}
          onClick={() => void doSubmit()}
          className="inline-flex min-w-[160px] items-center justify-center rounded-full bg-[#f9c200] px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-[#004d40] shadow-[0_4px_14px_rgba(249,194,0,0.45)] transition hover:bg-[#e6b000] disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit quiz"}
        </button>
        <Link
          href="/student/quizzes"
          className="inline-flex items-center justify-center rounded-full border-2 border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
