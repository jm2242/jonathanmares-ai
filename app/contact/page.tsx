"use client";

import { useState, FormEvent } from "react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(
          Array.from(formData.entries(), ([key, value]) => [key, String(value)])
        ).toString(),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Thank you for your message! I'll get back to you soon.");
        form.reset();
      } else {
        throw new Error("Form submission failed");
      }
    } catch {
      setStatus("error");
      setMessage(
        "Sorry, there was an error sending your message. Please try again or email me directly at contact@jonathanmares.com"
      );
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:px-10">
      <header className="mb-10 max-w-3xl">
        <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--green)]">
          Contact
        </p>
        <h1 className="font-serif-display text-5xl leading-none text-[var(--foreground)] sm:text-6xl">
          Say hello.
        </h1>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
          Feel free to reach out. I&apos;m always interested in connecting with fellow musicians,
          engineers, and motorcycle enthusiasts. Email works too:{" "}
          <a
            href="mailto:contact@jonathanmares.com"
            className="font-semibold text-[var(--green)] underline decoration-2 underline-offset-4"
          >
            contact@jonathanmares.com
          </a>
          .
        </p>
      </header>

      <form
        name="contact"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] sm:p-8"
      >
        <input type="hidden" name="form-name" value="contact" />
        <input type="hidden" name="bot-field" />
        <p style={{ display: "none" }}>
          <label>
            Don&apos;t fill this out if you&apos;re human: <input name="bot-field" />
          </label>
        </p>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-extrabold text-[var(--foreground)]"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="min-h-12 w-full rounded-lg border border-[var(--line)] bg-[var(--paper)] px-4 text-[var(--foreground)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[rgb(197_138_43/0.22)]"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-extrabold text-[var(--foreground)]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="min-h-12 w-full rounded-lg border border-[var(--line)] bg-[var(--paper)] px-4 text-[var(--foreground)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[rgb(197_138_43/0.22)]"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-extrabold text-[var(--foreground)]"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              className="w-full resize-y rounded-lg border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)] transition-colors focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[rgb(197_138_43/0.22)]"
              placeholder="Your message..."
            />
          </div>

          {message && (
            <div
              className={`rounded-lg border p-4 text-sm font-semibold ${
                status === "success"
                  ? "bg-[#e7f2ed] dark:bg-[#1d362f] border-[#b6d6c9] dark:border-[#3e6f62] text-[#173e42] dark:text-[#d9f0e9]"
                  : "bg-[#f8e8e6] dark:bg-[#3a211f] border-[#e2b5ae] dark:border-[#76504b] text-[#7e2f2b] dark:text-[#ffd2cb]"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="min-h-12 w-full rounded-full bg-[var(--green-dark)] px-6 py-3 font-extrabold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#d9f0e9] dark:text-[#111816]"
          >
            {status === "submitting" ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
}
