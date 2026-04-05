import Link from "next/link";

export default function TeacherLoginPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-neutral-200/80 bg-white/95 p-8 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#004d40]">
          Staff
        </p>
        <h1 className="mt-3 font-['Georgia',ui-serif,serif] text-2xl font-bold text-neutral-900">
          Teacher portal
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">
          Use your school admin or teacher app to sign in (hosted separately).
          Students use the quiz portal below — it uses a different login so
          staff sessions stay separate.
        </p>
        <Link
          href="/student/login"
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#f9c200] px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-[#004d40] shadow-[0_4px_14px_rgba(249,194,0,0.45)] transition hover:bg-[#e6b000]"
        >
          Open student quiz portal
        </Link>
        <p className="mt-6 text-sm text-neutral-600">
          <Link
            href="/"
            className="font-semibold text-[#004d40] underline-offset-4 hover:underline"
          >
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
