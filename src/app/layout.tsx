
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { MediaProvider } from "@/context/MediaContext";
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'RojXOStream - Immersive Media Experience',
  description: 'Your premium destination for Anime, Movies, Songs, and Shorts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Inter:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <MediaProvider>
          {children}
          <Toaster />
        </MediaProvider>
        <Analytics />
      </body>
    </html>
  );
}
