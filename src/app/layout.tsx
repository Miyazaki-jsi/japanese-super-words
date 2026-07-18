import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import { UiLangProvider } from '@/lib/uiLang';
import { UiThemeProvider } from '@/lib/uiTheme';
import './globals.css';

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  weight: ['500', '800'],
});

const APP_TITLE = 'Japanese Super Words';
const APP_DESCRIPTION =
  'Situation-based Japanese phrases for Japan travel. Learn, listen, and practice real conversations — companion app for Japanese Super Immersion.';

const THEME_BOOT_SCRIPT = `try{if(localStorage.getItem('japanese-super-words-dark-mode')==='true')document.documentElement.classList.add('dark')}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL('https://japanese-super-words.vercel.app'),
  title: APP_TITLE,
  description: APP_DESCRIPTION,
  applicationName: APP_TITLE,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'JS Words',
    statusBarStyle: 'default',
  },
  openGraph: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    type: 'website',
    locale: 'en_US',
    siteName: APP_TITLE,
    images: [
      {
        url: '/social/og.png',
        width: 1200,
        height: 630,
        alt: APP_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    images: ['/social/og.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4f46e5' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <UiThemeProvider>
          <UiLangProvider>
            {plausibleDomain ? (
              <Script
                defer
                data-domain={plausibleDomain}
                src="https://plausible.io/js/script.pageview-props.tagged-events.js"
                strategy="afterInteractive"
              />
            ) : null}
            {children}
          </UiLangProvider>
        </UiThemeProvider>
      </body>
    </html>
  );
}
