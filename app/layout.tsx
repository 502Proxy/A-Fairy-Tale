import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'A fairy Tale',
  description: 'Created with Next.js, Tailwind CSS, and TypeScript',
  generator: 'Tristan Müller'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
