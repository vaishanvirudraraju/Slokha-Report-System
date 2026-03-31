"use client";

import {
  ExamType,
  EXAM_TYPE_OPTIONS,
  EXAM_TYPE_LABELS,
} from "@/services/api";

type ResultFormProps = {
  onSubmit: (studentId: string, examType: ExamType) => void;
  loading: boolean;
  disabled?: boolean;
};

export function ResultForm({ onSubmit, loading, disabled }: ResultFormProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const studentId = String(fd.get("studentId") ?? "").trim();
    const examType = String(fd.get("examType") ?? "") as ExamType;
    if (!studentId) return;
    onSubmit(studentId, examType);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 sm:grid-cols-1"
      aria-busy={loading}
    >
      <div className="grid gap-2">
        <label
          htmlFor="studentId"
          className="text-sm font-bold text-[#004d40]"
        >
          Student ID
        </label>
        <input
          id="studentId"
          name="studentId"
          type="text"
          inputMode="text"
          autoComplete="off"
          placeholder="e.g. STU-2024-0142"
          disabled={disabled || loading}
          className="w-full rounded-2xl border-2 border-neutral-200 bg-white px-4 py-3.5 text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-[#004d40] focus:ring-4 focus:ring-[#f9c200]/25 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="examName"
          className="text-sm font-bold text-[#004d40]"
        >
          Exam name
        </label>
        <div className="relative">
          <select
            id="examName"
            name="examType"
            defaultValue={ExamType.FORMATIVE_1}
            disabled={disabled || loading}
            className="relative z-10 w-full cursor-pointer appearance-none rounded-2xl border-2 border-neutral-200 bg-white px-4 py-3.5 pr-11 text-neutral-900 shadow-sm outline-none transition focus:border-[#004d40] focus:ring-4 focus:ring-[#f9c200]/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {EXAM_TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {EXAM_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
          <span
            className="pointer-events-none absolute right-3 top-1/2 z-20 -translate-y-1/2 text-[#004d40]"
            aria-hidden
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled || loading}
        className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#f9c200] px-8 text-sm font-bold uppercase tracking-wide text-[#004d40] shadow-[0_4px_18px_rgba(249,194,0,0.4)] transition hover:bg-[#e6b000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004d40] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-55"
      >
        {loading ? (
          <>
            <span
              className="size-5 animate-spin rounded-full border-2 border-[#004d40]/30 border-t-[#004d40]"
              aria-hidden
            />
            Fetching result…
          </>
        ) : (
          "View report"
        )}
      </button>
    </form>
  );
}
