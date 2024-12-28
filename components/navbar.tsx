'use client'
import Link from 'next/link'
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from 'next/navigation'
import { Home, ArrowLeft, Search, Film } from 'lucide-react'

const Navbar: React.FC = () => {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  const isHomePage = pathname === '/'

  return (
    <nav className="bg-gray-800 text-white p-4"> 
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {!isHomePage && (
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </button>
          )}
          <Link 
            href="/" 
            className="text-xl font-bold flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="relative group">
              {/* Gradient background for icon */}
              <Film className="h-6 w-6" />
            </div>
            {/* Gradient text */}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500">
              Mom's Movie Picks
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link 
            href="/" 
            className={`flex items-center gap-2 p-2 rounded-full hover:bg-gray-700 transition-colors ${
              isHomePage ? 'text-purple-400' : ''
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Link>

          {session && (
            <Link 
              href="/admin" 
              className={`flex items-center gap-2 p-2 rounded-full hover:bg-gray-700 transition-colors ${
                pathname.startsWith('/admin') ? 'text-purple-400' : ''
              }`}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Admin Search</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar