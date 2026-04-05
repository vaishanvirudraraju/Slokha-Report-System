import { QuizAttemptClient } from "@/components/QuizAttemptClient";

export default async function StudentQuizAttemptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <QuizAttemptClient quizId={id} />;
}
