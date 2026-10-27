import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCinema } from '../context/CinemaContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MovieCard } from '../components/MovieCard';
import { TrailerModal } from '../components/TrailerModal';
import { CinematicHeroBanner } from '../components/CinematicHeroBanner';
import { RedNoirBackground } from '../components/RedNoirBackground';
import { Movie } from '../types';
import {
  Sparkles,
  Play,
  Ticket,
  SlidersHorizontal,
  Star,
  Film,
  Compass
} from 'lucide-react';

const GENRES = ['All', 'Sci-Fi', 'Action', 'Adventure', 'Drama', 'Comedy', 'Horror', 'Biography'];
const FORMATS = ['All Formats', 'IMAX 3D', '4DX', 'Dolby Atmos', '2D'];

export const HomePage: React.FC = () => {
  const { movies, selectedCity } = useCinema();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeFormat, setActiveFormat] = useState('All Formats');
  const [activeTrailerMovie, setActiveTrailerMovie] = useState<Movie | null>(null);

  // Filter movies based on search, genre, and format
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genre.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
      movie.language.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase())) ||
      movie.director.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre = activeGenre === 'All' || movie.genre.includes(activeGenre);
    const matchesFormat =
      activeFormat === 'All Formats' ||
      movie.formats.some((f) => f.toLowerCase().includes(activeFormat.toLowerCase()));

    return matchesSearch && matchesGenre && matchesFormat;
  });

  const featuredMovie = movies.find((m) => m.featured) || movies[0];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden flex flex-col selection-red">
      <RedNoirBackground />

      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Cinematic Luxury Hero with Background Trailer Video */}
        {featuredMovie && !searchQuery && (
          <CinematicHeroBanner
            movie={featuredMovie}
            selectedCity={selectedCity}
            onOpenFullTrailer={(m) => setActiveTrailerMovie(m)}
          />
        )}

        {/* Filter Controls (Segmented Tabs - anti-slop compliant) */}
        <div className="space-y-4 pb-6 border-b border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Genre Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setActiveGenre(genre)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeGenre === genre
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40'
                      : 'bg-[#0F172A] text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* Formats Dropdown / Selector */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={activeFormat}
                onChange={(e) => setActiveFormat(e.target.value)}
                className="bg-[#0F172A] border border-slate-800 text-xs rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-rose-500 cursor-pointer"
                aria-label="Filter by format"
              >
                {FORMATS.map((fmt) => (
                  <option key={fmt} value={fmt} className="bg-[#0F172A] text-slate-200">
                    {fmt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong className="text-white">{filteredMovies.length}</strong> movies in{' '}
              <strong className="text-rose-400">{selectedCity}</strong>
            </span>
            {searchQuery && (
              <span className="text-slate-400">
                Search results for <span className="text-white">"{searchQuery}"</span>
              </span>
            )}
          </div>
        </div>

        {/* Movies Grid */}
        <section id="movies" className="mt-8 scroll-mt-24" aria-label="Now Showing Movies">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white tracking-wide flex items-center gap-2 font-mono">
              <span>NOW SHOWING</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </h2>

            <Link
              to="/cinemas"
              className="text-xs font-bold text-rose-400 hover:text-rose-300 transition flex items-center gap-1 bg-[#0F172A] px-3 py-1.5 rounded-xl border border-slate-800"
            >
              <span>Explore Cinemas</span>
              <span>→</span>
            </Link>
          </div>

          {filteredMovies.length === 0 ? (
            <div className="text-center py-24 bg-[#0F172A]/50 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto">
              <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No Movies Found</h3>
              <p className="text-xs text-slate-400 mb-4">
                No active releases match the selected filters in {selectedCity}.
              </p>
              <button
                onClick={() => {
                  setActiveGenre('All');
                  setActiveFormat('All Formats');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onWatchTrailer={(m) => setActiveTrailerMovie(m)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Trailer Lightbox Modal */}
      <TrailerModal
        trailerUrl={activeTrailerMovie ? activeTrailerMovie.trailerUrl : null}
        movieTitle={activeTrailerMovie ? activeTrailerMovie.title : ''}
        onClose={() => setActiveTrailerMovie(null)}
      />
    </div>
  );
};
