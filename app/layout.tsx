import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/auth-provider'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/components/navbar'
import { Metadata, Viewport } from 'next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: "Mom's Movie and Show Picks",
  description: 'A personalized list of great movies and shows for Mom to watch',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="en" 
      className={`dark ${inter.variable}`}
      suppressHydrationWarning
    >
      <head />
      <body 
        className={`min-h-screen bg-background font-sans antialiased ${inter.className}`}
      >
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Toaster />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}