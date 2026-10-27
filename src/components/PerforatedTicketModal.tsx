import React, { useState } from 'react';
import { Booking } from '../types';
import { CheckCircle2, Download, X, Calendar, MapPin, Film, Ticket, Share2 } from 'lucide-react';
import { downloadTicketImage } from '../utils/ticketDownloader';

interface PerforatedTicketModalProps {
  booking: Booking | null;
  onClose: () => void;
  onViewDashboard?: () => void;
}

export const PerforatedTicketModal: React.FC<PerforatedTicketModalProps> = ({
  booking,
  onClose,
  onViewDashboard
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  if (!booking) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadTicketImage(booking);
    } catch (err) {
      console.error(err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 rounded-full bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          aria-label="Close ticket view"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Banner */}
        <div className="bg-gradient-to-r from-emerald-600/20 via-emerald-500/10 to-transparent p-6 pb-4 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Booking Confirmed!</h2>
              <p className="text-xs text-slate-400">
                Your seats are locked and your gate pass is ready.
              </p>
            </div>
          </div>
        </div>

        {/* Perforated Cinema Ticket Body */}
        <div className="p-6">
          <div className="relative bg-[#090D16] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Left/Right Notch Cutouts for Realistic Perforation */}
            <div className="relative p-5 space-y-4">
              {/* Header inside stub */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-500 block mb-0.5">
                    Official Cinema Admission Pass
                  </span>
                  <h3 className="text-xl font-black text-white">{booking.movie.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="font-semibold text-rose-400">{booking.show.screenFormat}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-300">{booking.movie.censorRating}</span>
                    <span aria-hidden="true">·</span>
                    <span>{booking.show.theater.chain}</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">
                    Booking ID
                  </span>
                  <span className="text-sm font-mono font-black text-white tracking-wider">
                    {booking.bookingId}
                  </span>
                </div>
              </div>

              {/* Theater & Time coordinates */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                    Cinema Hall
                  </span>
                  <p className="font-bold text-slate-200 line-clamp-1">
                    {booking.show.theater.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Screen {booking.show.screenNumber}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">
                    Showtime & Date
                  </span>
                  <p className="font-bold text-slate-200">
                    {booking.show.showDate}
                  </p>
                  <p className="text-[11px] font-mono text-emerald-400 font-bold">
                    {booking.show.showTime}
                  </p>
                </div>
              </div>

              {/* Seats Badge Area */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                    Allocated Seats ({booking.seats.length})
                  </span>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {booking.seats.map((seat) => (
                      <span
                        key={seat}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                    Total Paid
                  </span>
                  <span className="text-base font-mono font-black text-emerald-400">
                    ₹{booking.totalAmount}
                  </span>
                </div>
              </div>

              {/* F&B inclusion if any */}
              {booking.snacks.length > 0 && (
                <div className="text-[11px] text-slate-400 bg-slate-900/40 p-2 rounded-lg border border-slate-800/60">
                  <span className="font-semibold text-amber-400">F&B Included: </span>
                  {booking.snacks.map((s) => `${s.quantity}x ${s.item.name}`).join(', ')}
                </div>
              )}
            </div>

            {/* Perforation Line with Side Notches */}
            <div className="relative py-2 flex items-center">
              <div className="absolute -left-3.5 w-7 h-7 rounded-full bg-[#0F172A] border border-slate-800 shadow-inner" />
              <div className="w-full border-t-2 border-dashed border-slate-700/80 mx-4" />
              <div className="absolute -right-3.5 w-7 h-7 rounded-full bg-[#0F172A] border border-slate-800 shadow-inner" />
            </div>

            {/* Bottom QR Section */}
            <div className="p-5 flex flex-col items-center text-center bg-slate-950/40">
              <div className="p-3 bg-white rounded-2xl shadow-2xl flex items-center justify-center border-4 border-slate-800">
                {booking.qrCodeDataUrl ? (
                  <img
                    src={booking.qrCodeDataUrl}
                    alt={`Turnstile Entry Pass for ${booking.bookingId}`}
                    className="w-44 h-44 object-contain"
                  />
                ) : (
                  <div className="w-44 h-44 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                    Generating Digital QR...
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-400 mt-3 font-mono">
                Scan at turnstile gate for direct auditorium entry
              </p>
              <span className="text-[10px] text-slate-400 mt-0.5">
                Pass issued to {booking.userName} · Valid on show date only
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex gap-3">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{isDownloading ? 'Generating...' : 'Download Ticket (PNG)'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onViewDashboard?.();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>View All Bookings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
