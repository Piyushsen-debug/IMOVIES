import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCinema } from '../context/CinemaContext';
import { CITIES } from '../data/mockData';
import {
  Film,
  MapPin,
  Search,
  Ticket,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Sparkles,
  Clapperboard,
  Building2
} from 'lucide-react';

import { AuthModal } from './AuthModal';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery = '',
  onSearchChange,
  onOpenAuth
}) => {
  const { currentUser, switchUserRole, selectedCity, setSelectedCity, logout, bookings, watchlist } = useCinema();
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenAuth = () => {
    if (onOpenAuth) {
      onOpenAuth();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const userConfirmedBookingsCount = bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090D16]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand & City Picker */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="IMovies Home"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black shadow-lg shadow-white/10 group-hover:scale-105 transition-transform flex-shrink-0">
              <Film className="w-5 h-5 text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5 font-display">
                IMOVIES
                <span className="text-[10px] bg-white/10 text-white font-sans px-2 py-0.5 rounded-full border border-white/20 tracking-widest font-mono">
                  DISTRICT
                </span>
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                Cinema Premiere
              </span>
            </div>
          </Link>

          {/* Quick "Movies / Home" Return Button */}
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600/15 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold transition-all shadow-sm group cursor-pointer"
            title="Return to Movies Catalog Home"
          >
            <Clapperboard className="w-3.5 h-3.5 text-rose-500 group-hover:rotate-6 transition-transform" />
            <span>Movies</span>
          </Link>

          {/* City Selection Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCityOpen(!isCityOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-colors cursor-pointer"
              aria-label="Select City"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-semibold">{selectedCity}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isCityOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsCityOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-[#0F172A] border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Select Your City
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {CITIES.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          setIsCityOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                          selectedCity === city
                            ? 'bg-rose-600/20 text-rose-400 font-bold'
                            : 'text-slate-300 hover:bg-slate-800/60'
                        }`}
                      >
                        <span>{city}</span>
                        {selectedCity === city && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center: Desktop Navigation Links in All-Caps Tracking-Widest */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.2em] font-bold text-white hover:text-rose-400 transition-colors"
          >
            Movies
          </Link>
          <Link
            to="/cinemas"
            className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Cinemas
          </Link>
          <Link
            to="/dashboard"
            className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>Passes</span>
            {userConfirmedBookingsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-black text-[9px] font-black flex items-center justify-center">
                {userConfirmedBookingsCount}
              </span>
            )}
          </Link>
          <Link
            to="/profile"
            className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Profile</span>
            {watchlist.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-white/20 text-white text-[9px] font-bold flex items-center justify-center">
                {watchlist.length}
              </span>
            )}
          </Link>
        </nav>

        {/* Global Live Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xs relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search movies, IMAX..."
            className="w-full bg-[#0B1120] border border-slate-800 text-xs rounded-full pl-9 pr-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-white/50 transition-all shadow-inner"
          />
        </div>

        {/* Right Nav Links & Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="relative hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-gray-300 hover:text-white hover:border-white transition-colors"
          >
            <Ticket className="w-3.5 h-3.5 text-emerald-400" />
            <span className="uppercase tracking-widest text-[11px]">Passes</span>
          </Link>

          {currentUser.role === 'admin' && (
            <Link
              to="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/15 border border-rose-600/30 text-rose-400 text-xs font-bold hover:bg-rose-600/25 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>
          )}

          {/* User Profile / Quick Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
              aria-label="User Account Menu"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
                {currentUser.name.slice(0, 2)}
              </div>
              <div className="hidden lg:flex flex-col text-left pr-1">
                <span className="text-xs font-bold text-slate-200 max-w-[110px] truncate leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">
                  {currentUser.role === 'admin' ? 'Manager' : 'Patron'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                  <div className="border-b border-slate-800/80 pb-2">
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {currentUser.role === 'admin' ? 'Cinema Operations Mode' : 'Customer Account'}
                    </span>
                  </div>

                  {/* 1-Click Role Switcher for instant reviewing */}
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800/80">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Instant Role Switch
                    </p>
                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      <button
                        onClick={() => {
                          switchUserRole('user');
                          setIsUserMenuOpen(false);
                          navigate('/');
                        }}
                        className={`py-1.5 px-2 rounded-lg font-medium transition-colors ${
                          currentUser.role === 'user'
                            ? 'bg-rose-600 text-white font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        Customer
                      </button>
                      <button
                        onClick={() => {
                          switchUserRole('admin');
                          setIsUserMenuOpen(false);
                          navigate('/admin');
                        }}
                        className={`py-1.5 px-2 rounded-lg font-medium transition-colors ${
                          currentUser.role === 'admin'
                            ? 'bg-rose-600 text-white font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        Cinema Admin
                      </button>
                    </div>
                  </div>

                  {/* Navigation Links inside menu */}
                  <div className="space-y-1 text-xs">
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-rose-400" />
                      <span>My Profile & Watchlist ({watchlist.length})</span>
                    </Link>

                    <Link
                      to="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <Ticket className="w-4 h-4 text-emerald-400" />
                      <span>My Ticket Passes ({userConfirmedBookingsCount})</span>
                    </Link>

                    <Link
                      to="/cinemas"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-amber-400" />
                      <span>Cinemas Portal ({selectedCity})</span>
                    </Link>

                    {currentUser.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-rose-400" />
                        <span>Admin Console & Shows</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleOpenAuth();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-cyan-400" />
                      <span>Sign In / Switch Account</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-600/10 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Reset User Session</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Global Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};
