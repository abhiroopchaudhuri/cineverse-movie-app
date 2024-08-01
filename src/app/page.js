'use client'

import Image from "next/image";
import { useState, useEffect } from 'react';
import Slider from "./components/slider";
import SliderPoster from "./components/sliderPoster";
import SliderHero from "./components/sliderHero";
import SliderAuto from "./components/SliderAuto";

export default function Home() {

  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoviesData = async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MzE5ODU1YWQyMTQ0MmM3NzdhNGM3ODUwZjM2MmRlNiIsIm5iZiI6MTcyMDkxMTE5OC4yNTgyMTEsInN1YiI6IjY2OTMwMzA1YjI5ZDE1M2NmNzdlMTA5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aKyuUP94pDBPybTflOnYB1KUGbnRWoawjt_sa15K1Is'
        }
      };

      // Fetch popular movies
      try {
        const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options);
        const data = await response.json();
        setPopularMovies(data.results); // Assuming the response has a 'results' array
        // console.log(data);
      } catch (err) {
        setError(err);
      }

      // Fetch top rated movies
      try {
        const response = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options);
        const data = await response.json();
        setTopRatedMovies(data.results); // Assuming the response has a 'results' array
        // console.log(data);
      } catch (err) {
        setError(err);
      }

      // Fetch upcoming movies
      try {
        const response = await fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', options);
        const data = await response.json();
        setUpcomingMovies(data.results); // Assuming the response has a 'results' array
        // console.log(data);
      } catch (err) {
        setError(err);
      }

    };

    fetchMoviesData();
  }, []);

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  // if (!popularMovies) {
  //   return <div>Loading...</div>;
  // } 

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-black">
      {/* <div className="w-full h-[50svh] bg-gray-900 mb-4"></div> */}
      {/* <SliderHero movieData={popularMovies} title="Popular Movies" /> */}
      <SliderAuto movieData={upcomingMovies} title="Popular Movies" />
      <Slider movieData={popularMovies} title="Popular Movies" /> 
      <Slider movieData={topRatedMovies} title="Top Rated Movies" />
      <SliderPoster movieData={upcomingMovies} title="Upcoming Movies" /> 
    </main>
  );
}
