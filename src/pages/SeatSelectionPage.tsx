import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCinema } from '../context/CinemaContext';
import { Header } from '../components/Header';
import { SeatMatrix } from '../components/SeatMatrix';
import { SnacksModal } from '../components/SnacksModal';
import { RedNoirBackground } from '../components/RedNoirBackground';
import { formatCountdownTimer } from '../utils/pricing';
import {
  ChevronLeft,
  Clock,
  ShieldAlert,
  ArrowRight,
  Ticket,
  Popcorn,
  Sparkles
} from 'lucide-react';

export const SeatSelectionPage: React.FC = () => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const {
    selectedShow,
    setSelectedShow,
    movies,
    theatres,
    currentUser,
    getSeatsForShow,
    selectedSeats,
    toggleSelectSeat,
    clearSelectedSeats,
    lockSeatsForShow,
    activeLock,
    lockRemainingSeconds,
    foodItems,
    selectedSnacks,
    updateSnackQuantity
  } = useCinema();

  const [errorMessage, setErrorMessage] = useState('');
  const [isSnacksOpen, setIsSnacksOpen] = useState(false);

  // Restore show session on browser reload or direct deep-link
  useEffect(() => {
    if (!selectedShow && showId) {
      if (showId.startsWith('gen_')) {
        const parts = showId.split('_');
        const movieId = parts[1];
        const theaterId = parts[2];
        const date = parts[3];
        const sIndex = parseInt(parts[4] || '0', 10);
        const movieMatch = movies.find((m) => m.id === movieId);
        const theaterMatch = theatres.find((t) => t.id === theaterId) || theatres[0];
        if (movieMatch && theaterMatch) {
          const slots = [
            { time: '10:15 AM', format: '2D', occupancy: 'AVAILABLE' as const },
            { time: '01:30 PM', format: 'Dolby Atmos', occupancy: 'FILLING_FAST' as const },
            { time: '04:45 PM', format: 'IMAX 3D', occupancy: 'AVAILABLE' as const },
            { time: '07:30 PM', format: 'IMAX 3D', occupancy: 'FILLING_FAST' as const },
            { time: '10:45 PM', format: '4DX', occupancy: 'ALMOST_FULL' as const }
          ];
          const slot = slots[sIndex % slots.length] || slots[0];
          setSelectedShow({
            id: showId,
            movieId,
            theaterId: theaterMatch.id,
            theater: theaterMatch,
            screenNumber: (sIndex % 3) + 1,
            screenFormat: slot.format,
            showDate: date || new Date().toISOString().split('T')[0],
            showTime: slot.time,
            pricing: {
              silver: 180 + (sIndex * 20),
              gold: 280 + (sIndex * 30),
              platinum: 420 + (sIndex * 40)
            },
            occupancyStatus: slot.occupancy
          });
        }
      }
    }
  }, [showId, selectedShow, movies, theatres, setSelectedShow]);

  // Fallback to active show or find movie
  const movie = selectedShow ? movies.find((m) => m.id === selectedShow.movieId) : null;
  const currentShow = selectedShow;

  // Fetch seats for this show instance
  const seats = currentShow ? getSeatsForShow(currentShow.id) : [];

  // Calculate ticket subtotal for selected seats
  const ticketSubtotal = selectedSeats.reduce((acc, seatNum) => {
    const s = seats.find((item) => item.seatNumber === seatNum);
    return acc + (s ? s.price : 200);
  }, 0);

  const handleProceed = () => {
    if (!currentShow) return;
    if (selectedSeats.length === 0) {
      setErrorMessage('Please pick at least one seat to proceed.');
      return;
    }

    setErrorMessage('');
    // Lock seats
    const lockResult = lockSeatsForShow(currentShow.id, selectedSeats);
    if (!lockResult.success) {
      setErrorMessage(lockResult.error || 'Seat selection collision. Please select other seats.');
      return;
    }

    // Open gourmet snacks selection modal
    setIsSnacksOpen(true);
  };

  const handleContinueToCheckout = () => {
    setIsSnacksOpen(false);
    navigate('/checkout');
  };

  if (!currentShow || !movie) {
    return (
      <div className="min-h-screen bg-[#080C15] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Show Session Expired</h2>
        <p className="text-xs text-slate-400 mb-6">
          Please select a movie and showtime from the catalog to allocate seats.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
        >
          Browse Cinema Shows
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden flex flex-col pb-32 selection-red">
      <RedNoirBackground />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Breadcrumb & Show Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800/80 pb-4 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/movie/${movie.id}`)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Back to movie details"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white">{movie.title}</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-600/20 text-rose-300 font-bold border border-rose-500/30">
                  {currentShow.screenFormat}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentShow.theater.name} · Screen {currentShow.screenNumber} · {currentShow.showDate} at{' '}
                <strong className="text-slate-200">{currentShow.showTime}</strong>
              </p>
            </div>
          </div>

          {/* 10-Minute Hold Countdown Timer Badge */}
          {lockRemainingSeconds > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold animate-pulse shadow-lg">
              <Clock className="w-4 h-4" />
              <span>Seat Hold Timer: {formatCountdownTimer(lockRemainingSeconds)}</span>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Dynamic Interactive Seat Matrix */}
        <SeatMatrix
          seats={seats}
          selectedSeats={selectedSeats}
          currentUserId={currentUser.id}
          onToggleSeat={toggleSelectSeat}
          pricing={currentShow.pricing}
        />
      </main>

      {/* Floating Bottom Bar (BookMyShow / District Style) */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#090D16]/95 backdrop-blur-md border-t border-slate-800 px-4 sm:px-8 py-4 z-40 shadow-2xl">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  Selected Seats:
                </span>
                <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                  {selectedSeats.join(', ')}
                </span>
                <span className="text-xs text-slate-400">
                  ({selectedSeats.length} {selectedSeats.length === 1 ? 'ticket' : 'tickets'})
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base sm:text-xl font-mono font-black text-emerald-400">
                  ₹{ticketSubtotal}
                </span>
                <span className="text-[10px] text-slate-500">
                  plus convenience fee
                </span>
              </div>
            </div>

            <button
              onClick={handleProceed}
              className="px-6 sm:px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-rose-950/50 hover:shadow-rose-600/40 transition-all transform active:scale-95 flex items-center gap-2"
            >
              <span>Lock Seats & Proceed</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Snacks Selection Modal */}
      <SnacksModal
        isOpen={isSnacksOpen}
        onClose={() => setIsSnacksOpen(false)}
        foodItems={foodItems}
        selectedSnacks={selectedSnacks}
        onUpdateQuantity={updateSnackQuantity}
        onProceedToCheckout={handleContinueToCheckout}
      />
    </div>
  );
};
