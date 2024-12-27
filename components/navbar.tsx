import Link from 'next/link'

const Navbar: React.FC = () => {
  return (
    <nav className={`bg-gray-800 text-white p-4`}> 
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="text-xl font-bold flex items-center">
        <svg
      xmlns="http://www.w3.org/2000/svg"
      width='20'
      height='20'
      viewBox="0 0 24 24"
      fill="none"
    >
      <defs>
        <linearGradient id="filmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <path
        fill="url(#filmGradient)"
        d="M4 3H20C21.1046 3 22 3.89543 22 5V19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V5C2 3.89543 2.89543 3 4 3ZM4 5V19H20V5H4Z"
      />
      <path
        fill="url(#filmGradient)"
        d="M4 5H6V7H4V5ZM4 9H6V11H4V9ZM4 13H6V15H4V13ZM4 17H6V19H4V17ZM18 5H20V7H18V5ZM18 9H20V11H18V9ZM18 13H20V15H18V13ZM18 17H20V19H18V17ZM8 5H16V19H8V5Z"
      />
    </svg>

          Mom's Movie Picks
        </Link>
        <ul className="flex space-x-4">
          <li><Link href="/" className='flex items-center'>
          <svg
      xmlns="http://www.w3.org/2000/svg"
      width='20'
      height='20'
      viewBox="0 0 24 24"
      fill="none"
    >
      <defs>
        <linearGradient id="homeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <path
        fill="url(#homeGradient)"
        d="M12.7073 2.29289C12.3168 1.90237 11.6836 1.90237 11.2931 2.29289L3.29311 10.2929C2.90258 10.6834 2.90258 11.3166 3.29311 11.7071C3.68363 12.0976 4.3168 12.0976 4.70732 11.7071L5.00022 11.4142V20C5.00022 20.5523 5.44793 21 6.00022 21H9.00022C9.5525 21 10.0002 20.5523 10.0002 20V15C10.0002 14.4477 10.4479 14 11.0002 14H13.0002C13.5525 14 14.0002 14.4477 14.0002 15V20C14.0002 20.5523 14.4479 21 15.0002 21H18.0002C18.5525 21 19.0002 20.5523 19.0002 20V11.4142L19.2931 11.7071C19.6836 12.0976 20.3168 12.0976 20.7073 11.7071C21.0979 11.3166 21.0979 10.6834 20.7073 10.2929L12.7073 2.29289Z"
      />
    </svg>
          Home</Link></li>
          
        </ul>
      </div>
    </nav>
  )
}

export default Navbar;

