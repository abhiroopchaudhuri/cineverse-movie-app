'use client'

import { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import SearchBar from './SearchBar';

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
          <Image src="/logo2.png" alt="Cineverse Logo" width={60} height={60} />
        </div>
         <div className={`${!isMoviePage() ? 'max-w-[120px]' : 'max-w-0'} overflow-hidden transition-all duration-300 ease-in-out`}><span className="text-white text-2xl XLfont-semibold font-oswald tracking-widest whitespace-nowrap">CINEVERSE</span></div>
      </Link>
      
      <div className="flex items-center space-x-6">
        <Link href="/movies" className="text-gray-300 hover:text-white transition-colors">
          Movies
        </Link>
        <Link href="/tvshows" className="text-gray-300 hover:text-white transition-colors">
          TV Shows
        </Link>

        <SearchBar />
      </div>
    </nav>
  );
}