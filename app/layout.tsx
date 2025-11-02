import type { Metadata } from "next";
import { Source_Sans_3, Work_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const sourceSansPro = Source_Sans_3({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const workSans = Work_Sans({
  weight: ["500", "600"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jonathan Mares - Personal Website",
  description: "Personal website and blog by Jonathan Mares. Writing about computer science, software engineering, and motorcycles.",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'light';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${sourceSansPro.variable} ${workSans.variable} antialiased bg-white dark:bg-gray-950 text-[#111111] dark:text-gray-100 min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <Nav />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
