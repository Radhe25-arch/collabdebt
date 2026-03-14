import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'CollabDebt — Split Smarter. Settle Faster.',
  description: 'Track shared expenses, simplify debts, and settle up without the awkward chases.',
}

import { DataProvider } from '@/providers/DataProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="font-sans antialiased text-[var(--text-primary)] bg-[var(--bg-primary)]">
        {/* Modern Background System */}
        <div className="mesh-bg">
          <div className="mesh-blob blob-1" />
          <div className="mesh-blob blob-2" />
          <div className="mesh-blob blob-3" />
        </div>
        <div className="noise-overlay" />

        <DataProvider>
          <main className="relative z-10">
            {children}
          </main>
        </DataProvider>

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '13px',
              fontFamily: 'var(--font-inter)',
            },
            success: {
              iconTheme: {
                primary: 'var(--success)',
                secondary: 'var(--bg-card)',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
