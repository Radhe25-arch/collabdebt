import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'CollabDebt — Engineering Intelligence Platform',
  description: 'Detect, quantify, and fix technical debt together. Real-time collaborative code editing with AI-powered debt detection.',
  keywords: ['technical debt', 'code quality', 'engineering', 'collaboration', 'AI'],
  openGraph: {
    title: 'CollabDebt',
    description: 'Technical debt, finally solved.',
    url: 'https://collabdebt.com',
    siteName: 'CollabDebt',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CollabDebt',
    description: 'Technical debt, finally solved.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0d1e2e',
              color: '#e2f0f9',
              border: '1px solid #234860',
              borderRadius: '10px',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#00ff88', secondary: '#0d1e2e' },
            },
            error: {
              iconTheme: { primary: '#ff3b5c', secondary: '#0d1e2e' },
            },
          }}
        />
      </body>
    </html>
  )
}
