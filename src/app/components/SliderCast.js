'use client'

import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import { FaAngleDoubleRight, FaAngleDoubleLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";


export default function Slider({movieData, title}) {

//   const [movieData, setmovieData] = useState([]);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [gapSize, setGapSize] = useState(0);
  const [slides, setSlides] = useState(0);
  const [visibleCards, setVisibleCards] = useState(0);
  const sliderRef = useRef(null);
  let scrollTimeout = useRef(null);
  const router = useRouter();



  useEffect(() => {
    // Calculate gap size after movies are loaded
    if (sliderRef.current && sliderRef.current.children.length > 1) {
      const firstChildRect = sliderRef.current.children[0].getBoundingClientRect();
      const secondChildRect = sliderRef.current.children[1].getBoundingClientRect();
      const calculatedGapSize = secondChildRect.left - firstChildRect.right;
      setGapSize(calculatedGapSize);

      const slides= Math.round(((sliderRef.current.children[0].getBoundingClientRect().width + gapSize)*sliderRef.current.children.length)/sliderRef.current.getBoundingClientRect().width);

      const visCards= Math.round(sliderRef.current.getBoundingClientRect().width / sliderRef.current.children[0].getBoundingClientRect().width);
      setVisibleCards(visCards);
      
      const slideControl = ((((sliderRef.current.children[0].getBoundingClientRect().width + gapSize)*sliderRef.current.children.length)/sliderRef.current.getBoundingClientRect().width) - slides <= sliderRef.current.children[0].getBoundingClientRect().width / sliderRef.current.getBoundingClientRect().width);

      if (slideControl){
      setSlides(slides);} else {setSlides(slides+1);}

      // console.log("slides" + slides)
      // console.log((((sliderRef.current.children[0].getBoundingClientRect().width + gapSize)*sliderRef.current.children.length)/sliderRef.current.getBoundingClientRect().width))
      // console.log(sliderRef.current.children[0].getBoundingClientRect().width / sliderRef.current.getBoundingClientRect().width)
      // console.log((((sliderRef.current.children[0].getBoundingClientRect().width + gapSize)*sliderRef.current.children.length)/sliderRef.current.getBoundingClientRect().width) - slides)

    }
  }, [movieData]); 

  const slideTo = (index) => {

    if (sliderRef.current && index >= 0 && index < slides) {
      
      sliderRef.current.scrollTo({
        left: sliderRef.current.getBoundingClientRect().width * index,
        // behavior: 'smooth'
      });
      setCurrentSlide(index);
      console.log(index, currentSlide, slides);
    }
  };


  const handleScroll = () => {
    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      if (!sliderRef.current) return;
      // const slideWidth = sliderRef.current.children[0].getBoundingClientRect().width;
      // const finalSlideWidth = slideWidth + gapSize;
      const newSlideIndex = Math.round(sliderRef.current.scrollLeft / sliderRef.current.getBoundingClientRect().width);
      if (newSlideIndex !== currentSlide) {

        if ((sliderRef.current.scrollLeft / sliderRef.current.getBoundingClientRect().width)-newSlideIndex <= sliderRef.current.children[0].getBoundingClientRect().width / sliderRef.current.getBoundingClientRect().width){
          setCurrentSlide(newSlideIndex);
        } else {
          setCurrentSlide(newSlideIndex+1);
        }


        // setCurrentSlide(newSlideIndex);
      }
    }, 100);
  };

  return (
      <div className="w-full flex flex-col md:px-4 py-4">
        <h1 className="text-white font-light text-xl md:text-2xl ml-6 md:ml-14 flex items-center gap-1">{title} <span className="text-white font-semibold p-1 text-sm mx-1 bg-[#CC1175] rounded rounded-full">{movieData.length}</span></h1>
      <div className="Slider flex flex-row w-full items-center justify-center md:gap-4 mt-4">
      <button disabled={currentSlide === 0} onClick={() => slideTo(currentSlide - 1)} className={`text-white px-1 md:px-2 py-2 disabled:text-gray-700 transition-colors duration-300`} >
      <FaAngleDoubleLeft className="md:size-6"></FaAngleDoubleLeft></button>
        <div
          className="flex flex-row flex-nowrap grow overflow-x-scroll gap-2 md:gap-4 scroll-smooth snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE and Edge */
          }}
          ref={sliderRef}
          onScroll={handleScroll}
        >
          {movieData.map((movie, index) => (
            <div
              className={`relative flex flex-col items-center justify-end text-center rounded-lg overflow-hidden min-w-[calc(25%-6px)] md:min-w-[calc((100%-80px)/6)] h-auto aspect-[3/4] z-[1] cursor-pointer ${
                index % visibleCards === 0 ? 'snap-start' : ''
              }`}
              key={movie.id}
              // onClick={() => router.push(`/${movie.id}`)}
            
            >
            <img src={movie.profile_path?`https://image.tmdb.org/t/p/w1280${movie.profile_path}`:'https://arquadrat.com/wp-content/uploads/2015/08/20.jpg'} alt={movie.title} className="w-full h-full object-cover absolute top-0 left-0 z-[-10] hover:scale-110 transition duration-500 grayscale hover:grayscale-0" />
             <div className="w-full flex flex-row items-center justify-center p-2 bg-black bg-opacity-60 pointer-events-none text-[10px] md:text-[14px]">{movie.name}</div>
             <div className="hidden w-full md:flex flex-row items-center justify-center p-2 bg-white text-black bg-opacity-70 pointer-events-none text-[10px] md:text-[14px]">({movie.character})</div>
            </div>
          ))}
        </div>
        <button disabled={currentSlide === slides-1} onClick={() => slideTo(currentSlide + 1)} className={`text-white px-1 md:px-2 py-2 disabled:text-gray-700 transition-colors duration-300`} >
        <FaAngleDoubleRight className="md:size-6"></FaAngleDoubleRight></button>
          
      </div>

      </div>
  );
}
