// ════════════════════════════════════════════════════════════
// next.config.js
// ════════════════════════════════════════════════════════════
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media.raisethevol.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google avatars
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://www.raisethevol.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PATCH,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}
module.exports = nextConfig


// ════════════════════════════════════════════════════════════
// tailwind.config.ts
// ════════════════════════════════════════════════════════════
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        purple: {
          DEFAULT: '#7F77DD',
          dark:    '#534AB7',
          deep:    '#3C3489',
          light:   '#AFA9EC',
          pale:    '#EEEDFE',
          mid:     '#CECBF6',
        },
        coral: {
          DEFAULT: '#D85A30',
          light:   '#FAECE7',
          mid:     '#F0997B',
        },
        teal: {
          DEFAULT: '#1D9E75',
          light:   '#E1F5EE',
        },
        pink: {
          DEFAULT: '#D4537E',
          light:   '#FBEAF0',
        },
        amber: {
          DEFAULT: '#BA7517',
          light:   '#FAEEDA',
        },
        brand: {
          text:       '#1a1a2e',
          muted:      '#6b6b8a',
          soft:       '#9999bb',
          bg:         '#f8f7ff',
          border:     'rgba(127,119,221,0.15)',
          border2:    'rgba(127,119,221,0.25)',
        },
      },
      borderRadius: {
        '2xl': '16px',
        'xl':  '10px',
        'pill': '999px',
      },
      boxShadow: {
        app: '0 0 60px rgba(83,74,183,0.12)',
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.4s ease-in-out infinite',
        'rec-pulse':  'rec-pulse 1s ease-in-out infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%, 100%': { opacity: '0.1', transform: 'scale(1)' },
          '50%':      { opacity: '0.3', transform: 'scale(1.02)' },
        },
        'rec-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(216,90,48,0.3)' },
          '50%':      { boxShadow: '0 0 0 10px rgba(216,90,48,0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config


// ════════════════════════════════════════════════════════════
// app/layout.tsx  (ROOT — wraps everything)
// ════════════════════════════════════════════════════════════
import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Raise The Volume — Inspire Through Every Word',
  description: 'A community platform where every voice matters. Share voice notes, videos, and stories — and inspire through every word.',
  metadataBase: new URL('https://www.raisethevol.com'),
  openGraph: {
    title: 'Raise The Volume',
    description: 'Inspire through every word.',
    url: 'https://www.raisethevol.com',
    siteName: 'Raise The Volume',
    images: [{ url: '/raise_the_vol_logo.png', width: 512, height: 512 }],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Raise The Volume',
    description: 'Inspire through every word.',
    images: ['/raise_the_vol_logo.png'],
  },
  icons: { icon: '/raise_the_vol_logo.png', apple: '/raise_the_vol_logo.png' },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3C3489',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="bg-[#f8f7ff] font-sans antialiased">
        {children}
      </body>
    </html>
  )
}


// ════════════════════════════════════════════════════════════
// app/globals.css
// ════════════════════════════════════════════════════════════
/*
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

@layer base {
  * { box-sizing: border-box; }
  body { -webkit-tap-highlight-color: transparent; }
}

@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar { display: none; }

  .font-syne { font-family: var(--font-syne), sans-serif; }
}
*/
