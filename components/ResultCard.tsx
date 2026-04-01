import { examTypeLabel, type StudentResult } from "@/services/api";

type ResultCardProps = {
  result: StudentResult;
  studentId: string;
  examType: string;
};

function formatMark(subject: StudentResult["subjects"][0]) {
  if (
    subject.maxMarks != null &&
    Number.isFinite(subject.maxMarks) &&
    subject.maxMarks > 0
  ) {
    return `${subject.marks} / ${subject.maxMarks}`;
  }
  return String(subject.marks);
}

function examAccentClass(examType: string): string {
  const accents: Record<string, string> = {
    FORMATIVE_1: "border-l-[#38bdf8]",
    FORMATIVE_2: "border-l-[#a78bfa]",
    FORMATIVE_3: "border-l-[#f9c200]",
    FORMATIVE_4: "border-l-[#fb923c]",
    SUMMATIVE_1: "border-l-[#0ea5e9]",
    SUMMATIVE_2: "border-l-[#7c3aed]",
    Final: "border-l-[#9d1b1f]",
  };
  return accents[examType] ?? "border-l-[#004d40]";
}

export function ResultCard({ result, studentId, examType }: ResultCardProps) {
  const stripe = examAccentClass(examType);

  return (
    <article
      className={`overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_16px_48px_rgba(0,77,64,0.1)] ${stripe} border-l-[6px]`}
    >
      <header className="border-b border-neutral-100 bg-gradient-to-br from-[#faf8f3] to-white px-6 py-5 sm:px-8 sm:py-6">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#004d40]">
          {examTypeLabel(examType)} · report
        </p>
        <h2 className="mt-2 font-['Georgia',ui-serif,serif] text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          {result.studentName}
        </h2>
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600">
          <div className="flex items-center gap-2">
            <dt className="font-bold text-[#004d40]">ID</dt>
            <dd className="rounded-lg bg-neutral-100 px-2.5 py-0.5 font-mono text-sm text-neutral-900">
              {studentId}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="font-bold text-[#004d40]">Class</dt>
            <dd className="font-semibold text-neutral-900">
              {result.className}
            </dd>
          </div>
        </dl>
      </header>

      <div className="px-6 py-5 sm:px-8 sm:py-6">
        <h3 className="text-sm font-bold text-[#004d40]">Subject marks</h3>
        <div className="mt-3 overflow-x-auto rounded-xl border border-neutral-100">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#004d40]/[0.06] text-xs font-bold uppercase tracking-wide text-[#004d40]">
              <tr>
                <th className="px-4 py-3 sm:px-5">Subject</th>
                <th className="px-4 py-3 text-right sm:px-5">Marks</th>
                {/* <th className="px-4 py-3 text-right sm:px-5">Grade</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {result.subjects.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-8 text-center text-neutral-500 sm:px-5"
                  >
                    No subject rows returned.
                  </td>
                </tr>
              ) : (
                result.subjects.map((subject, index) => (
                  <tr
                    key={`${index}-${subject.name}`}
                    className="bg-white transition hover:bg-[#f9c200]/[0.07]"
                  >
                    <td className="px-4 py-3 font-semibold text-neutral-800 sm:px-5">
                      {subject.name}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-neutral-900 sm:px-5">
                      {formatMark(subject)}
                    </td>
                    {/* <td className="px-4 py-3 text-right tabular-nums font-medium text-neutral-900 sm:px-5">
                      {result.grade}
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200/80 bg-[#faf8f3] px-4 py-4 sm:px-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[#004d40]">
              Total marks
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
              {result.maxTotalMarks != null &&
              Number.isFinite(result.maxTotalMarks) ? (
                <>
                  {result.totalMarks}
                  <span className="text-lg font-semibold text-neutral-500">
                    {" "}
                    / {result.maxTotalMarks}
                  </span>
                </>
              ) : (
                result.totalMarks
              )}
            </p>
          </div>
          <div className="rounded-2xl border-2 border-[#f9c200]/60 bg-gradient-to-br from-[#fffdf7] to-white px-4 py-4 sm:px-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9d1b1f]">
              Grade
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-[#004d40]">
              {result.grade}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
