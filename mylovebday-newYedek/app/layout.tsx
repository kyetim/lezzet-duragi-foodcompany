import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GülSen",
  description: "GülSen - Sevgiyle hazırlanmış özel uygulama",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="h-full">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className={`${inter.className} h-full`}>
        <main className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100">
          {children}
        </main>
      </body>
    </html>
  );
}
