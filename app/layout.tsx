import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/auth-provider'
import './globals.css'
import Navbar from '@/components/navbar' 
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Mom's Movie and Show Picks",
  description: 'A personalized list of great movies and shows for Mom to watch',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  

  return (
    <html lang="en" className='dark'> 
      <body className={inter.className}>
        <AuthProvider>
          <Navbar/> 
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}