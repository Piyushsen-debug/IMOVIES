import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCinema } from '../context/CinemaContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { RedNoirBackground } from '../components/RedNoirBackground';
import { AuthModal } from '../components/AuthModal';
import {
  User as UserIcon,
  Bookmark,
  Ticket,
  Star,
  Clock,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Edit3,
  Trash2,
  Play,
  CheckCircle2,
  ShieldCheck,
  Award
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    updateUserProfile,
    selectedCity,
    setSelectedCity,
    watchlist,
    toggleWatchlist,
    movies,
    bookings,
    reviews,
    switchUserRole
  } = useCinema();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editCity, setEditCity] = useState(selectedCity);
  const [activeTab, setActiveTab] = useState<'watchlist' | 'bookings' | 'reviews'>('watchlist');

  // Watchlist movies
  const watchlistMovies = movies.filter((m) => watchlist.includes(m.id));

  // User bookings
  const userBookings = bookings.filter(
    (b) => b.userId === currentUser.id || b.userEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  // User reviews
  const userReviews = reviews.filter(
    (r) => r.userId === currentUser.id || r.userEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName.trim(),
      phone: editPhone.trim()
    });
    setSelectedCity(editCity);
    setIsEditOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden flex flex-col selection-red">
      <RedNoirBackground />
      <Header onOpenAuth={() => setIsAuthOpen(true)} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Top Breadcrumb & Return to Movies Button */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800"
          >
            <span>← Back to Movies</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
            >
              Switch Account
            </button>
          </div>
        </div>

        {/* Profile Header Hero Card */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white text-2xl font-black shadow-xl border-2 border-white/20 flex-shrink-0">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {currentUser.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    <Award className="w-3 h-3" />
                    {currentUser.loyaltyTier || 'District Black'}
                  </span>
                  {currentUser.role === 'admin' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 border border-rose-500/30 text-rose-300">
                      <ShieldCheck className="w-3 h-3" />
                      Operations Mode
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {currentUser.email}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {currentUser.phone}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedCity}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <button
                onClick={() => {
                  setEditName(currentUser.name);
                  setEditPhone(currentUser.phone);
                  setEditCity(selectedCity);
                  setIsEditOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-2 border border-slate-700"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => switchUserRole(currentUser.role === 'admin' ? 'user' : 'admin')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition border border-slate-800"
              >
                {currentUser.role === 'admin' ? 'Switch to Patron' : 'Switch to Admin'}
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
            <div className="bg-[#090D16] p-3 rounded-2xl border border-slate-800/80 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Watchlist</span>
              <span className="text-xl font-mono font-black text-white">{watchlist.length}</span>
              <span className="text-[10px] text-slate-500 block">saved titles</span>
            </div>

            <div className="bg-[#090D16] p-3 rounded-2xl border border-slate-800/80 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ticket Passes</span>
              <span className="text-xl font-mono font-black text-emerald-400">{userBookings.length}</span>
              <span className="text-[10px] text-slate-500 block">reserved shows</span>
            </div>

            <div className="bg-[#090D16] p-3 rounded-2xl border border-slate-800/80 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Reward Points</span>
              <span className="text-xl font-mono font-black text-amber-400">{currentUser.rewardPoints || 850}</span>
              <span className="text-[10px] text-slate-500 block">District Club pts</span>
            </div>

            <div className="bg-[#090D16] p-3 rounded-2xl border border-slate-800/80 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Reviews Authored</span>
              <span className="text-xl font-mono font-black text-rose-400">{userReviews.length}</span>
              <span className="text-[10px] text-slate-500 block">community reviews</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 mb-8">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'watchlist'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>My Watchlist ({watchlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Ticket Passes & History ({userBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>My Reviews ({userReviews.length})</span>
          </button>
        </div>

        {/* TAB 1: WATCHLIST */}
        {activeTab === 'watchlist' && (
          <div>
            {watchlistMovies.length === 0 ? (
              <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
                <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">Your Watchlist is Empty</h3>
                <p className="text-xs text-slate-400">
                  Save upcoming cinema blockbusters and films you plan to watch. Keep track of showtimes and tickets!
                </p>
                <Link
                  to="/"
                  className="inline-block px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
                >
                  Browse Now Showing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {watchlistMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:border-slate-700 transition"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 right-2.5">
                        <button
                          onClick={() => toggleWatchlist(movie.id)}
                          className="p-2 rounded-full bg-black/70 hover:bg-rose-600 text-white backdrop-blur-md transition cursor-pointer"
                          title="Remove from Watchlist"
                          aria-label={`Remove ${movie.title} from Watchlist`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-amber-400 text-[10px] font-bold font-mono flex items-center gap-1 border border-white/10">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {movie.rating}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-rose-300 text-[10px] font-mono border border-white/10">
                          {movie.censorRating}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
                          {movie.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {movie.genre.join(', ')} · {movie.language.join(', ')}
                        </p>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-slate-800/80">
                        <Link
                          to={`/movie/${movie.id}`}
                          className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold text-center transition"
                        >
                          Book Tickets
                        </Link>
                        <button
                          onClick={() => toggleWatchlist(movie.id)}
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BOOKINGS / PASSES */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">
                All confirmed admission stubs and gate passes under your profile
              </p>
              <Link
                to="/dashboard"
                className="text-xs font-bold text-rose-400 hover:underline"
              >
                Go to Dedicated Passes Portal →
              </Link>
            </div>

            {userBookings.length === 0 ? (
              <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-10 text-center max-w-md mx-auto space-y-3">
                <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-white">No Tickets Booked Yet</h3>
                <p className="text-xs text-slate-400">
                  You haven't made any cinema reservations yet.
                </p>
                <Link
                  to="/"
                  className="inline-block px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
                >
                  Book Your First Show
                </Link>
              </div>
            ) : (
              userBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={b.movie.posterUrl}
                      alt={b.movie.title}
                      className="w-14 h-20 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-rose-500">
                          {b.bookingId}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {b.bookingStatus}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-0.5">{b.movie.title}</h4>
                      <p className="text-xs text-slate-400">
                        {b.show.theater.name} · Screen {b.show.screenNumber}
                      </p>
                      <p className="text-xs text-slate-300 font-mono mt-1">
                        {b.show.showDate} at {b.show.showTime} · Seats:{' '}
                        <strong className="text-white">{b.seats.join(', ')}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
                    <span className="text-sm font-mono font-black text-emerald-400">
                      ₹{b.totalAmount}
                    </span>
                    <Link
                      to="/dashboard"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
                    >
                      View QR Pass
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {userReviews.length === 0 ? (
              <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-10 text-center max-w-md mx-auto space-y-3">
                <Star className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-white">No Reviews Authored</h3>
                <p className="text-xs text-slate-400">
                  Watched a movie recently? Share your thoughts on the movie details page!
                </p>
                <Link
                  to="/"
                  className="inline-block px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
                >
                  Explore Now Showing
                </Link>
              </div>
            ) : (
              userReviews.map((r) => (
                <div key={r.id} className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-slate-800">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold font-mono text-amber-400">{r.rating}/5</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{r.headline}</h4>
                  <p className="text-xs text-slate-300">{r.content}</p>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Update Profile Details</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full bg-[#080C15] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  required
                  className="w-full bg-[#080C15] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Default City</label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  required
                  className="w-full bg-[#080C15] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <Footer />
    </div>
  );
};
