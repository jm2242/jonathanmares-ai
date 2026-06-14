import Image from "next/image";
import Link from "next/link";
import { writingInterestFilters } from "@/lib/writing-interests";

const timeline = [
  {
    label: "Google - Tapestry",
    date: "2026 - Present",
    body: (
      <>
        Now focused on{" "}
        <a
          href="https://www.tapestryenergy.com/en"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[var(--green)] underline decoration-2 underline-offset-4"
        >
          Tapestry
        </a>
        , technology for the future of the electric grid.
      </>
    ),
  },
  {
    label: "Google Wallet",
    date: "2022-2026",
    body: "Spent about four years building products for Google Wallet at Google.",
  },
  {
    label: "Quorum",
    date: "2017-2022",
    body: "Previously an engineering manager at Quorum before joining Google.",
  },
];

export default function About() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
      <header className="mb-12 max-w-3xl">
        <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--green)]">
          About
        </p>
        <h1 className="font-serif-display text-5xl leading-none text-[var(--foreground)] sm:text-6xl">
          Engineer, musician, and rider in the East Bay.
        </h1>
      </header>

      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="relative overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-soft)]">
          <Image
            src="/images/jonathan-mares-profile.png"
            alt="Jonathan Mares"
            width={1058}
            height={1323}
            className="aspect-[4/5] w-full object-cover"
            priority
          />
        </div>

        <div className="grid gap-8">
          <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
            <div className="space-y-6 text-lg leading-8 text-[var(--foreground)]">
              <p>
                Hi, I&apos;m Jonathan. I&apos;m a software engineer based in the East Bay in
                Northern California. I work at Google, where I spent about four years building
                products for Google Wallet and now work on{" "}
                <a
                  href="https://www.tapestryenergy.com/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--green)] underline decoration-2 underline-offset-4"
                >
                  Tapestry
                </a>
                , focused on technology for the future of the electric grid.
              </p>

              <p>
                Originally from Be&apos;er Sheva, Israel, I grew up in New York and spent my college
                years at Cornell, studying Chemical Engineering and Computer Science. In my free
                time, I enjoy playing classical and jazz piano, mountain biking, motorcycles, and
                pretending to understand wine. You can find my recordings and
                performances on my{" "}
                <a
                  href="https://www.instagram.com/therealjonathanmares"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--green)] underline decoration-2 underline-offset-4"
                >
                  Instagram
                </a>{" "}
                and{" "}
                <a
                  href="https://www.youtube.com/@jmares93"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--green)] underline decoration-2 underline-offset-4"
                >
                  YouTube
                </a>{" "}
                pages.
              </p>

              <p>
                If you&apos;d like to reach me, you can write to me at{" "}
                <a
                  href="mailto:contact@jonathanmares.com"
                  className="font-semibold text-[var(--green)] underline decoration-2 underline-offset-4"
                >
                  contact@jonathanmares.com
                </a>
                .
              </p>
            </div>
          </section>

          <div className="grid gap-5 md:grid-cols-[1.25fr_0.75fr]">
            <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold text-[var(--foreground)]">Work</h2>
              <div className="space-y-5">
                {timeline.map(({ label, date, body }) => (
                  <div key={label} className="grid gap-2 sm:grid-cols-[148px_1fr] sm:gap-4">
                    <div>
                      <span className="block text-sm font-extrabold uppercase tracking-[0.08em] text-[var(--green)]">
                        {label}
                      </span>
                      <span className="mt-1 block text-sm font-bold text-[var(--muted)]">
                        {date}
                      </span>
                    </div>
                    <p className="leading-7 text-[var(--muted)]">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold text-[var(--foreground)]">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {writingInterestFilters.map((interest) => (
                  <Link
                    key={interest.value}
                    href={`/blog?interest=${interest.value}`}
                    className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-muted)] px-3 py-2 text-sm font-bold text-[var(--foreground)] transition hover:border-[#b7c3ba] hover:bg-[var(--surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green-dark)] dark:hover:border-[#53625d]"
                  >
                    {interest.label}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
