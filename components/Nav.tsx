import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Nav() {
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-[#111111] dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Jonathan Mares
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm sm:text-base text-[#1a1a1a] dark:text-gray-300 hover:text-[#111111] dark:hover:text-white transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

