'use client'

import Image from "next/image";
import { useState, useEffect, useRef } from 'react';

export default function SliderPage() {

  const [popularMovies, setPopularMovies] = useState([]);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [gapSize, setGapSize] = useState(0);
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
    }
  }, [popularMovies]); 

  const slideTo = (index) => {
// Get the reference to the slider container


    const slidesInFrame= Math.round(sliderRef.current.getBoundingClientRect().width / sliderRef.current.children[0].getBoundingClientRect().width);
    if (sliderRef.current && index >= 0 && index <= sliderRef.current.children.length-slidesInFrame) {
      const slideWidth = sliderRef.current.children[0].getBoundingClientRect().width;
      const finalSlideWidth = slideWidth + gapSize;
      sliderRef.current.scrollTo({
        left: finalSlideWidth * index,
        // behavior: 'smooth'
      });
      setCurrentSlide(index);
      // console.log(slidesInFrame);
    }
  };

  useEffect(() => {
    console.log(currentSlide);
    console.log(popularMovies.length);
   
  }, [currentSlide, popularMovies.length]);

  const handleScroll = () => {
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      if (!sliderRef.current) return;
      const slideWidth = sliderRef.current.children[0].getBoundingClientRect().width;
      const finalSlideWidth = slideWidth + gapSize;
      const newSlideIndex = Math.round(sliderRef.current.scrollLeft / finalSlideWidth);
      if (newSlideIndex !== currentSlide) {
        setCurrentSlide(newSlideIndex);
      }
    }, 100);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16 bg-black">
      <div className="Slider flex flex-row w-full items-center justify-center gap-4">
        <button onClick={() => slideTo(currentSlide - 1)} className="bg-pink-500 px-4 py-2 rounded-md">Left</button>
        <div
          className="flex flex-row w-[90%] overflow-x-scroll gap-4 scroll-smooth snap-x"
          style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE and Edge */
          }}
          ref={sliderRef}
          onScroll={handleScroll}
        >
          {popularMovies.map(movie => (
            <div
              className="flex flex-col items-center justify-center text-center p-4 my-4 rounded-lg snap-start min-w-[calc(25%-12px)] h-32"
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
        <button onClick={() => slideTo(currentSlide + 1)} className="bg-pink-500 px-4 py-2 rounded-md">Right</button>
      </div>
    </main>
  );
}
