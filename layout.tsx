import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Voyage Log",
  description: "A vintage-style travel log map",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
