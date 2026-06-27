import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Sangsan Wongmoon — Game Developer & Creative Technologist',
  description:
    'Portfolio ของ สร้างสรรค์ วงศ์มูล (บิ๊ว) — เด็กสายสร้างที่ใช้เทคโนโลยี เกม และความคิดสร้างสรรค์ เพื่อสร้างประสบการณ์และแก้ปัญหาให้ผู้คน',
  keywords: [
    'Sangsan Wongmoon',
    'Game Developer',
    'Unity',
    'Blender',
    'Computer Engineering',
    'Portfolio',
    'Creative Technologist',
  ],
  authors: [{ name: 'Sangsan Wongmoon' }],
  openGraph: {
    title: 'Sangsan Wongmoon — Game Developer & Creative Technologist',
    description:
      'เด็กสายสร้างที่ใช้เทคโนโลยี เกม และความคิดสร้างสรรค์ เพื่อสร้างประสบการณ์และแก้ปัญหาให้ผู้คน',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
