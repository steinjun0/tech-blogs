import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tech Blog Hub',
  description: '기술 블로그들을 한 곳에서 모아보세요.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://techbloghub.steinjun.net/',
    title: 'Tech Blog Hub',
    description: '기술 블로그들을 한 곳에서 모아보세요.',
    images: [
      {
        url: 'https://techbloghub.steinjun.net/icon.png',
        alt: 'Tech Blog Hub',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
