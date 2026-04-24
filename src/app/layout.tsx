
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { MediaProvider } from "@/context/MediaContext";

export const metadata: Metadata = {
  title: 'RojXOStream - Immersive Media Experience',
  description: 'Your premium destination for Anime, Movies, Songs, and Shorts.',
  icons: {
    icon: 'https://64.media.tumblr.com/bc10579e276096a58ff8f89e2948029d/9a9930ae0933e909-8c/s250x400/6ad418dba6305ec88c6fb4f4002274e1ef3d0de3.jpg',
    shortcut: 'https://64.media.tumblr.com/bc10579e276096a58ff8f89e2948029d/9a9930ae0933e909-8c/s250x400/6ad418dba6305ec88c6fb4f4002274e1ef3d0de3.jpg',
    apple: 'https://64.media.tumblr.com/bc10579e276096a58ff8f89e2948029d/9a9930ae0933e909-8c/s250x400/6ad418dba6305ec88c6fb4f4002274e1ef3d0de3.jpg',
  },
  openGraph: {
    title: 'RojXOStream',
    description: 'Immersive Media Experience',
    url: 'https://rojxostream.com',
    siteName: 'RojXOStream',
    images: [
      {
        url: 'https://64.media.tumblr.com/bc10579e276096a58ff8f89e2948029d/9a9930ae0933e909-8c/s250x400/6ad418dba6305ec88c6fb4f4002274e1ef3d0de3.jpg',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
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
        <link rel="canonical" href="https://rojxostream.com" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <MediaProvider>
          {children}
          <Toaster />
        </MediaProvider>
      </body>
    </html>
  );
}
