'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// You might want to create separate components for these
import FilterComponent from './components/FilterComponent';
import MovieGrid from './components/MovieGrid';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    sortBy: 'popularity.desc'
  });
  const [error, setError] = useState(null);

  const apiKey = 'YOUR_TMDB_API_KEY'; // Replace with your actual API key

  useEffect(() => {
    fetchGenres();
    fetchMovies();
  }, [filters]);

  const fetchGenres = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
      const data = await response.json();
      setGenres(data.genres);
    } catch (err) {
      setError('Error fetching genres');
    }
  };

  const fetchMovies = async () => {
    const { genre, year, sortBy } = filters;
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=${sortBy}&include_adult=false&include_video=false&page=1`;
    
    if (genre) url += `&with_genres=${genre}`;
    if (year) url += `&primary_release_year=${year}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setMovies(data.results);
    } catch (err) {
      setError('Error fetching movies');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Movies</h1>
      
      <FilterComponent 
        genres={genres}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <MovieGrid movies={movies} />
    </main>
  );
}

// components/FilterComponent.js
function FilterComponent({ genres, filters, onFilterChange }) {
  return (
    <div className="w-full mb-8 flex gap-4">
      <select 
        value={filters.genre}
        onChange={(e) => onFilterChange({ genre: e.target.value })}
        className="bg-gray-800 text-white p-2 rounded"
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>{genre.name}</option>
        ))}
      </select>

      <input 
        type="number"
        placeholder="Year"
        value={filters.year}
        onChange={(e) => onFilterChange({ year: e.target.value })}
        className="bg-gray-800 text-white p-2 rounded"
      />

      <select 
        value={filters.sortBy}
        onChange={(e) => onFilterChange({ sortBy: e.target.value })}
        className="bg-gray-800 text-white p-2 rounded"
      >
        <option value="popularity.desc">Popularity Descending</option>
        <option value="popularity.asc">Popularity Ascending</option>
        <option value="vote_average.desc">Rating Descending</option>
        <option value="vote_average.asc">Rating Ascending</option>
        <option value="release_date.desc">Release Date Descending</option>
        <option value="release_date.asc">Release Date Ascending</option>
      </select>
    </div>
  );
}

// components/MovieGrid.js
function MovieGrid({ movies }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
      {movies.map((movie) => (
        <Link href={`/movie/${movie.id}`} key={movie.id}>
          <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750}
              className="w-full h-auto"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{movie.title}</h2>
              <p className="text-sm text-gray-400 mb-2">{movie.release_date.substring(0, 4)}</p>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}