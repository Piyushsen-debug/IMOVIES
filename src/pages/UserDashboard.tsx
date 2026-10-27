import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCinema } from '../context/CinemaContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PerforatedTicketModal } from '../components/PerforatedTicketModal';
import { RedNoirBackground } from '../components/RedNoirBackground';
import { downloadTicketImage } from '../utils/ticketDownloader';
import { Booking } from '../types';
import {
  Ticket,
  Calendar,
  MapPin,
  QrCode,
  Download,
  XCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Film,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Plus
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { bookings, currentUser, cancelBooking, selectedCity, confirmBooking, setSelectedShow, theatres, movies } = useCinema();
  const [selectedBookingForQR, setSelectedBookingForQR] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filter bookings by tab
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'confirmed') return b.bookingStatus === 'CONFIRMED';
    if (activeTab === 'cancelled') return b.bookingStatus === 'CANCELLED';
    return true;
  });

  const handleCancel = (booking: Booking) => {
    if (window.confirm(`Are you sure you want to cancel booking ${booking.bookingId} for ${booking.movie.title}?`)) {
      cancelBooking(booking.bookingId);
    }
  };

  const handleDownload = async (booking: Booking) => {
    setDownloadingId(booking.bookingId);
    try {
      await downloadTicketImage(booking);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden flex flex-col selection-red">
      <RedNoirBackground />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Back Link & Header */}
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800"
          >
            <span>← Back to Movies / Home</span>
          </Link>

          <Link
            to="/cinemas"
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
          >
            Explore Cinemas in {selectedCity} →
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <Ticket className="w-7 h-7 text-rose-500" />
              <span>My Ticket Passes & History</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Official digital admission passes, turnstile QR barcodes, and booking receipts
            </p>
          </div>

          <Link
            to="/"
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-950/40"
          >
            Book More Movies
          </Link>
        </div>

        {/* Filter Tabs */}
        {bookings.length > 0 && (
          <div className="flex items-center gap-2 mb-6 border-b border-slate-800/60 pb-3">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'all'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-[#0F172A] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Passes ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('confirmed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'confirmed'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-[#0F172A] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Active / Confirmed ({bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length})
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'cancelled'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-[#0F172A] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Cancelled / History ({bookings.filter((b) => b.bookingStatus === 'CANCELLED').length})
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredBookings.length === 0 ? (
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-10 sm:p-14 text-center max-w-lg mx-auto shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-3xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto mb-5 shadow-inner">
              <Ticket className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-white">Your Ticket Vault is Clear</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-sm mx-auto">
              No active passes or booking history yet. The silver screen is ready with the latest blockbuster releases in {selectedCity}!
            </p>

            <div className="my-6 p-4 rounded-2xl bg-[#090D16] border border-slate-800 text-left space-y-2 text-xs text-slate-300">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Booking with IMOVIES DISTRICT:
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Instant digital QR turnstile admission stubs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>BookMyShow-style downloadable tickets (PNG / PDF)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Zero paper ticket queues or physical collection required</span>
              </div>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-xl shadow-rose-950/50"
            >
              <Film className="w-4 h-4" />
              <span>Explore Now Showing Movies</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const isConfirmed = booking.bookingStatus === 'CONFIRMED';

              return (
                <div
                  key={booking.id}
                  className={`bg-[#0F172A] border rounded-3xl overflow-hidden shadow-2xl transition-all ${
                    isConfirmed ? 'border-slate-800 hover:border-slate-700' : 'border-slate-900 opacity-60'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-stretch justify-between">
                    {/* Left Stub with Poster & Details */}
                    <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
                      <img
                        src={booking.movie.posterUrl}
                        alt={booking.movie.title}
                        className="w-20 h-28 rounded-2xl object-cover border border-slate-700 flex-shrink-0 shadow-lg"
                      />

                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-500">
                            {booking.bookingId}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isConfirmed
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {booking.bookingStatus}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {booking.show.screenFormat}
                          </span>
                        </div>

                        <h2 className="text-lg font-black text-white">{booking.movie.title}</h2>

                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{booking.show.theater.name}</span>
                          <span aria-hidden="true">·</span>
                          <span>Screen {booking.show.screenNumber}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {booking.show.showDate}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-emerald-400 font-bold">
                            {booking.show.showTime}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            Seats: <strong className="text-white font-mono">{booking.seats.join(', ')}</strong>
                          </span>
                        </div>

                        {booking.snacks.length > 0 && (
                          <div className="text-[11px] text-amber-400/90 pt-1">
                            <span>🍿 F&B: </span>
                            {booking.snacks.map((s) => `${s.quantity}x ${s.item.name}`).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Perforation Line Divider (Desktop) */}
                    <div className="hidden md:flex flex-col justify-between py-3 relative">
                      <div className="-mt-6 w-5 h-5 rounded-full bg-[#080C15] border border-slate-800" />
                      <div className="h-full border-r-2 border-dashed border-slate-800/80 my-2" />
                      <div className="-mb-6 w-5 h-5 rounded-full bg-[#080C15] border border-slate-800" />
                    </div>

                    {/* Right Action / Pass Column */}
                    <div className="p-6 bg-[#090D16]/50 flex flex-col justify-center items-center sm:items-end gap-3 border-t md:border-t-0 border-slate-800/80 min-w-[240px]">
                      <div className="text-center sm:text-right">
                        <span className="text-[10px] text-slate-400 uppercase block font-semibold">Total Paid</span>
                        <span className="text-xl font-mono font-black text-emerald-400">
                          ₹{booking.totalAmount}
                        </span>
                      </div>

                      {isConfirmed ? (
                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => setSelectedBookingForQR(booking)}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                          >
                            <QrCode className="w-4 h-4 text-emerald-400" />
                            <span>View Digital QR</span>
                          </button>

                          <button
                            onClick={() => handleDownload(booking)}
                            disabled={downloadingId === booking.bookingId}
                            className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold transition flex items-center justify-center gap-2 border border-emerald-500/30 cursor-pointer"
                          >
                            <Download className="w-4 h-4 text-emerald-400" />
                            <span>{downloadingId === booking.bookingId ? 'Generating...' : 'Download Ticket'}</span>
                          </button>

                          <button
                            onClick={() => handleCancel(booking)}
                            className="text-[11px] text-rose-400 hover:text-rose-300 transition text-center hover:underline cursor-pointer pt-1"
                          >
                            Cancel Ticket
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">
                          Reservation Voided
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      {/* QR Gate Pass Lightbox */}
      <PerforatedTicketModal
        booking={selectedBookingForQR}
        onClose={() => setSelectedBookingForQR(null)}
      />
    </div>
  );
};
