import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCinema } from '../context/CinemaContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { RedNoirBackground } from '../components/RedNoirBackground';
import {
  DollarSign,
  Ticket,
  Film,
  PlusCircle,
  Calendar,
  Building2,
  Tv,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    adminMetrics,
    movies,
    theatres,
    addMovie,
    addShow,
    bookings
  } = useCinema();

  const [activeTab, setActiveTab] = useState<'overview' | 'addMovie' | 'addShow'>('overview');
  const [successMessage, setSuccessMessage] = useState('');

  // Movie Form State
  const [movieForm, setMovieForm] = useState({
    title: '',
    tagline: '',
    description: '',
    genre: 'Action, Sci-Fi',
    language: 'English, Hindi',
    formats: 'IMAX 3D, Dolby Atmos',
    duration: 150,
    censorRating: 'U/A 16+' as const,
    releaseDate: '2026-11-15',
    rating: 4.8,
    votes: 85000,
    director: 'Christopher Nolan',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w'
  });

  // Show Form State
  const [showForm, setShowForm] = useState({
    movieId: movies[0]?.id || '',
    theaterId: theatres[0]?.id || '',
    screenNumber: 1,
    screenFormat: 'IMAX 3D',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '08:15 PM',
    pricing: {
      silver: 200,
      gold: 320,
      platinum: 480
    }
  });

  const handleCreateMovie = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addMovie({
      ...movieForm,
      genre: movieForm.genre.split(',').map((g) => g.trim()),
      language: movieForm.language.split(',').map((l) => l.trim()),
      formats: movieForm.formats.split(',').map((f) => f.trim()),
      cast: [
        {
          actorName: 'Lead Protagonist',
          roleName: 'Main Role',
          imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
        }
      ]
    });

    setSuccessMessage(`Movie "${created.title}" successfully published to the live cinema catalog!`);
    setTimeout(() => setSuccessMessage(''), 4000);

    // Reset title
    setMovieForm((prev) => ({ ...prev, title: '', description: '', tagline: '' }));
  };

  const handleCreateShow = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addShow({
      movieId: showForm.movieId,
      theaterId: showForm.theaterId,
      showDate: showForm.showDate,
      showTime: showForm.showTime,
      screenNumber: Number(showForm.screenNumber),
      screenFormat: showForm.screenFormat,
      pricing: showForm.pricing
    });

    setSuccessMessage(`New Showtime for ${created.showTime} successfully scheduled!`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden flex flex-col selection-red">
      <RedNoirBackground />
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-500 bg-rose-600/10 px-2 py-0.5 rounded border border-rose-500/20">
                Operations Portal
              </span>
              <span className="text-xs text-slate-400">
                Logged in as {currentUser.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Cinema Admin & Box Office Analytics
            </h1>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex items-center gap-1.5 bg-[#0F172A] p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'overview'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Metrics Overview
            </button>
            <button
              onClick={() => setActiveTab('addMovie')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'addMovie'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Add Movie
            </button>
            <button
              onClick={() => setActiveTab('addShow')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'addShow'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Schedule Showtime
            </button>
          </div>
        </div>

        {/* Global Notification Banner */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Tab 1: Overview & Metrics */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Real-Time Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-[#0F172A] border border-slate-800 p-6 rounded-3xl relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                    Gross Box Office
                  </p>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-emerald-400 mt-2 font-mono">
                  ₹{adminMetrics.totalRevenue.toLocaleString()}
                </h3>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Live ticket ledger sales
                </span>
              </div>

              <div className="bg-[#0F172A] border border-slate-800 p-6 rounded-3xl relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                    Confirmed Tickets
                  </p>
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                    <Ticket className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white mt-2 font-mono">
                  {adminMetrics.ticketsSold}
                </h3>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  Turnstile QR passes generated
                </span>
              </div>

              <div className="bg-[#0F172A] border border-slate-800 p-6 rounded-3xl relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                    Active Shows
                  </p>
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Tv className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white mt-2 font-mono">
                  {adminMetrics.activeShows}
                </h3>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  Across {theatres.length} multiplex halls
                </span>
              </div>

              <div className="bg-[#0F172A] border border-slate-800 p-6 rounded-3xl relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                    Average Occupancy
                  </p>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-amber-400 mt-2 font-mono">
                  {adminMetrics.occupancyRate}%
                </h3>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  Prime weekend occupancy
                </span>
              </div>
            </div>

            {/* Recent Ticket Issuances Ledger */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-rose-500" />
                <span>Recent Booking Transactions & QR Passes</span>
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono">
                      <th className="pb-3">Booking ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Movie</th>
                      <th className="pb-3">Hall & Timing</th>
                      <th className="pb-3">Seats</th>
                      <th className="pb-3">Paid Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-900/40">
                        <td className="py-3 font-mono font-bold text-rose-400">
                          {b.bookingId}
                        </td>
                        <td className="py-3 text-slate-200">
                          <div>{b.userName}</div>
                          <div className="text-[10px] text-slate-400">{b.userPhone}</div>
                        </td>
                        <td className="py-3 text-white font-medium">
                          {b.movie.title}
                        </td>
                        <td className="py-3 text-slate-300">
                          {b.show.theater.chain} · {b.show.showTime}
                        </td>
                        <td className="py-3 font-mono text-emerald-400 font-bold">
                          {b.seats.join(', ')}
                        </td>
                        <td className="py-3 font-mono font-bold text-white">
                          ₹{b.totalAmount}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              b.bookingStatus === 'CONFIRMED'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {b.bookingStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Add New Movie Form */}
        {activeTab === 'addMovie' && (
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Film className="w-5 h-5 text-rose-500" />
              <span>Publish New Theatrical Movie Release</span>
            </h2>

            <form onSubmit={handleCreateMovie} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">
                    Movie Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={movieForm.title}
                    onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                    placeholder="e.g. Avatar: Fire and Ash"
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">
                    Tagline / Subheading
                  </label>
                  <input
                    type="text"
                    value={movieForm.tagline}
                    onChange={(e) => setMovieForm({ ...movieForm, tagline: e.target.value })}
                    placeholder="e.g. Return to Pandora"
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">
                  Synopsis / Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  placeholder="Plot summary for ticket buyers..."
                  className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">
                    Genres (comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={movieForm.genre}
                    onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">
                    Languages (comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={movieForm.language}
                    onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">
                    Formats (comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={movieForm.formats}
                    onChange={(e) => setMovieForm({ ...movieForm, formats: e.target.value })}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    required
                    value={movieForm.duration}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: Number(e.target.value) })}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">
                    Director
                  </label>
                  <input
                    type="text"
                    required
                    value={movieForm.director}
                    onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">
                    Censor Rating
                  </label>
                  <select
                    value={movieForm.censorRating}
                    onChange={(e) => setMovieForm({ ...movieForm, censorRating: e.target.value as any })}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="U">U (Universal)</option>
                    <option value="U/A 13+">U/A 13+</option>
                    <option value="U/A 16+">U/A 16+</option>
                    <option value="A">A (Adults Only)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">
                    Poster Image URL (2:3 Aspect) *
                  </label>
                  <input
                    type="url"
                    required
                    value={movieForm.posterUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">
                    Backdrop Banner URL (16:9 Aspect) *
                  </label>
                  <input
                    type="url"
                    required
                    value={movieForm.bannerUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, bannerUrl: e.target.value })}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-lg shadow-rose-950/40 flex items-center gap-2 cursor-pointer mt-4"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish to Public Catalog</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Schedule New Show */}
        {activeTab === 'addShow' && (
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-500" />
              <span>Schedule New Movie Showtime Slot</span>
            </h2>

            <form onSubmit={handleCreateShow} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">
                    Select Movie *
                  </label>
                  <select
                    required
                    value={showForm.movieId}
                    onChange={(e) => setShowForm({ ...showForm, movieId: e.target.value })}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  >
                    {movies.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title} ({m.language.join(', ')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">
                    Select Cinema Multiplex *
                  </label>
                  <select
                    required
                    value={showForm.theaterId}
                    onChange={(e) => setShowForm({ ...showForm, theaterId: e.target.value })}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  >
                    {theatres.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">
                    Show Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={showForm.showDate}
                    onChange={(e) => setShowForm({ ...showForm, showDate: e.target.value })}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">
                    Showtime Slot (e.g. 09:30 PM) *
                  </label>
                  <input
                    type="text"
                    required
                    value={showForm.showTime}
                    onChange={(e) => setShowForm({ ...showForm, showTime: e.target.value })}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">
                    Screen Number
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    required
                    value={showForm.screenNumber}
                    onChange={(e) => setShowForm({ ...showForm, screenNumber: Number(e.target.value) })}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">
                    Screen Format
                  </label>
                  <select
                    value={showForm.screenFormat}
                    onChange={(e) => setShowForm({ ...showForm, screenFormat: e.target.value })}
                    className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="IMAX 3D">IMAX 3D</option>
                    <option value="4DX">4DX Dynamic</option>
                    <option value="Dolby Atmos">Dolby Atmos</option>
                    <option value="2D">Standard 2D</option>
                  </select>
                </div>
              </div>

              {/* Tier Pricing */}
              <div>
                <label className="block font-semibold text-slate-400 mb-2">
                  Tiered Seat Pricing (₹)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Silver Executive</span>
                    <input
                      type="number"
                      value={showForm.pricing.silver}
                      onChange={(e) =>
                        setShowForm({
                          ...showForm,
                          pricing: { ...showForm.pricing, silver: Number(e.target.value) }
                        })
                      }
                      className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Gold Club</span>
                    <input
                      type="number"
                      value={showForm.pricing.gold}
                      onChange={(e) =>
                        setShowForm({
                          ...showForm,
                          pricing: { ...showForm.pricing, gold: Number(e.target.value) }
                        })
                      }
                      className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Platinum Recliner</span>
                    <input
                      type="number"
                      value={showForm.pricing.platinum}
                      onChange={(e) =>
                        setShowForm({
                          ...showForm,
                          pricing: { ...showForm.pricing, platinum: Number(e.target.value) }
                        })
                      }
                      className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-lg shadow-rose-950/40 flex items-center gap-2 cursor-pointer mt-4"
              >
                <Calendar className="w-4 h-4" />
                <span>Deploy Showtime to Multiplex</span>
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
