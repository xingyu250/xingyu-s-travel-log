import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Voyage Log',
  description: 'Interactive Travel Map',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>
      <body className="m-0 p-0 overflow-hidden">{children}</body>
    </html>
  );
}
