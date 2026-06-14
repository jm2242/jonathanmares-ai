export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-[var(--line)]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <p className="text-center text-sm text-[var(--muted)]">
          © {currentYear} Jonathan Mares. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
