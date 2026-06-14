import Image from "next/image";

const timeline = [
  ["Now", "Software engineer at Google, working on Google Wallet from the East Bay."],
  ["Before", "Engineering manager at Quorum before joining Google."],
  [
    "Roots",
    "Born in Be'er Sheva, raised in New York, and studied Chemical Engineering and Computer Science at Cornell.",
  ],
];

const interests = ["Piano", "Soccer", "Mountain biking", "Motorcycles", "Wine"];

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
            src="/images/cheese.jpg"
            alt="Jonathan Mares"
            width={1200}
            height={1600}
            className="aspect-[4/5] w-full object-cover"
            priority
          />
        </div>

        <div className="grid gap-8">
          <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
            <div className="space-y-6 text-lg leading-8 text-[var(--foreground)]">
              <p>
                Hi! I&apos;m Jonathan Mares. I&apos;m currently based out of the East Bay in
                Northern California and am a software engineer at Google in Google Wallet.
              </p>

              <p>
                Originally from Be&apos;er Sheva, Israel, I grew up in New York and spent my college
                years at Cornell, studying Chemical Engineering and Computer Science. In my free
                time, I enjoy playing classical and jazz piano, soccer, mountain biking,
                motorcycles, and pretending to understand wine. You can find my recordings and
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
                Previously, I was an engineering manager at{" "}
                <a
                  href="https://www.quorum.us/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--green)] underline decoration-2 underline-offset-4"
                >
                  Quorum
                </a>
                . If you&apos;d like to reach me, you can write to me at{" "}
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
              <h2 className="mb-5 text-2xl font-bold text-[var(--foreground)]">Work and Places</h2>
              <div className="space-y-5">
                {timeline.map(([label, body]) => (
                  <div key={label} className="grid grid-cols-[72px_1fr] gap-4">
                    <span className="text-sm font-extrabold uppercase tracking-[0.08em] text-[var(--green)]">
                      {label}
                    </span>
                    <p className="leading-7 text-[var(--muted)]">{body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold text-[var(--foreground)]">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full border border-[var(--line)] bg-[var(--surface-muted)] px-3 py-2 text-sm font-bold text-[var(--foreground)]"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
