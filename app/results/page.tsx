"use client";

import { useState } from "react";
import { ResultCard } from "@/components/ResultCard";
import { ResultForm } from "@/components/ResultForm";
import {
  type ExamType,
  type StudentResult,
  fetchStudentResult,
} from "@/services/api";

export default function ResultsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StudentResult | null>(null);
  const [lastQuery, setLastQuery] = useState<{
    studentId: string;
    examType: ExamType;
  } | null>(null);

  async function handleSearch(studentId: string, examType: ExamType) {
    setError(null);
    setResult(null);
    setLoading(true);
    setLastQuery({ studentId, examType });
    try {
      const data = await fetchStudentResult(studentId, examType);
      setResult(data);
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col px-4 py-12 sm:px-6 sm:py-16 lg:max-w-4xl lg:px-8">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#004d40]">
          Student results portal
        </p>
        <h1 className="mt-3 font-['Georgia',ui-serif,serif] text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Academic <span className="text-[#9d1b1f]">report card</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-neutral-600">
          Enter the student ID issued by the school and select an exam name. Your
          report loads instantly — no account required.
        </p>
      </div>

      <div className="mt-12 rounded-2xl border border-neutral-200/90 bg-white/95 p-7 shadow-[0_12px_40px_rgba(0,77,64,0.08)] sm:p-9">
        <ResultForm onSubmit={handleSearch} loading={loading} />
      </div>

      {error ? (
        <div
          className="mt-8 rounded-2xl border border-red-200/90 bg-red-50 px-5 py-4 text-red-900 shadow-sm"
          role="alert"
        >
          <p className="font-bold">Could not load result</p>
          <p className="mt-1 text-sm text-red-800/95">{error}</p>
        </div>
      ) : null}

      {result && lastQuery ? (
        <div className="mt-12">
          <ResultCard
            result={result}
            studentId={lastQuery.studentId}
            examType={lastQuery.examType}
          />
        </div>
      ) : null}

      <p className="mx-auto mt-14 max-w-md text-center text-xs text-neutral-500">
        API endpoint{" "}
        <code className="rounded bg-neutral-200/60 px-1.5 py-0.5 font-mono text-[11px] text-neutral-700">
          GET /results/:studentId?examType=…
        </code>
        . Set{" "}
        <code className="rounded bg-neutral-200/60 px-1 font-mono text-[11px]">
          NEXT_PUBLIC_API_URL
        </code>{" "}
        if your server is on another host.
      </p>
    </main>
  );
}
