import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinTech | Modern Financial Solutions",
  description: "Your modern financial companion for smart money management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geist.className} antialiased bg-[#1E3D59]`}>
        <div className="cosmic-background">
          <div className="stars"></div>
          <div className="aurora"></div>
        </div>
        {children}
      </body>
    </html>
  );
}
