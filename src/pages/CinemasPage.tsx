import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCinema } from '../context/CinemaContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { RedNoirBackground } from '../components/RedNoirBackground';
import { CITIES } from '../data/mockData';
import { Theatre, Movie, Show } from '../types';
import {
  Building2,
  MapPin,
  Sparkles,
  Ticket,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Film,
  Star,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const CinemasPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    theatres,
    movies,
    selectedCity,
    setSelectedCity,
    getShowsForMovieAndDate,
    setSelectedShow
  } = useCinema();

  const [cinemaSearch, setCinemaSearch] = useState('');
  const today = new Date().toISOString().split('T')[0];

  // Filter theatres by selected city and search query
  const cityTheatres = theatres.filter((t) => {
    const matchesCity = t.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesQuery =
      cinemaSearch === '' ||
      t.name.toLowerCase().includes(cinemaSearch.toLowerCase()) ||
      t.location.area.toLowerCase().includes(cinemaSearch.toLowerCase()) ||
      t.chain.toLowerCase().includes(cinemaSearch.toLowerCase());
    return matchesCity && matchesQuery;
  });

  const handleBookShow = (show: Show) => {
    setSelectedShow(show);
    navigate(`/seats/${show.id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden flex flex-col selection-red">
      <RedNoirBackground />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Navigation & Return to Movies Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 shadow-sm"
            >
              <span>← Back to Movies</span>
            </Link>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
                <Building2 className="w-6 h-6 text-rose-500" />
                <span>Cinemas in {selectedCity}</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Iconic theatres, multiplexes, and auditoriums with live showtimes
              </p>
            </div>
          </div>

          {/* Search within cinemas */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={cinemaSearch}
              onChange={(e) => setCinemaSearch(e.target.value)}
              placeholder="Search cinema or area..."
              className="w-full bg-[#0F172A] border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* City Filter Strip */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1 flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              City:
            </span>
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCity === city
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                    : 'bg-[#0F172A] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Theatres List */}
        {cityTheatres.length === 0 ? (
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Cinemas Found</h3>
            <p className="text-xs text-slate-400">
              No matching cinemas found in {selectedCity} for your search query. Try another city or clear the filter.
            </p>
            <button
              onClick={() => setCinemaSearch('')}
              className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {cityTheatres.map((theatre) => {
              // Gather current shows running at this specific theatre today
              const theatreShows: { movie: Movie; shows: Show[] }[] = [];
              movies.forEach((movie) => {
                const shows = getShowsForMovieAndDate(movie.id, today, theatre.city);
                const matchingShows = shows.filter((s) => s.theaterId === theatre.id);
                if (matchingShows.length > 0) {
                  theatreShows.push({
                    movie,
                    shows: matchingShows
                  });
                }
              });

              return (
                <div
                  key={theatre.id}
                  id={theatre.id}
                  className="bg-[#0F172A] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition hover:border-slate-700"
                >
                  {/* Theatre Header */}
                  <div className="p-6 bg-[#0B1120] border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-600/15 border border-rose-600/30 px-2.5 py-0.5 rounded">
                          {theatre.chain}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {theatre.screens.length} Auditoriums
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-white">
                        {theatre.name}
                      </h2>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span>{theatre.location.address} ({theatre.location.area})</span>
                      </div>
                    </div>

                    {/* Amenities pills */}
                    <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto max-w-md">
                      {theatre.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Now Showing at this Cinema */}
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <Film className="w-3.5 h-3.5 text-rose-500" />
                        <span>Now Playing Today ({theatreShows.length} Movies)</span>
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Select a showtime to choose seats
                      </span>
                    </div>

                    {theatreShows.length === 0 ? (
                      <div className="text-xs text-slate-500 italic py-4">
                        Schedule updates in progress for today. Check other cinemas in {theatre.city}.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {theatreShows.map(({ movie, shows }) => (
                          <div
                            key={movie.id}
                            className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-4 rounded-2xl bg-[#090D16] border border-slate-800/80 hover:border-slate-700/80 transition"
                          >
                            {/* Movie Info */}
                            <div className="flex items-start gap-4 flex-1">
                              <Link to={`/movie/${movie.id}`} className="flex-shrink-0 group">
                                <img
                                  src={movie.posterUrl}
                                  alt={movie.title}
                                  className="w-16 h-24 rounded-xl object-cover border border-slate-700 group-hover:scale-105 transition shadow-lg"
                                />
                              </Link>

                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Link
                                    to={`/movie/${movie.id}`}
                                    className="text-base font-bold text-white hover:text-rose-400 transition"
                                  >
                                    {movie.title}
                                  </Link>
                                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                    {movie.censorRating}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    {movie.rating}
                                  </span>
                                  <span aria-hidden="true">·</span>
                                  <span>{movie.duration} min</span>
                                  <span aria-hidden="true">·</span>
                                  <span>{movie.language.join(', ')}</span>
                                </div>

                                <div className="flex items-center gap-1.5 pt-1">
                                  {movie.formats.map((fmt) => (
                                    <span
                                      key={fmt}
                                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-600/10 border border-rose-600/20 text-rose-300"
                                    >
                                      {fmt}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Showtimes Row */}
                            <div className="flex flex-wrap items-center gap-2.5">
                              {shows.map((show) => {
                                const isFillingFast = show.occupancyStatus === 'FILLING_FAST';
                                const isAlmostFull = show.occupancyStatus === 'ALMOST_FULL';

                                return (
                                  <button
                                    key={show.id}
                                    onClick={() => handleBookShow(show)}
                                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-rose-500 hover:bg-slate-800 text-left transition flex flex-col group cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-mono font-bold text-emerald-400 group-hover:text-rose-400 transition">
                                        {show.showTime}
                                      </span>
                                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                                        {show.screenFormat}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 gap-3">
                                      <span>Screen {show.screenNumber}</span>
                                      <span
                                        className={
                                          isAlmostFull
                                            ? 'text-rose-400 font-bold'
                                            : isFillingFast
                                            ? 'text-amber-400'
                                            : 'text-slate-400'
                                        }
                                      >
                                        {isAlmostFull
                                          ? 'Almost Full'
                                          : isFillingFast
                                          ? 'Filling Fast'
                                          : 'Available'}
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
