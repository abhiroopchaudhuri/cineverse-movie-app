'use client'

import { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const pathname = usePathname();

  const isMoviePage = () => {

    return pathname.startsWith('/movies/');
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible((prevScrollPos > currentScrollPos && currentScrollPos > 0) || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, visible]);

  //bg-gradient-to-b from-[rgba(0,0,0,0.8)] to-[rgba(0,0,0,0.5)]
  //style={isMoviePage() ?{backgroundColor:'rgba(4,85,7,0.8)'}:{backgroundColor:'rgba(0,60,4,0.5)'}}

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full h-20  backdrop-blur-lg z-[50] flex items-center justify-between px-6 ${!isMoviePage() && 'shadow-lg'} transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}
    ${isMoviePage() ? 'bg-transparent' : 'bg-gradient-to-b from-[rgba(0,0,0,0.5)] to-[rgba(0,0,0,0.3)]'}
    `}
    
    >
      <Link href="/" className="flex items-center">
        <div className="w-16 h-16 rounded-md flex items-center justify-center overflow-hidden">
          <Image src="/logo2.png" alt="Cineverse Logo" width={70} height={70} />
        </div>
        {!isMoviePage() && <span className="text-white text-xl font-semibold">Cineverse</span>}
      </Link>
      
      <div className="flex items-center space-x-6">
        <Link href="/movies" className="text-gray-300 hover:text-white transition-colors">
          Movies
        </Link>
        <Link href="/tvshows" className="text-gray-300 hover:text-white transition-colors">
          TV Shows
        </Link>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-800 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </nav>
  );
}