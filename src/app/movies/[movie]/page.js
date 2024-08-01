"use client";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import Slider from "@/app/components/slider";
import SliderPoster from "@/app/components/sliderPoster";
import SliderCast from "@/app/components/SliderCast";

export default function Movie({ params }) {
  

  const [movieDetails, setMovieDetails] = useState([]);
  const [trailer, setTrailer] = useState([]);
  const [newOpts, setNewOpts] = useState(null);
  const [error, setError] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [cast, setCast] = useState([]);

  const { movie } = params;

  useEffect(() => {
    const fetchMoviesData = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MzE5ODU1YWQyMTQ0MmM3NzdhNGM3ODUwZjM2MmRlNiIsIm5iZiI6MTcyMDkxMTE5OC4yNTgyMTEsInN1YiI6IjY2OTMwMzA1YjI5ZDE1M2NmNzdlMTA5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aKyuUP94pDBPybTflOnYB1KUGbnRWoawjt_sa15K1Is",
        },
      };

      // Fetch movie
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie}`,
          options
        );
        const data = await response.json();
        setMovieDetails(data);
        // console.log(data.title)// console.log(data); // Assuming the response has a 'results' array
      } catch (err) {
        setError(err);
      }

      // Fetch similar movie
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie}/similar?language=en-US&page=1`,
          options
        );
        const data = await response.json();
        setSimilarMovies(data.results);
        
      } catch (err) {
        setError(err);
      }

      // Fetch Cast
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie}/credits?language=en-U`,
          options
        );
        const data = await response.json();
        setCast(data.cast);
        console.log(data.cast)// console.log(data); // Assuming the response has a 'results' array
        
      } catch (err) {
        setError(err);
      }

      // Fetch video
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie}/videos?language=en-US`,
          options
        );
        const data = await response.json();
        setTrailer(data.results);
        setNewOpts({
          playerVars: {
            autoplay: 1,
            controls: 0,
            showinfo: 0,
            modestbranding: 0,
            loop: 1,
            fs: 0,
            cc_load_policy: 0,
            iv_load_policy: 3,
            autohide: 1,
            mute: 1,
            playlist: data.results[0].key,
            autoplay: 1,
          },
        });
        // console.log(data.title)// console.log(data); // Assuming the response has a 'results' array
      } catch (err) {
        setError(err);
      }
    };

    fetchMoviesData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-black">
      {/* Background Video Container */}

      <div className="relative flex justify-center w-full h-[100svh] aspect-[16/9] overflow-hidden">
        <div className="flex flex-col justify-end w-full gap-4 h-[80%] px-16 py-8 z-20">
          <img
            src={`https://image.tmdb.org/t/p/w1280${movieDetails.poster_path}`}
            className="w-[200px] h-auto object-cover mb-8 rounded-lg"
          ></img>
          <h1 className="text-4xl text-white font-bold max-w-xl">
            {movieDetails.title}{" "}
          </h1>
          <div className="flex gap-4">
            <span className="text-lg font-semibold max-w-xl">
              {" "}
              {movieDetails.release_date?.substring(0, 4)}{" "}
            </span>
            <span className="text-lg font-semibold max-w-xl">
              {" "}
              ~ {movieDetails.runtime} mins{" "}
            </span>
            <span className="text-md flex items-center text-align-center px-2 bg-opacity-30 bg-white text-white rounded max-w-xl">
              {movieDetails.adult ? "18+" : "PG 13"}
            </span>
          </div>
          <p className="text-lg text-gray-400 max-w-xl max-h-[100px] line-clamp-3">
            {movieDetails.overview}
          </p>
          <div className="flex gap-4">
            {movieDetails.genres?.map((genre, index) => (
              <span key={index} className="text-lg font-semibold max-w-xl">
                {" "}
                &#x2022; {genre.name}{" "}
              </span>
            ))}
          </div>
          <button className="bg-white text-black text-lg font-semibold px-4 py-2 rounded w-[300px] h-12 hover:scale-105 duration-300 active:scale-100 ">Watch Now</button>
        </div>

        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 z-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black from-10% to-transparent to-70% opacity-90 z-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent from-60% to-black to-90%  z-10"></div>
        {!newOpts ? (
          <img
            src={`https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path}`}
            className="absolute top-0 left-0 w-full h-full transform scale-150 " // Initial positioning
            iframeClassName="w-full h-full object-cover"
          />
        ) : (
          <YouTube
            videoId={trailer[0]?.key}
            opts={newOpts}
            className="absolute top-0 left-0 w-full h-full transform scale-150 pointer-events-none " // Initial positioning
            iframeClassName="w-full h-full object-cover"
          />
        )}
      </div>
      
      <SliderCast movieData={cast} title="Cast" />
      <Slider movieData={similarMovies} title="Similar Movies" />
      



      {/* Other Content (previously inside the same flex-row) */}
    </main>
  );
}
