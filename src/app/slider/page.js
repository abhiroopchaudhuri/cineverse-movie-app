'use client'

import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import { FaAngleDoubleRight, FaAngleDoubleLeft } from "react-icons/fa";


export default function SliderPage() {

  const [popularMovies, setPopularMovies] = useState([]);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [gapSize, setGapSize] = useState(0);
  const [slides, setSlides] = useState(0);
  const [visibleCards, setVisibleCards] = useState(0);
  const sliderRef = useRef(null);
  let scrollTimeout = useRef(null);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MzE5ODU1YWQyMTQ0MmM3NzdhNGM3ODUwZjM2MmRlNiIsIm5iZiI6MTcyMDkxMTE5OC4yNTgyMTEsInN1YiI6IjY2OTMwMzA1YjI5ZDE1M2NmNzdlMTA5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aKyuUP94pDBPybTflOnYB1KUGbnRWoawjt_sa15K1Is'
        }
      };

      try {
        const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options);
        const data = await response.json();
        setPopularMovies(data.results); // Assuming the response has a 'results' array
      } catch (err) {
        setError(err);
      }
    };

    fetchPopularMovies();
  }, []);

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  // if (!popularMovies) {
  //   return <div>Loading...</div>;
  // }

  useEffect(() => {
    // Calculate gap size after movies are loaded
    if (sliderRef.current && sliderRef.current.children.length > 1) {
      const firstChildRect = sliderRef.current.children[0].getBoundingClientRect();
      const secondChildRect = sliderRef.current.children[1].getBoundingClientRect();
      const calculatedGapSize = secondChildRect.left - firstChildRect.right;
      setGapSize(calculatedGapSize);

      const slides= Math.round(((sliderRef.current.children[0].getBoundingClientRect().width + gapSize)*sliderRef.current.children.length)/sliderRef.current.getBoundingClientRect().width);
      setSlides(slides);

      const visCards= Math.round(sliderRef.current.getBoundingClientRect().width / sliderRef.current.children[0].getBoundingClientRect().width);
      setVisibleCards(visCards);
    }
  }, [popularMovies]); 

  const slideTo = (index) => {
// Get the reference to the slider container

    // const slides= Math.round(((sliderRef.current.children[0].getBoundingClientRect().width + gapSize)*sliderRef.current.children.length)/sliderRef.current.getBoundingClientRect().width);

    // const slidesTotal= Math.round(sliderRef.current.getBoundingClientRect().width / sliderRef.current.children[0].getBoundingClientRect().width);
    if (sliderRef.current && index >= 0 && index < slides) {
      
      sliderRef.current.scrollTo({
        left: sliderRef.current.getBoundingClientRect().width * index,
        // behavior: 'smooth'
      });
      setCurrentSlide(index);
      console.log(index, currentSlide, slides);
    }
  };

  // useEffect(() => {
  //   console.log(currentSlide);
  //   console.log(popularMovies.length);
   
  // }, [currentSlide, popularMovies.length]);

  const handleScroll = () => {
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      if (!sliderRef.current) return;
      // const slideWidth = sliderRef.current.children[0].getBoundingClientRect().width;
      // const finalSlideWidth = slideWidth + gapSize;
      const newSlideIndex = Math.round(sliderRef.current.scrollLeft / sliderRef.current.getBoundingClientRect().width);
      if (newSlideIndex !== currentSlide) {
        setCurrentSlide(newSlideIndex);
      }
    }, 100);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between bg-black">
      <div className="w-full flex flex-col px-4 py-4">
        <h1 className="text-white font-light text-2xl ml-14 flex items-center gap-1">Popular Movies <span className="text-white font-semibold p-1 text-sm mx-1 bg-[#CC1175] rounded rounded-full">{popularMovies.length}</span></h1>
      <div className="Slider flex flex-row w-full items-center justify-center gap-4 ">
      <button disabled={currentSlide === 0} onClick={() => slideTo(currentSlide - 1)} className={`text-white px-2 py-2 disabled:text-gray-700 transition-colors duration-300`} >
      <FaAngleDoubleLeft className="size-6"></FaAngleDoubleLeft></button>
        <div
          className="flex flex-row flex-nowrap grow overflow-x-scroll gap-2 md:gap-4 scroll-smooth snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE and Edge */
          }}
          ref={sliderRef}
          onScroll={handleScroll}
        >
          {popularMovies.map((movie, index) => (
            <div
              className={`flex flex-col items-center justify-center text-center p-4 my-4 rounded-lg min-w-[calc(50%-4px)] md:min-w-[calc(25%-12px)] h-32 ${
                index % visibleCards === 0 ? 'snap-start' : ''
              }`}
              key={movie.id}
              style={{
                backgroundImage: `url('https://image.tmdb.org/t/p/w1280${movie.backdrop_path}')`,
                backgroundSize: 'cover',
              }}
            >
              {movie.title}
            </div>
          ))}
        </div>
        <button disabled={currentSlide === slides-1} onClick={() => slideTo(currentSlide + 1)} className={`text-white px-2 py-2 disabled:text-gray-700 transition-colors duration-300`} >
        <FaAngleDoubleRight className="size-6"></FaAngleDoubleRight></button>
          
      </div>

      </div>
    </main>
  );
}
