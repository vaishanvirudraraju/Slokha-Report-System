import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#004d40]/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(249,194,0,0.35)_0%,transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#004d40]">
            Welcome
          </p>
          <h1 className="mt-4 font-['Georgia',ui-serif,serif] text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Welcome to{" "}
            <span className="text-[#9d1b1f]">Sloka Group of Schools</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg">
            Excellence in academics, character, and community. Use our secure
            results portal to view your child&apos;s performance across formative
            and summative assessments.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/results"
              className="inline-flex w-full min-w-[200px] items-center justify-center rounded-full bg-[#f9c200] px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-[#004d40] shadow-[0_4px_14px_rgba(249,194,0,0.45)] transition hover:bg-[#e6b000] sm:w-auto"
            >
              View student result
            </Link>
            <Link
              href="/#contact"
              className="inline-flex w-full min-w-[200px] items-center justify-center rounded-full border-2 border-[#004d40] bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-[#004d40] transition hover:bg-[#004d40]/5 sm:w-auto"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-center font-['Georgia',ui-serif,serif] text-2xl font-bold text-neutral-900 sm:text-3xl">
          Why families choose Sloka
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Holistic growth",
              body: "Academic rigour paired with values-led education for well-rounded children.",
              accent: "border-l-[#38bdf8]",
            },
            {
              title: "Trusted faculty",
              body: "Experienced educators who mentor with care and high expectations.",
              accent: "border-l-[#f9c200]",
            },
            {
              title: "Transparent reports",
              body: "Clear, timely results so you always know how students are progressing.",
              accent: "border-l-[#fb923c]",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`rounded-2xl border border-neutral-200/80 bg-white/90 p-6 shadow-sm ${item.accent} border-l-4`}
            >
              <h3 className="text-lg font-bold text-neutral-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
