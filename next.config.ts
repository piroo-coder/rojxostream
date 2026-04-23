
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: false,
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'watchanimeworld.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wallpapers.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wallpapercave.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wallpapercat.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '4kwallpapers.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.wallpapersden.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.gettywallpapers.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images5.alphacoders.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wallpaperaccess.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.deviantart.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
