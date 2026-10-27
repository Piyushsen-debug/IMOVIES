import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types';
import {
  Ticket,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Star,
  Film
} from 'lucide-react';

interface CinematicHeroBannerProps {
  movie: Movie;
  selectedCity: string;
  onOpenFullTrailer: (movie: Movie) => void;
}

export const CinematicHeroBanner: React.FC<CinematicHeroBannerProps> = ({
  movie,
  selectedCity,
  onOpenFullTrailer
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Extract YouTube ID from trailerUrl
  const getYouTubeId = (url: string) => {
    if (!url) return 'Way9Dexny3w';
    const match = url.match(/(?:embed\/|v=|vi\/|youtu\.be\/|\/v\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : 'Way9Dexny3w';
  };

  const videoId = getYouTubeId(movie.trailerUrl);

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] rounded-3xl overflow-hidden mb-12 shadow-2xl border border-white/10 bg-black group select-none">
      {/* 1. Immersive Video Container (Base Layer) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-black">
        {/* Crisp cinematic backdrop poster as base layer */}
        <img
          src={movie.bannerUrl || movie.posterUrl}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-60 scale-105"
        />

        {isPlaying && (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <iframe
              key={`${videoId}-${isMuted}`}
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${
                isMuted ? 1 : 0
              }&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&modestbranding=1&fs=0&enablejsapi=1&start=3`}
              title={`${movie.title} Background Trailer`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280%] h-[280%] sm:w-[220%] sm:h-[220%] min-w-[2000px] min-h-[1200px] pointer-events-none border-0 scale-125 transition-opacity duration-700 opacity-80"
              style={{
                filter: 'brightness(0.7) contrast(1.2) saturate(1.15)'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )}
      </div>

      {/* 2. Dual Overlays: Radial for center focus + Linear for bottom readability */}
      <div className="absolute inset-0 radial-cinematic-overlay pointer-events-none" />
      <div className="absolute inset-0 linear-cinematic-overlay pointer-events-none" />

      {/* 3. Top-Right Video Controls (Mute/Unmute & Play/Pause) */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-medium transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
          title={isMuted ? 'Turn on trailer audio' : 'Mute trailer audio'}
          aria-label={isMuted ? 'Unmute background trailer' : 'Mute background trailer'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-[11px] uppercase tracking-wider">Unmute</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-[11px] uppercase tracking-wider text-emerald-400">Audio On</span>
            </>
          )}
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 text-white transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
          title={isPlaying ? 'Pause background trailer' : 'Play background trailer'}
          aria-label={isPlaying ? 'Pause trailer' : 'Play trailer'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 4. Vertically Centered Cinematic Hero Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-12 z-10 max-w-4xl space-y-4 animate-cinematic-reveal">
        {/* Glass Status Badge */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white font-mono">
              Live Cinema Trailer
            </span>
          </div>

          <span className="hidden sm:inline-flex px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-slate-300 text-[11px] tracking-wider uppercase font-mono">
            Now Showing in {selectedCity}
          </span>
        </div>

        {/* Ultra-Wide Display Headline with Regular & Italic Weight Mix */}
        <div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tighter leading-[0.92] text-white">
            {movie.title}
          </h1>
          {movie.tagline && (
            <p className="mt-1 text-sm sm:text-lg font-light italic text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-gray-400 tracking-wide">
              "{movie.tagline}"
            </p>
          )}
        </div>

        {/* Cinematic Meta Kicker */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
          <span className="flex items-center gap-1 font-bold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {movie.rating.toFixed(1)} Rating
          </span>
          <span aria-hidden="true" className="text-gray-600">·</span>
          <span>{movie.genre.join(', ')}</span>
          <span aria-hidden="true" className="text-gray-600">·</span>
          <span className="font-mono text-rose-300 font-semibold tracking-wider">
            {movie.formats.slice(0, 3).join(' · ')}
          </span>
          <span aria-hidden="true" className="text-gray-600">·</span>
          <span className="font-mono text-gray-400">{movie.censorRating}</span>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed max-w-2xl line-clamp-2">
          {movie.description}
        </p>

        {/* CTA Group with Magnetic Primary Button */}
        <div className="pt-2 flex items-center gap-4 flex-wrap">
          {/* Magnetic Primary CTA (Solid White, Black Text, Sliding Inner Layer) */}
          <Link
            to={`/movie/${movie.id}`}
            className="magnetic-btn group relative overflow-hidden rounded-full px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-2xl flex items-center gap-2 transition-transform cursor-pointer"
          >
            {/* Sliding background hover effect */}
            <div className="absolute inset-0 bg-gray-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <div className="relative z-10 flex items-center gap-2 text-black font-black">
              <Ticket className="w-4 h-4" />
              <span>Reserve Tickets</span>
            </div>
          </Link>

          {/* Secondary CTA (Outline circle with play icon) */}
          <button
            onClick={() => onOpenFullTrailer(movie)}
            className="group flex items-center gap-3 text-white text-xs sm:text-sm font-semibold tracking-widest uppercase transition-colors cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full border border-white/30 bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white/15 group-hover:border-white transition-all">
              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
            </div>
            <span className="text-gray-300 group-hover:text-white">
              Full Trailer
            </span>
          </button>
        </div>
      </div>

      {/* 5. Minimalist Scroll Indicator (Center Bottom) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden md:flex flex-col items-center opacity-60">
        <div className="w-[1px] h-8 bg-gradient-to-b from-white to-transparent animate-bounce" />
      </div>
    </div>
  );
};
