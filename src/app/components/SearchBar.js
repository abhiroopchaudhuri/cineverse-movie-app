'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';


export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimeout = useRef(null);
  const suggestionsRef = useRef(null);
  const [isOverSuggestions, setIsOverSuggestions] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isInteractingWithSuggestions, setIsInteractingWithSuggestions] = useState(false);

  const pathName = usePathname();;

 
  


  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible((prevScrollPos > currentScrollPos && currentScrollPos > 0) || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, visible]);

  // useEffect(() => {
  //   const handleWheel = (e) => {
  //     if (isOverSuggestions) {
  //       // e.preventDefault();
  //       if (suggestionsRef.current) {
  //         suggestionsRef.current.scrollTop += e.deltaY;
  //       }
  //     }
  //   };
  
  //   window.addEventListener('wheel', handleWheel, { passive: false });
  
  //   return () => {
  //     window.removeEventListener('wheel', handleWheel);
  //   };
  // }, [isOverSuggestions]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (isOverSuggestions && suggestionsRef.current) {
        // const { scrollTop, scrollHeight, clientHeight } = suggestionsRef.current;
        // const isScrolledToTop = scrollTop === 0;
        // const isScrolledToBottom = scrollTop + clientHeight === scrollHeight;

        e.preventDefault();
        e.stopPropagation();
  
        // Check if scrolling up at the top or down at the bottom
        // if ((isScrolledToTop && e.deltaY < 0) || (isScrolledToBottom && e.deltaY > 0)) {
        //   return; // Allow page scroll at extremes
        // }
  
        // e.preventDefault();
        // e.stopPropagation();
        suggestionsRef.current.scrollTop += e.deltaY;
      }
    };
  
    const handleClick = (e) => {
      // Allow default click behavior
    };
  
    // Use capture phase for the wheel event
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('click', handleClick);
  
    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true });
      window.removeEventListener('click', handleClick);
    };
  }, [isOverSuggestions]);



  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (value) {
        fetchSuggestions(value);
      } else {
        setSuggestions([]);
      }
    }, 100); // 300ms delay
  };

  const fetchSuggestions = async (searchQuery) => {
    setIsLoading(true);
    setError(null);

    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MzE5ODU1YWQyMTQ0MmM3NzdhNGM3ODUwZjM2MmRlNiIsIm5iZiI6MTcyMDkxMTE5OC4yNTgyMTEsInN1YiI6IjY2OTMwMzA1YjI5ZDE1M2NmNzdlMTA5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aKyuUP94pDBPybTflOnYB1KUGbnRWoawjt_sa15K1Is",
        },
      };

      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          searchQuery
        )}&include_adult=false&language=en-US&page=1`,
        options
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && Array.isArray(data.results)) {
        setSuggestions(data.results);
      } else {
        console.error('Unexpected API response structure:', data);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setError('Failed to fetch suggestions. Please try again.');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   if (suggestions.length > 0) {
  //     setQuery(suggestions[0].title);
  //   }
  // }, [suggestions]);

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSuggestionClick(suggestions[0]);
      }
    }
  };

  const handleFocus = () => {
    setSuggestions([]);
  };

  const handleBlur = () => {
    if (!isInteractingWithSuggestions) {
      setTimeout(() => {
        setSuggestions([]);
      }, 200);
    }

    if (!isInteractingWithSuggestions) {
      setTimeout(() => {
        setSuggestions([]);
      }, 200);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
  };

  useEffect(() => {
    setSuggestions([]);
    setQuery('');
  }, [pathName]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Search..."
        className="bg-black opacity-80 text-white px-4 py-2 rounded-full ring-2 ring-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 w-64 placeholder-gray-600"
      />
      {query ? (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg hover:text-white"
        >
          ×
        </button>
      ): (<svg
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
      </svg>)}
      
      {/* {isLoading && (
        <div className="absolute mt-2 w-full text-center text-white">
          Loading...
        </div>
      )} */}
      {error && (
        <div className="absolute mt-2 w-full text-center text-red-500">
          {error}
        </div>
      )}
      {suggestions.length > 0 && (
        <div
        ref={suggestionsRef}
        onMouseEnter={() => {
          setIsOverSuggestions(true);
          setIsInteractingWithSuggestions(true);
        }}
        onMouseLeave={() => {
          setIsOverSuggestions(false);
          setIsInteractingWithSuggestions(false);
        }}
        onMouseDown={() => setIsInteractingWithSuggestions(true)}
        onMouseUp={() => setIsInteractingWithSuggestions(false)}
        className={`absolute mt-2 w-full bg-gray-800 rounded-md shadow-lg max-h-96 overflow-y-auto ${visible ? 'opacity-100' : 'opacity-0'} transition-all duration-300 ease-in-out`}>
          {suggestions.map((movie) => (
            <Link href={`/movies/${movie.id}`} key={movie.id} passHref>
              <div className="flex items-center p-2 hover:bg-gray-700 cursor-pointer">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                    width={46}
                    height={69}
                    className="rounded-md"
                  />
                ) : (
                  <div className="w-[46px] h-[69px] bg-gray-700 flex items-center justify-center rounded-md">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                <div className="ml-2">
                  <p className="text-white font-semibold">{movie.title}</p>
                  <p className="text-gray-400 text-sm">
                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}