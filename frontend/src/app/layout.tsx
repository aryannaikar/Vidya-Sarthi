import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Vidya Sarthi — Discover Opportunities. Unlock Potential.",
  description:
    "A refined student skill-to-opportunity discovery platform connecting Indian students with jobs, internships, and hackathons.",
  keywords: [
    "student jobs",
    "internships",
    "hackathons",
    "skill matching",
    "Vidya Sarthi",
  ],
  authors: [{ name: "Vidya Sarthi Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans bg-[var(--ground)] text-[var(--charcoal)] min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
