import type { Metadata } from 'next'
import type { NextFontWithVariable } from 'next/dist/compiled/@next/font'

import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'

import './globals.css'

const geistSans: NextFontWithVariable = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono: NextFontWithVariable = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: '???? Web',
  description: 'A web application for ???? data.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.ReactNode {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}

        <Analytics />
      </body>
    </html>
  )
}

