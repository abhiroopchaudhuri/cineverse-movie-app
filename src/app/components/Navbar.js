'use client'

import { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full h-20 backdrop-blur-lg z-[50] flex items-center justify-between px-6 ${!isMoviePage() && 'shadow-lg'} transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}
    ${isMoviePage() ? 'bg-transparent' : 'bg-gradient-to-b from-[rgba(0,0,0,0.5)] to-[rgba(0,0,0,0.3)]'}
    `}>
      <Link href="/" className="flex items-center">
        <div className="w-16 h-16 rounded-md flex items-center justify-center overflow-hidden">
          <Image src="/logo2.png" alt="Cineverse Logo" width={60} height={60} />
        </div>
        <div className={`${!isMoviePage() ? 'max-w-[120px]' : 'max-w-0'} overflow-hidden transition-all duration-300 ease-in-out`}>
          <span className="text-white text-2xl font-semibold font-oswald tracking-widest whitespace-nowrap">CINEVERSE</span>
        </div>
      </Link>
      
      {/* Desktop menu */}
      <div className="hidden md:flex items-center space-x-6">
        <Link href="/movies" className="text-gray-300 hover:text-white transition-colors">
          Movies
        </Link>
        <Link href="/tvshows" className="text-gray-300 hover:text-white transition-colors">
          TV Shows
        </Link>
        <SearchBar />
      </div>

      {/* Hamburger menu icon */}
      <button 
        className="md:hidden text-white"
        onClick={toggleMobileMenu}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile sliding menu */}
      <div className={`md:hidden fixed top-0 right-0 bottom-0 w-[80%]  z-[60] transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-[100svh] p-6 bg-black bg-opacity-90 justify-start items-center">
          <button 
            className="self-end text-white mb-6"
            onClick={toggleMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="mb-6 w-full">
            <SearchBar />
          </div>
          
          <Link href="/movies" className="text-gray-300 hover:text-white transition-colors mb-4">
            Movies
          </Link>
          <Link href="/tvshows" className="text-gray-300 hover:text-white transition-colors mb-4">
            TV Shows
          </Link>
        </div>
      </div>
    </nav>
  );
}