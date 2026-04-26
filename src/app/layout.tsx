
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { MediaProvider } from "@/context/MediaContext";

export const metadata: Metadata = {
  title: 'RojXOStream - Immersive Media Experience',
  description: 'Your premium destination for Anime, Movies, Songs, and Shorts.',
  icons: {
    icon: 'https://i.pinimg.com/736x/d7/6c/4e/d76c4e13c6766763bf26c1695099d571.jpg',
    shortcut: 'https://i.pinimg.com/736x/d7/6c/4e/d76c4e13c6766763bf26c1695099d571.jpg',
    apple: 'https://i.pinimg.com/736x/d7/6c/4e/d76c4e13c6766763bf26c1695099d571.jpg',
  },
  openGraph: {
    title: 'RojXOStream',
    description: 'Immersive Media Experience',
    url: 'https://rojxostream.com',
    siteName: 'RojXOStream',
    images: [
      {
        url: 'https://i.pinimg.com/736x/d7/6c/4e/d76c4e13c6766763bf26c1695099d571.jpg',
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
        {/* Explicit Favicon Links to override any defaults */}
        <link rel="icon" href="https://i.pinimg.com/736x/d7/6c/4e/d76c4e13c6766763bf26c1695099d571.jpg" />
        <link rel="shortcut icon" href="https://i.pinimg.com/736x/d7/6c/4e/d76c4e13c6766763bf26c1695099d571.jpg" />
        <link rel="apple-touch-icon" href="https://i.pinimg.com/736x/d7/6c/4e/d76c4e13c6766763bf26c1695099d571.jpg" />
        
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
