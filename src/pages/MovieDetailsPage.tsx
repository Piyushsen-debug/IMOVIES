import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCinema } from '../context/CinemaContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { TrailerModal } from '../components/TrailerModal';
import { RedNoirBackground } from '../components/RedNoirBackground';
import { MovieReviewsSection } from '../components/MovieReviewsSection';
import { Show } from '../types';
import {
  Star,
  Clock,
  Play,
  Calendar,
  MapPin,
  Sparkles,
  Ticket,
  ChevronLeft,
  Tv,
  CheckCircle2,
  Bookmark,
  Check
} from 'lucide-react';

export const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    movies,
    selectedCity,
    getShowsForMovieAndDate,
    setSelectedShow,
    watchlist,
    toggleWatchlist,
    isInWatchlist
  } = useCinema();

  const movie = movies.find((m) => m.id === id);

  // Generate 7-day calendar navigation strip
  const dateOptions = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: d.toISOString().split('T')[0],
      day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  const [selectedDate, setSelectedDate] = useState(dateOptions[0].iso);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Retrieve shows for this movie and date in the user's city
  const shows = movie ? getShowsForMovieAndDate(movie.id, selectedDate, selectedCity) : [];

  // Group shows by theater
  const showsByTheater = shows.reduce<Record<string, { theater: Show['theater']; showList: Show[] }>>(
    (acc, show) => {
      if (!acc[show.theaterId]) {
        acc[show.theaterId] = {
          theater: show.theater,
          showList: []
        };
      }
      acc[show.theaterId].showList.push(show);
      return acc;
    },
    {}
  );

  const handleSelectShow = (show: Show) => {
    setSelectedShow(show);
    navigate(`/seats/${show.id}`);
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#080C15] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Movie Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">
          The requested movie title may have completed its theatrical run.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
        >
          Return to Cinema Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden flex flex-col selection-red">
      <RedNoirBackground />
      <Header />

      {/* Backdrop Hero Header with Blur & Dark Atmosphere */}
      <div className="relative w-full h-80 sm:h-96 overflow-hidden bg-slate-950">
        <img
          src={movie.bannerUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-top blur-[2px] opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080C15] via-[#080C15]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080C15] via-transparent to-[#080C15]" />
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-52 sm:-mt-64 relative z-10 flex-1 pb-16">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Now Showing</span>
        </Link>

        {/* Poster & Movie Meta Row */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Card */}
          <div className="relative w-56 sm:w-64 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-900 flex-shrink-0 group">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover"
            />
            {movie.trailerUrl && (
              <button
                onClick={() => setIsTrailerOpen(true)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white font-bold text-xs"
              >
                <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
                <span>Play Trailer</span>
              </button>
            )}
          </div>

          {/* Details Column */}
          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-xs sm:text-sm text-slate-400 italic">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            {/* Unboxed inline metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="flex items-center gap-1 font-bold text-amber-400 bg-black/60 px-2 py-1 rounded-lg border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {movie.rating.toFixed(1)}/5 ({movie.votes.toLocaleString()} votes)
              </span>
              <span aria-hidden="true">·</span>
              <span className="bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-slate-300 font-mono">
                {movie.censorRating}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3 h-3 text-slate-400" />
                {movie.duration} Minutes
              </span>
              <span aria-hidden="true">·</span>
              <span>{movie.language.join(', ')}</span>
            </div>

            {/* Formats banner line */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Available Formats:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {movie.formats.map((fmt) => (
                  <span
                    key={fmt}
                    className="font-mono text-[11px] font-bold text-rose-300 bg-rose-600/15 border border-rose-600/30 px-2 py-0.5 rounded-md"
                  >
                    {fmt}
                  </span>
                ))}
              </div>
            </div>

            {/* Synopsis */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {movie.description}
            </p>

            <div className="text-xs text-slate-400 pt-1">
              <span>Director: <strong className="text-white">{movie.director}</strong></span>
            </div>

            {/* Action Buttons: Trailer & Watchlist */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {movie.trailerUrl && (
                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>Watch Official Cinema Trailer</span>
                </button>
              )}

              <button
                onClick={() => toggleWatchlist(movie.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isInWatchlist(movie.id)
                    ? 'bg-rose-600/20 border border-rose-500/40 text-rose-300'
                    : 'bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white'
                }`}
              >
                {isInWatchlist(movie.id) ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-rose-400" />
                    <span>In My Watchlist</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                    <span>Save to Watchlist</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Cast & Characters Section (Pure Typographic Names & Roles, No AI Photos) */}
        {movie.cast && movie.cast.length > 0 && (
          <section className="mt-12 border-t border-slate-800/80 pt-8" aria-label="Cast and Characters">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Cast & Characters</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {movie.cast.length} Featured Artists
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {movie.cast.map((actor) => (
                <div
                  key={actor.actorName}
                  className="flex flex-col justify-between p-3.5 rounded-xl bg-[#0F172A]/80 border border-slate-800/90 hover:border-rose-500/40 hover:bg-[#131d33] transition-all duration-200 group"
                >
                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors leading-snug">
                      {actor.actorName}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-tight">
                      {actor.roleName}
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Actor</span>
                    <span className="text-rose-400/60 group-hover:text-rose-400 transition-colors">★</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7-Day Date Selector Strip */}
        <section className="mt-10 border-t border-slate-800/80 pt-8" aria-label="Select Date">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>Select Date in {selectedCity}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-3">
            {dateOptions.map((d) => {
              const isSelected = selectedDate === d.iso;
              return (
                <button
                  key={d.iso}
                  onClick={() => setSelectedDate(d.iso)}
                  className={`flex flex-col items-center min-w-[76px] py-3 px-2 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-950/50 scale-102'
                      : 'bg-[#0F172A] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    {d.day}
                  </span>
                  <span className="text-lg font-black font-mono my-0.5">
                    {d.dateNum}
                  </span>
                  <span className="text-[10px] text-slate-300 font-medium">
                    {d.month}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Theaters & Showtimes List */}
        <section className="mt-8 space-y-4" aria-label="Theaters and Showtimes">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Tv className="w-4 h-4 text-rose-500" />
            <span>Cinemas & Timings</span>
          </h2>

          {Object.keys(showsByTheater).length === 0 ? (
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-10 text-center text-slate-400 text-xs">
              <p className="font-semibold text-slate-300 text-sm mb-1">
                No shows scheduled on {selectedDate} in {selectedCity}.
              </p>
              <p>Please select another date from the calendar above or switch your city.</p>
            </div>
          ) : (
            Object.values(showsByTheater).map(({ theater, showList }) => (
              <div
                key={theater.id}
                className="bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-5 sm:p-6 transition-colors hover:border-slate-700 space-y-4"
              >
                {/* Theater Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{theater.name}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-rose-300 font-bold border border-slate-700">
                        {theater.chain}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {theater.location.address}
                    </p>
                  </div>

                  {/* Amenities */}
                  <div className="flex items-center gap-2 flex-wrap text-[11px] text-emerald-400">
                    {theater.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-medium text-[10px]"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Showtimes Grid */}
                <div className="flex items-center gap-3 flex-wrap">
                  {showList.map((show) => {
                    const isFillingFast = show.occupancyStatus === 'FILLING_FAST';
                    const isAlmostFull = show.occupancyStatus === 'ALMOST_FULL';

                    return (
                      <button
                        key={show.id}
                        onClick={() => handleSelectShow(show)}
                        className="group flex flex-col items-center bg-[#090D16] border border-slate-800 hover:border-emerald-500 hover:bg-slate-900 px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md text-left min-w-[110px]"
                        aria-label={`Select show at ${show.showTime} in ${show.screenFormat}`}
                      >
                        <span className="text-sm font-black text-white group-hover:text-emerald-400 font-mono">
                          {show.showTime}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[10px] font-bold text-rose-400 font-mono">
                            {show.screenFormat}
                          </span>
                          <span className="text-[10px] text-slate-500">·</span>
                          <span className="text-[10px] text-slate-400">
                            Screen {show.screenNumber}
                          </span>
                        </div>
                        <span
                          className={`text-[9px] font-semibold mt-1 uppercase tracking-wider ${
                            isAlmostFull
                              ? 'text-rose-400'
                              : isFillingFast
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {isAlmostFull ? 'Almost Full' : isFillingFast ? 'Filling Fast' : 'Available'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </section>

        {/* Audience Reviews & Star Ratings with Moderation */}
        <MovieReviewsSection movie={movie} />
      </main>

      <Footer />

      <TrailerModal
        trailerUrl={isTrailerOpen ? movie.trailerUrl : null}
        movieTitle={movie.title}
        onClose={() => setIsTrailerOpen(false)}
      />
    </div>
  );
};
