import Link from "next/link";

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="mt-auto border-t border-neutral-200 bg-[#004d40] text-white"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="font-['Georgia',ui-serif,serif] text-xl font-bold text-[#f9c200]">
            Sloka Group of Schools
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/85">
            A temple of moral education — nurturing confident learners with strong
            values and academic excellence.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#f9c200]">
            Contact
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href="mailto:info@slokatheschools.com"
                className="text-white/90 underline decoration-[#f9c200]/50 underline-offset-4 hover:text-[#f9c200]"
              >
                info@slokatheschools.com
              </a>
            </li>
            <li>
              <a
                href="tel:+919502593723"
                className="text-white/90 hover:text-[#f9c200]"
              >
                91-9502593723
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#f9c200]">
            Quick links
          </h2>
          <ul className="mt-4 space-y-2 text-sm font-medium">
            <li>
              <Link href="/" className="text-white/90 hover:text-[#f9c200]">
                Home
              </Link>
            </li>
            <li>
              <Link href="/results" className="text-white/90 hover:text-[#f9c200]">
                Student results
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/70">
        © {new Date().getFullYear()} Sloka Group of Schools. All rights reserved.
      </div>
    </footer>
  );
}
