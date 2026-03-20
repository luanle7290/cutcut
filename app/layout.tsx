import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CutCut — AI Hair Studio',
  description: 'Thử kiểu tóc mới với AI. Upload selfie, chọn kiểu tóc, xem kết quả ngay lập tức.',
  keywords: ['thử tóc AI', 'virtual hair try-on', 'CutCut', 'hair studio'],
  authors: [{ name: 'CutCut' }],
  openGraph: {
    title: 'CutCut — AI Hair Studio',
    description: 'Thử kiểu tóc mới với AI. Upload selfie, chọn kiểu tóc, xem kết quả ngay lập tức.',
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary',
    title: 'CutCut — AI Hair Studio',
    description: 'Thử kiểu tóc mới với AI. Upload selfie, chọn kiểu tóc, xem kết quả ngay lập tức.',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0A0A0A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
