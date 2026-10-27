import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCinema } from '../context/CinemaContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PerforatedTicketModal } from '../components/PerforatedTicketModal';
import { RedNoirBackground } from '../components/RedNoirBackground';
import {
  calculateSeatTotal,
  calculateConvenienceFee,
  applyCouponDiscount
} from '../utils/pricing';
import QRCode from 'qrcode';
import { downloadTicketImage } from '../utils/ticketDownloader';
import { Booking } from '../types';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Tag,
  Check,
  ChevronLeft,
  Lock,
  Popcorn,
  Ticket,
  AlertCircle,
  CheckCircle2,
  Download,
  Calendar,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedShow,
    movies,
    selectedSeats,
    selectedSnacks,
    getSeatsForShow,
    confirmBooking
  } = useCinema();

  const [step, setStep] = useState<'review' | 'payment_portal' | 'tickets_booked'>('review');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CREDIT_CARD' | 'NET_BANKING'>('UPI');
  const [upiId, setUpiId] = useState('patron@okhdfcbank');
  const [upiQrUrl, setUpiQrUrl] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins
  const [isDownloading, setIsDownloading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; message: string } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const currentShow = selectedShow || confirmedBooking?.show || null;
  const movie = (selectedShow ? movies.find((m) => m.id === selectedShow.movieId) : null) || confirmedBooking?.movie || null;

  if (step !== 'tickets_booked' && (!currentShow || !movie || (!confirmedBooking && selectedSeats.length === 0))) {
    return (
      <div className="min-h-screen bg-[#080C15] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">No Active Booking Session</h2>
        <p className="text-xs text-slate-400 mb-6">
          Your reservation session may have expired or no seats were allocated.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
        >
          Return to Cinema Shows
        </Link>
      </div>
    );
  }

  // Calculate pricing (with fallbacks if confirmedBooking is active)
  const seats = currentShow ? getSeatsForShow(currentShow.id) : [];
  const chosenSeats = seats.filter((s) => selectedSeats.includes(s.seatNumber));
  const rawTicketSubtotal = chosenSeats.reduce((acc, s) => acc + s.price, 0);
  const convenienceFee = calculateConvenienceFee(rawTicketSubtotal);
  const snacksSubtotal = selectedSnacks.reduce((acc, s) => acc + s.item.price * s.quantity, 0);
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalPayable = Math.max(0, rawTicketSubtotal + convenienceFee + snacksSubtotal - discountAmount);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    setCouponError('');

    const res = applyCouponDiscount(code, rawTicketSubtotal + snacksSubtotal);
    if (res.valid) {
      setAppliedCoupon({
        code: res.code,
        discount: res.discountAmount,
        message: res.message
      });
      setCouponCode(res.code);
    } else {
      setAppliedCoupon(null);
      setCouponError(res.message);
    }
  };

  // Generate UPI QR Code when entering payment_portal
  useEffect(() => {
    if (step === 'payment_portal') {
      const upiUri = `upi://pay?pa=district.cinema@icici&pn=IMOVIES_DISTRICT&am=${totalPayable}&cu=INR&tn=IMOVIES-TICKET-${Date.now().toString().slice(-6)}`;
      QRCode.toDataURL(upiUri, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 280,
        color: {
          dark: '#080C15',
          light: '#FFFFFF'
        }
      })
        .then((url) => setUpiQrUrl(url))
        .catch((err) => console.error('Failed to generate UPI QR:', err));
    }
  }, [step, totalPayable]);

  // Payment countdown timer
  useEffect(() => {
    if (step !== 'payment_portal') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleExecutePayment = async () => {
    setIsProcessing(true);
    try {
      const booking = await confirmBooking({
        paymentMethod,
        couponCode: appliedCoupon?.code,
        discountAmount
      });
      setConfirmedBooking(booking);
      setStep('tickets_booked');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      alert(err?.message || 'Payment execution failed. Please retry.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTicket = async () => {
    if (!confirmedBooking) return;
    setIsDownloading(true);
    try {
      await downloadTicketImage(confirmedBooking);
    } catch (err) {
      console.error('Download ticket error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // -------------------------------------------------------------
  // VIEW 3: TICKETS BOOKED! GREENISH THEME SUCCESS SCREEN
  // -------------------------------------------------------------
  if (step === 'tickets_booked' && confirmedBooking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#041d13] via-[#03140d] to-black text-white relative overflow-x-hidden flex flex-col selection-emerald">
        {/* Radiant Emerald Glow */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />
        <Header />

        <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          {/* Animated Celebration Banner */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400/50 text-emerald-400 shadow-2xl shadow-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 block">
                ● TRANSACTION COMPLETED & VERIFIED
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Tickets Booked!
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200/80 max-w-md mx-auto">
                Your admission passes have been successfully generated and filed in your ticket passes vault.
              </p>
            </div>
          </div>

          {/* BookMyShow Style Digital Ticket Card */}
          <div className="bg-[#0A1612] border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl relative mb-8">
            {/* Top Emerald Header */}
            <div className="bg-emerald-950/60 p-6 border-b border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                  Official Admission Gate Pass
                </span>
                <h2 className="text-2xl font-black text-white">{confirmedBooking.movie.title}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                  <span className="font-semibold text-emerald-400">{confirmedBooking.show.screenFormat}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-slate-300">{confirmedBooking.movie.censorRating}</span>
                  <span aria-hidden="true">·</span>
                  <span>{confirmedBooking.show.theater.chain}</span>
                </div>
              </div>

              <div className="text-left sm:text-right flex-shrink-0">
                <span className="text-[10px] uppercase font-mono text-emerald-400/80 block">
                  Booking ID
                </span>
                <span className="text-base font-mono font-black text-white tracking-wider">
                  {confirmedBooking.bookingId}
                </span>
              </div>
            </div>

            {/* Middle Coordinates */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#06110D] p-4 rounded-2xl border border-emerald-500/20">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                    Cinema Hall & Audi
                  </span>
                  <p className="font-bold text-white text-sm line-clamp-1">
                    {confirmedBooking.show.theater.name}
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Screen {confirmedBooking.show.screenNumber} ({confirmedBooking.show.screenFormat})
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                    Showtime & Date
                  </span>
                  <p className="font-bold text-white text-sm">
                    {confirmedBooking.show.showDate}
                  </p>
                  <p className="text-xs font-mono text-emerald-400 font-bold mt-0.5">
                    {confirmedBooking.show.showTime}
                  </p>
                </div>
              </div>

              {/* Allocated Seats Box */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#06110D] border border-emerald-500/20">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                    Seats Allocated ({confirmedBooking.seats.length})
                  </span>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {confirmedBooking.seats.map((seat) => (
                      <span
                        key={seat}
                        className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-black"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                    Total Amount Paid
                  </span>
                  <span className="text-xl font-mono font-black text-emerald-400">
                    ₹{confirmedBooking.totalAmount}
                  </span>
                </div>
              </div>

              {confirmedBooking.snacks.length > 0 && (
                <div className="p-3 rounded-xl bg-[#06110D] border border-emerald-500/20 text-xs text-slate-300">
                  <span className="font-bold text-amber-400">🍿 F&B Included: </span>
                  {confirmedBooking.snacks.map((s) => `${s.quantity}x ${s.item.name}`).join(', ')}
                </div>
              )}
            </div>

            {/* Perforation Divider */}
            <div className="relative py-2 flex items-center">
              <div className="absolute -left-4 w-8 h-8 rounded-full bg-[#041d13] border border-emerald-500/30" />
              <div className="w-full border-t-2 border-dashed border-emerald-500/40 mx-4" />
              <div className="absolute -right-4 w-8 h-8 rounded-full bg-[#041d13] border border-emerald-500/30" />
            </div>

            {/* QR Turnstile Scanner Section */}
            <div className="p-6 text-center bg-[#05140E] flex flex-col items-center">
              <div className="p-3 bg-white rounded-2xl shadow-2xl border-4 border-emerald-500/40 inline-block mb-3">
                {confirmedBooking.qrCodeDataUrl ? (
                  <img
                    src={confirmedBooking.qrCodeDataUrl}
                    alt={`Turnstile Entry QR for ${confirmedBooking.bookingId}`}
                    className="w-48 h-48 object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 bg-slate-100 flex items-center justify-center text-slate-500 text-xs">
                    Generating Digital QR...
                  </div>
                )}
              </div>

              <p className="text-xs font-bold text-emerald-300">
                Direct Entry to Audi via this M-Ticket QR
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                Scan at cinema turnstile gates · Valid on show date only
              </p>
              <span className="text-[10px] text-slate-400 mt-1">
                Passholder: {confirmedBooking.userName} · Ref: {confirmedBooking.transactionId}
              </span>
            </div>
          </div>

          {/* Action Buttons: Download Ticket (BookMyShow style) & Passes */}
          <div className="space-y-3">
            <button
              onClick={handleDownloadTicket}
              disabled={isDownloading}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generating Ticket...' : 'Download Official Ticket (PNG / Image)'}</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="py-3 px-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ticket className="w-4 h-4 text-emerald-400" />
                <span>View in Passes Vault</span>
              </button>

              <button
                onClick={() => navigate('/')}
                className="py-3 px-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Back to Movies</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: INTERACTIVE UPI PAYMENT PORTAL (QR + "PAYMENT DONE")
  // -------------------------------------------------------------
  if (step === 'payment_portal') {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-x-hidden flex flex-col selection-red">
        <RedNoirBackground />
        <Header />

        <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 border-b border-slate-800/80 pb-4">
            <button
              onClick={() => setStep('review')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Order Review</span>
            </button>

            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Expires in {formatTimer(timeLeft)}</span>
            </span>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-500 block mb-1">
                Unified Payments Interface (UPI)
              </span>
              <h2 className="text-2xl font-black text-white">Scan QR to Pay</h2>
              <p className="text-xs text-slate-400 mt-1">
                Scan with any UPI application (GPay, PhonePe, Paytm, BHIM, Cred)
              </p>
            </div>

            {/* Payable Amount Highlight */}
            <div className="bg-[#080C15] p-3.5 rounded-2xl border border-slate-800 inline-block px-8">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Total Amount Payable
              </span>
              <span className="text-3xl font-mono font-black text-emerald-400">
                ₹{totalPayable}
              </span>
            </div>

            {/* Scannable UPI QR Code Frame */}
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-3xl shadow-2xl border-4 border-slate-800 inline-block relative group">
                {upiQrUrl ? (
                  <img
                    src={upiQrUrl}
                    alt="Scan UPI QR Code"
                    className="w-56 h-56 object-contain"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-slate-500 text-xs">
                    Generating UPI QR...
                  </div>
                )}
                {/* Center UPI Mini Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-0.5 rounded shadow text-[10px] font-black text-black border border-slate-300">
                  UPI
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                <span>UPI ID: <strong className="text-white font-mono">district.cinema@icici</strong></span>
              </div>
            </div>

            {/* Supported App Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'Cred'].map((app) => (
                <span
                  key={app}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300"
                >
                  {app}
                </span>
              ))}
            </div>

            {/* Big Green "Payment Done" Button */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <button
                onClick={handleExecutePayment}
                disabled={isProcessing}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{isProcessing ? 'Verifying Payment...' : 'Payment Done'}</span>
              </button>
              <p className="text-[11px] text-slate-400">
                Click <strong>"Payment Done"</strong> once you have approved the payment on your UPI app.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 1: ORDER REVIEW
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden flex flex-col selection-red">
      <RedNoirBackground />
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(`/seats/${currentShow.id}`)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Back to seat selection"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Order Review & Secure Checkout
            </h1>
            <p className="text-xs text-slate-400">
              Complete your reservation for {movie.title}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Payment Gateways & Promo Codes (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Promo Code Voucher Section */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-white">
                <Tag className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold">Apply Cinema Voucher / Promo Code</h3>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    if (couponError) setCouponError('');
                  }}
                  placeholder="Enter code (e.g. DISTRICT50 or MOVIE20)"
                  className="flex-1 bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={() => handleApplyCoupon()}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {/* Quick voucher suggestion buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-400">Popular:</span>
                <button
                  type="button"
                  onClick={() => handleApplyCoupon('DISTRICT50')}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-rose-600/10 border border-rose-500/30 text-rose-300 hover:bg-rose-600/20 font-bold transition-colors cursor-pointer"
                >
                  DISTRICT50 (50% Off)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyCoupon('MOVIE20')}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-600/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/20 font-bold transition-colors cursor-pointer"
                >
                  MOVIE20 (₹100 Off)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyCoupon('IMAXPASS')}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-amber-600/10 border border-amber-500/30 text-amber-300 hover:bg-amber-600/20 font-bold transition-colors cursor-pointer"
                >
                  IMAXPASS (25% Off)
                </button>
              </div>

              {appliedCoupon && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{appliedCoupon.message}</span>
                  </div>
                  <button
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponCode('');
                    }}
                    className="text-[10px] text-slate-400 hover:text-white underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{couponError}</span>
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-rose-500" />
                <span>Select Payment Gateway</span>
              </h3>

              <div className="space-y-3">
                {/* Instant UPI */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 ${
                    paymentMethod === 'UPI'
                      ? 'bg-slate-900 border-rose-500 shadow-md shadow-rose-950/30'
                      : 'bg-[#090D16] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">
                          Instant UPI / QR Pass
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Google Pay, PhonePe, Paytm, CRED
                        </p>
                      </div>
                    </div>
                    {paymentMethod === 'UPI' && (
                      <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center text-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div className="pt-2 border-t border-slate-800/80 flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="flex-1 bg-[#090D16] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                      />
                      <span className="text-[11px] text-emerald-400 self-center font-mono">
                        Verified VPA
                      </span>
                    </div>
                  )}
                </div>

                {/* Credit / Debit Card */}
                <div
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 ${
                    paymentMethod === 'CREDIT_CARD'
                      ? 'bg-slate-900 border-rose-500 shadow-md shadow-rose-950/30'
                      : 'bg-[#090D16] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">
                          Credit or Debit Card
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Visa, MasterCard, RuPay, Amex
                        </p>
                      </div>
                    </div>
                    {paymentMethod === 'CREDIT_CARD' && (
                      <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center text-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {paymentMethod === 'CREDIT_CARD' && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
                      <input
                        type="text"
                        defaultValue="4111 2222 3333 4444"
                        placeholder="Card Number"
                        className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-rose-500"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          defaultValue="12/28"
                          placeholder="MM/YY"
                          className="bg-[#090D16] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-rose-500"
                        />
                        <input
                          type="password"
                          defaultValue="892"
                          placeholder="CVV"
                          className="bg-[#090D16] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Net Banking */}
                <div
                  onClick={() => setPaymentMethod('NET_BANKING')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'NET_BANKING'
                      ? 'bg-slate-900 border-rose-500 shadow-md shadow-rose-950/30'
                      : 'bg-[#090D16] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Net Banking</p>
                      <p className="text-[11px] text-slate-400">
                        HDFC, ICICI, SBI, Axis, Kotak
                      </p>
                    </div>
                  </div>
                  {paymentMethod === 'NET_BANKING' && (
                    <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Pay Action CTA Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep('payment_portal');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-rose-950/50 hover:shadow-rose-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Payment (₹{totalPayable})</span>
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 mt-3">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>256-Bit Bank Grade Encryption · Instant UPI QR & Card Gateways</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Perforated Order Summary Stub (5 cols) */}
          <div className="lg:col-span-5 bg-[#0F172A] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-emerald-400" />
                <span>Booking Summary</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {currentShow.screenFormat}
              </span>
            </div>

            {/* Movie Info */}
            <div className="flex gap-3">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-16 h-22 rounded-xl object-cover flex-shrink-0 border border-slate-700"
              />
              <div className="space-y-1">
                <h3 className="text-base font-black text-white line-clamp-1">
                  {movie.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {currentShow.theater.name}
                </p>
                <p className="text-[11px] text-slate-400">
                  Screen {currentShow.screenNumber} · {currentShow.showDate} at{' '}
                  <strong className="text-emerald-400 font-mono">{currentShow.showTime}</strong>
                </p>
              </div>
            </div>

            {/* Reserved Seats List */}
            <div className="bg-[#090D16] p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Reserved Seats:</span>
                <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                  {selectedSeats.join(', ')}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Ticket Tier:</span>
                <span className="text-slate-300">
                  {chosenSeats[0]?.category || 'Standard'} Section
                </span>
              </div>
            </div>

            {/* F&B Items if any */}
            {selectedSnacks.length > 0 && (
              <div className="bg-[#090D16] p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                  <Popcorn className="w-3.5 h-3.5" />
                  <span>Gourmet Cinema Refreshments</span>
                </div>
                {selectedSnacks.map((s) => (
                  <div
                    key={s.item.id}
                    className="flex items-center justify-between text-[11px] text-slate-300"
                  >
                    <span>
                      {s.quantity}x {s.item.name}
                    </span>
                    <span className="font-mono">₹{s.item.price * s.quantity}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Detailed Price Breakdown */}
            <div className="space-y-2 text-xs border-t border-slate-800/80 pt-4">
              <div className="flex justify-between text-slate-400">
                <span>Tickets Subtotal ({selectedSeats.length})</span>
                <span className="font-mono text-slate-200">₹{rawTicketSubtotal}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Integrated Convenience Fee (12% incl. GST)</span>
                <span className="font-mono text-slate-200">₹{convenienceFee}</span>
              </div>
              {snacksSubtotal > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Food & Beverage Refreshments</span>
                  <span className="font-mono text-slate-200">₹{snacksSubtotal}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Voucher Discount ({appliedCoupon?.code})</span>
                  <span className="font-mono">-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-base font-black text-white pt-3 border-t border-slate-800">
                <span>Total Payable</span>
                <span className="text-xl font-mono text-emerald-400">
                  ₹{totalPayable}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Confirmation Digital Perforated Pass Modal with Base64 QR Code */}
      <PerforatedTicketModal
        booking={confirmedBooking}
        onClose={() => {
          setConfirmedBooking(null);
          navigate('/dashboard');
        }}
        onViewDashboard={() => navigate('/dashboard')}
      />
    </div>
  );
};
