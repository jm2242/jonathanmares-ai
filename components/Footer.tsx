export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
          © {currentYear} Jonathan Mares. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

