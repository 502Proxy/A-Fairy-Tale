import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'A fairy Tale',
  description: 'Created with Next.js, Tailwind CSS, and TypeScript',
  generator: 'Tristan Müller',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <Providers>
          {' '}
          {/* Hier SessionProvider einbinden */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
