import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types';
import { Star, Play, Clock, Sparkles, Bookmark } from 'lucide-react';
import { useCinema } from '../context/CinemaContext';

interface MovieCardProps {
  movie: Movie;
  onWatchTrailer?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onWatchTrailer }) => {
  const { toggleWatchlist, isInWatchlist } = useCinema();
  return (
    <div className="group flex flex-col bg-[#0F172A]/70 rounded-2xl border border-slate-800/80 overflow-hidden hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-950/20 transition-all duration-300">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Rating & Votes Overlay Top Left */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-400">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{movie.rating.toFixed(1)}</span>
          <span className="text-[10px] text-slate-300 font-normal">
            ({(movie.votes / 1000).toFixed(0)}k)
          </span>
        </div>

        {/* Quick action buttons top right */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWatchlist(movie.id);
            }}
            className={`w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors shadow-lg cursor-pointer ${
              isInWatchlist(movie.id)
                ? 'bg-rose-600 border-rose-500 text-white'
                : 'bg-black/70 border-white/10 text-slate-300 hover:text-white hover:bg-black/90'
            }`}
            title={isInWatchlist(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
            aria-label={isInWatchlist(movie.id) ? `Remove ${movie.title} from Watchlist` : `Add ${movie.title} to Watchlist`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isInWatchlist(movie.id) ? 'fill-white' : ''}`} />
          </button>

          {movie.trailerUrl && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onWatchTrailer?.(movie);
              }}
              className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-rose-600 hover:border-rose-500 transition-colors shadow-lg cursor-pointer"
              title="Watch Official Trailer"
              aria-label={`Watch trailer for ${movie.title}`}
            >
              <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
            </button>
          )}
        </div>

        {/* Formats kicker strip at bottom of poster */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-200">
          <span className="font-semibold tracking-wider text-rose-300 drop-shadow">
            {movie.formats.slice(0, 2).join(' · ')}
          </span>
          <span className="text-[10px] bg-slate-900/90 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700/60 font-mono">
            {movie.censorRating}
          </span>
        </div>
      </div>

      {/* Movie Details Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <Link
            to={`/movie/${movie.id}`}
            className="block text-base font-bold text-white hover:text-rose-400 transition-colors line-clamp-1"
          >
            {movie.title}
          </Link>

          {/* Clean unboxed metadata with separators (Anti-Slop discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 line-clamp-1">
            <span>{movie.genre.slice(0, 2).join(', ')}</span>
            <span aria-hidden="true">·</span>
            <span>{movie.language.slice(0, 2).join(', ')}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3 text-slate-500" />
              {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/movie/${movie.id}`}
          className="w-full text-center py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-950/40 group-hover:shadow-rose-600/30"
        >
          Book Tickets
        </Link>
      </div>
    </div>
  );
};
