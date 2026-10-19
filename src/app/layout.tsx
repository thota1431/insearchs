import type { Metadata } from "next";
import { Bricolage_Grotesque, Source_Sans_3 } from "next/font/google";
import Link from "next/link";
import "./globals.css";
const d = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-display" });
const b = Source_Sans_3({ subsets: ["latin"], variable: "--f-body" });
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "InSearch | Find Qualified Healthcare Professionals Faster", template: "%s | InSearch" },
  description: "Search doctors, nurses, technicians, pharmacists and healthcare staff across India. Free for hospitals and clinics.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${d.variable} ${b.variable}`}><body>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-display text-2xl font-bold">In<span className="text-care">Search</span></Link>
        <nav className="flex gap-5 text-sm font-semibold"><Link href="/search">Find candidates</Link><Link href="/register/candidate">Create profile</Link></nav>
      </header>
      {children}
      <footer className="mt-20 border-t border-ink/10 py-8 text-center text-sm">© {new Date().getFullYear()} InSearch. Healthcare hiring across India.</footer>
    </body></html>
  );
}
