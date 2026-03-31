export const ExamType = {
  FORMATIVE_1: "FORMATIVE_1",
  FORMATIVE_2: "FORMATIVE_2",
  FORMATIVE_3: "FORMATIVE_3",
  FORMATIVE_4: "FORMATIVE_4",
  SUMMATIVE_1: "SUMMATIVE_1",
  SUMMATIVE_2: "SUMMATIVE_2",
  Final: "Final",
} as const;

export type ExamType = (typeof ExamType)[keyof typeof ExamType];

export const EXAM_TYPE_OPTIONS: readonly ExamType[] = [
  ExamType.FORMATIVE_1,
  ExamType.FORMATIVE_2,
  ExamType.FORMATIVE_3,
  ExamType.FORMATIVE_4,
  ExamType.SUMMATIVE_1,
  ExamType.SUMMATIVE_2,
  ExamType.Final,
] as const;

export const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  FORMATIVE_1: "Formative 1",
  FORMATIVE_2: "Formative 2",
  FORMATIVE_3: "Formative 3",
  FORMATIVE_4: "Formative 4",
  SUMMATIVE_1: "Summative 1",
  SUMMATIVE_2: "Summative 2",
  Final: "Final",
};

export function examTypeLabel(value: string): string {
  if (Object.prototype.hasOwnProperty.call(EXAM_TYPE_LABELS, value)) {
    return EXAM_TYPE_LABELS[value as ExamType];
  }
  return value;
}

export type SubjectMark = {
  name: string;
  marks: number;
  maxMarks?: number;
};

export type StudentResult = {
  studentName: string;
  className: string;
  subjects: SubjectMark[];
  totalMarks: number;
  maxTotalMarks?: number;
  grade: string;
};


function combineClassAndSection(
  classVal: string,
  section: string | undefined,
): string {
  const c = classVal.trim();
  const s = section?.trim() ?? "";
  if (c && s) return `${c}-${s}`;
  return c || s || "";
}

function normalizePayload(data: unknown): StudentResult {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response from server.");
  }

  const obj = data as Record<string, unknown>;

  let studentName = "";
  let classPart = "";
  let section: string | undefined;

  const nested = obj.student;
  if (nested && typeof nested === "object") {
    const st = nested as Record<string, unknown>;
    studentName = String(st.name ?? "");
    const cls = st.class ?? st.className;
    classPart = cls != null ? String(cls) : "";
    section = st.section != null ? String(st.section) : undefined;
  }

  if (!studentName) {
    studentName = String(obj.studentName ?? obj.name ?? obj.student_name ?? "");
  }
  if (!classPart) {
    classPart = String(
      obj.className ?? obj.class ?? obj.class_name ?? "",
    );
  }

  const className = combineClassAndSection(classPart, section);
  const grade = String(obj.grade ?? "");
  const totalMarks = Number(obj.totalMarks ?? obj.total_marks ?? obj.total ?? 0);
  const maxTotalMarks =
    obj.maxTotalMarks != null || obj.max_total_marks != null
      ? Number(obj.maxTotalMarks ?? obj.max_total_marks)
      : undefined;

  const rawSubjects =
    (obj.subjects as unknown[]) ??
    (obj.marks as unknown[]) ??
    (obj.subjectMarks as unknown[]) ??
    [];

  const subjects: SubjectMark[] = rawSubjects.map((row) => {
    if (!row || typeof row !== "object") {
      return { name: "—", marks: 0 };
    }
    const s = row as Record<string, unknown>;
    const name = String(s.name ?? s.subject ?? s.title ?? "Subject");
    const marks = Number(s.marks ?? s.score ?? s.obtained ?? 0);
    const maxMarks =
      s.maxMarks != null || s.max_marks != null || s.total != null
        ? Number(s.maxMarks ?? s.max_marks ?? s.total)
        : undefined;
    return { name, marks, maxMarks };
  });

  return {
    studentName: studentName || "—",
    className: className || "—",
    subjects,
    totalMarks: Number.isFinite(totalMarks) ? totalMarks : 0,
    maxTotalMarks:
      maxTotalMarks != null && Number.isFinite(maxTotalMarks)
        ? maxTotalMarks
        : undefined,
    grade: grade || "—",
  };
}

export async function fetchStudentResult(
  studentId: string,
  examType: string,
): Promise<StudentResult> {
  const base = "https://sloka-backend.vercel.app";
  const path = `/results/${encodeURIComponent(studentId)}`;
  const query = new URLSearchParams({ examType }).toString();
  const url = `${base}${path}?${query}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch {
    throw new Error("Network error. Check your connection or API URL.");
  }

  if (response.status === 404) {
    throw new Error("No result found for this student and exam.");
  }

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const errBody = await response.json();
      if (errBody && typeof errBody === "object" && "message" in errBody) {
        detail = String((errBody as { message: unknown }).message);
      }
    } catch {
      /* use statusText */
    }
    throw new Error(detail || `Request failed (${response.status}).`);
  }

  const json: unknown = await response.json();
  return normalizePayload(json);
}
