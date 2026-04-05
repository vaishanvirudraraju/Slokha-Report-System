import { getApiBase } from "@/lib/api-base";
import { getStudentToken } from "@/services/student-auth-storage";

export type StudentLoginBody = {
  studentId: string;
  class: string;
  section?: string;
  dateOfBirth?: string;
};

export type QuizSummary = {
  id: string;
  title: string;
  subject?: string;
  class?: string;
  durationMinutes: number;
  isPublished?: boolean;
};

export type QuizQuestion = {
  questionId?: string;
  question: string;
  options: string[];
};

export type QuizForAttempt = {
  id: string;
  title: string;
  subject?: string;
  class?: string;
  durationMinutes: number;
  questions: QuizQuestion[];
};

export type AnswerPayload = {
  questionIndex: number;
  selectedOption: string;
};

export type SubmitQuizBody = {
  quizId: string;
  answers: AnswerPayload[];
};

export type QuizSubmitResult = {
  score: number;
  total: number;
  message?: string;
  raw?: unknown;
};

export type QuizAttemptRecord = {
  quizId: string;
  quizTitle?: string;
  score: number;
  total: number;
  submittedAt?: string;
  raw?: unknown;
};

function authHeaders(): HeadersInit {
  const token = getStudentToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function extractToken(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const candidates = [
    o.access_token,
    o.accessToken,
    o.token,
    o.jwt,
    o.idToken,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.length > 0) return c;
  }
  return null;
}

function extractProfileFromLogin(
  data: unknown,
  fallback: StudentLoginBody,
): { studentId: string; class: string; section?: string; name?: string } {
  let studentId = fallback.studentId;
  let cls = fallback.class;
  let section = fallback.section;
  let name: string | undefined;

  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    const nested = o.student ?? o.data ?? o.user;
    if (nested && typeof nested === "object") {
      const s = nested as Record<string, unknown>;
      studentId = String(s.studentId ?? s.id ?? s.rollNo ?? studentId);
      cls = String(s.class ?? s.className ?? cls);
      section =
        s.section != null ? String(s.section) : section;
      name = s.name != null ? String(s.name) : name;
    }
    studentId = String(o.studentId ?? o.rollNo ?? studentId);
    if (o.class != null) cls = String(o.class);
    if (o.section != null) section = String(o.section);
  }

  return { studentId, class: cls, section, name };
}

function normalizeQuizList(data: unknown): QuizSummary[] {
  const raw =
    data && typeof data === "object"
      ? ((data as Record<string, unknown>).data ??
          (data as Record<string, unknown>).quizzes ??
          (data as Record<string, unknown>).items ??
          data)
      : data;

  const list = Array.isArray(raw) ? raw : [];
  return list.map((item, index) => {
    if (!item || typeof item !== "object") {
      return {
        id: String(index),
        title: "Quiz",
        durationMinutes: 15,
      };
    }
    const q = item as Record<string, unknown>;
    const id = String(q._id ?? q.id ?? q.quizId ?? index);
    const title = String(q.title ?? q.name ?? "Quiz");
    const durationMinutes = Number(q.duration ?? q.durationMinutes ?? 15);
    return {
      id,
      title,
      subject: q.subject != null ? String(q.subject) : undefined,
      class: q.class != null ? String(q.class) : undefined,
      durationMinutes: Number.isFinite(durationMinutes) ? durationMinutes : 15,
      isPublished:
        typeof q.isPublished === "boolean" ? q.isPublished : undefined,
    };
  });
}

function normalizeQuestions(raw: unknown): QuizQuestion[] {
  const list = Array.isArray(raw) ? raw : [];
  return list.map((item, index) => {
    if (!item || typeof item !== "object") {
      return { question: "—", options: [] };
    }
    const q = item as Record<string, unknown>;
    const text = String(q.question ?? q.text ?? q.prompt ?? "");
    let options: string[] = [];
    const opts = q.options ?? q.choices;
    if (Array.isArray(opts)) {
      options = opts.map((o) => String(o));
    }
    const questionId =
      q.questionId != null
        ? String(q.questionId)
        : q._id != null
          ? String(q._id)
          : undefined;
    return {
      questionId,
      question: text || `Question ${index + 1}`,
      options,
    };
  });
}

function normalizeQuizPayload(data: unknown, fallbackId: string): QuizForAttempt {
  const root =
    data && typeof data === "object"
      ? ((data as Record<string, unknown>).data ?? data)
      : data;
  if (!root || typeof root !== "object") {
    return {
      id: fallbackId,
      title: "Quiz",
      durationMinutes: 15,
      questions: [],
    };
  }
  const o = root as Record<string, unknown>;
  const id = String(o._id ?? o.id ?? fallbackId);
  const title = String(o.title ?? o.name ?? "Quiz");
  const durationMinutes = Number(o.duration ?? o.durationMinutes ?? 15);
  const questions = normalizeQuestions(o.questions);
  return {
    id,
    title,
    subject: o.subject != null ? String(o.subject) : undefined,
    class: o.class != null ? String(o.class) : undefined,
    durationMinutes: Number.isFinite(durationMinutes) ? durationMinutes : 15,
    questions,
  };
}

export async function studentLogin(
  body: StudentLoginBody,
): Promise<{ token: string; profile: ReturnType<typeof extractProfileFromLogin> }> {
  const base = getApiBase();
  const url = `${base}/student/login`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = await parseJsonSafe(response);
  if (!response.ok) {
    const msg =
      payload &&
      typeof payload === "object" &&
      "message" in (payload as object)
        ? String((payload as { message: unknown }).message)
        : response.statusText;
    throw new Error(msg || `Login failed (${response.status})`);
  }

  const token = extractToken(payload);
  if (!token) {
    throw new Error("Login succeeded but no token was returned.");
  }

  const profile = extractProfileFromLogin(payload, body);
  return { token, profile };
}

export async function fetchAvailableQuizzes(
  className: string,
): Promise<QuizSummary[]> {
  const base = getApiBase();
  const path = `/quiz/available/${encodeURIComponent(className)}`;
  const response = await fetch(`${base}${path}`, {
    method: "GET",
    headers: authHeaders(),
    cache: "no-store",
  });
  const payload = await parseJsonSafe(response);
  if (!response.ok) {
    const msg =
      payload &&
      typeof payload === "object" &&
      "message" in (payload as object)
        ? String((payload as { message: unknown }).message)
        : response.statusText;
    throw new Error(msg || `Could not load quizzes (${response.status})`);
  }
  return normalizeQuizList(payload);
}

const QUIZ_LOAD_PATHS = (id: string) =>
  [`/quiz/take/${id}`, `/quiz/student/${id}`, `/quiz/${id}`] as const;

export async function fetchQuizForAttempt(quizId: string): Promise<QuizForAttempt> {
  const base = getApiBase();
  let lastStatus = 0;
  let lastMessage = "Quiz not found.";

  for (const path of QUIZ_LOAD_PATHS(quizId)) {
    const response = await fetch(`${base}${path}`, {
      method: "GET",
      headers: authHeaders(),
      cache: "no-store",
    });
    lastStatus = response.status;
    const payload = await parseJsonSafe(response);
    if (response.ok) {
      return normalizeQuizPayload(payload, quizId);
    }
    if (payload && typeof payload === "object" && "message" in payload) {
      lastMessage = String((payload as { message: unknown }).message);
    }
  }

  throw new Error(lastMessage || `Could not load quiz (${lastStatus})`);
}

export async function submitQuizAttempt(
  body: SubmitQuizBody,
): Promise<QuizSubmitResult> {
  const base = getApiBase();
  const response = await fetch(`${base}/quiz/submit`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const payload = await parseJsonSafe(response);
  if (!response.ok) {
    const msg =
      payload &&
      typeof payload === "object" &&
      "message" in (payload as object)
        ? String((payload as { message: unknown }).message)
        : response.statusText;
    throw new Error(msg || `Submit failed (${response.status})`);
  }

  if (payload && typeof payload === "object") {
    const o = payload as Record<string, unknown>;
    const score = Number(o.score ?? o.marks ?? 0);
    const total = Number(o.total ?? o.maxScore ?? o.totalQuestions ?? 0);
    return {
      score: Number.isFinite(score) ? score : 0,
      total: Number.isFinite(total) ? total : 0,
      message: o.message != null ? String(o.message) : undefined,
      raw: payload,
    };
  }

  return { score: 0, total: 0, raw: payload };
}

const ATTEMPT_LIST_PATHS = [
  "/quiz/attempts/me",
  "/quiz/my-attempts",
  "/quiz/attempts",
] as const;

function normalizeAttempts(data: unknown): QuizAttemptRecord[] {
  const raw =
    data && typeof data === "object"
      ? ((data as Record<string, unknown>).data ??
          (data as Record<string, unknown>).attempts ??
          (data as Record<string, unknown>).items ??
          data)
      : data;

  const list = Array.isArray(raw) ? raw : [];
  return list.map((item, index) => {
    if (!item || typeof item !== "object") {
      return { quizId: String(index), score: 0, total: 0 };
    }
    const a = item as Record<string, unknown>;
    const quizId = String(a.quizId ?? a.quiz_id ?? index);
    const score = Number(a.score ?? a.marks ?? 0);
    const total = Number(a.total ?? a.maxScore ?? 0);
    const submittedAt =
      a.submittedAt != null
        ? String(a.submittedAt)
        : a.createdAt != null
          ? String(a.createdAt)
          : undefined;
    return {
      quizId,
      quizTitle: a.quizTitle != null ? String(a.quizTitle) : undefined,
      score: Number.isFinite(score) ? score : 0,
      total: Number.isFinite(total) ? total : 0,
      submittedAt,
      raw: item,
    };
  });
}

/**
 * Tries known attempt-list routes; returns [] if none respond successfully.
 */
export async function fetchMyAttempts(): Promise<QuizAttemptRecord[]> {
  const base = getApiBase();

  for (const path of ATTEMPT_LIST_PATHS) {
    try {
      const response = await fetch(`${base}${path}`, {
        method: "GET",
        headers: authHeaders(),
        cache: "no-store",
      });
      if (!response.ok) continue;
      const payload = await parseJsonSafe(response);
      return normalizeAttempts(payload);
    } catch {
      /* try next */
    }
  }

  return [];
}
