import React, { useState, useRef, useCallback } from 'react';
import { Seat, SeatCategory } from '../types';
import {
  calculateTouchDistance,
  clampZoomScale,
  calculatePinchScale,
  clampPanOffset,
  MIN_ZOOM,
  MAX_ZOOM,
  DEFAULT_ZOOM
} from '../utils/zoomMath';
import { Check, Lock, ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';

interface SeatMatrixProps {
  seats: Seat[];
  selectedSeats: string[];
  currentUserId: string;
  onToggleSeat: (seatNumber: string) => void;
  pricing?: { silver: number; gold: number; platinum: number };
}

export const SeatMatrix: React.FC<SeatMatrixProps> = ({
  seats,
  selectedSeats,
  currentUserId,
  onToggleSeat,
  pricing = { silver: 180, gold: 280, platinum: 420 }
}) => {
  // Zoom and pan state using CSS transformations
  const [scale, setScale] = useState<number>(DEFAULT_ZOOM);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Gesture tracking references
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartDistRef = useRef<number>(0);
  const touchStartScaleRef = useRef<number>(DEFAULT_ZOOM);
  const touchStartPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTapTimeRef = useRef<number>(0);

  const categories: { name: SeatCategory; price: number; label: string }[] = [
    { name: 'Platinum', price: pricing.platinum, label: 'Platinum Recliner' },
    { name: 'Gold', price: pricing.gold, label: 'Gold Club Prime' },
    { name: 'Silver', price: pricing.silver, label: 'Silver Executive' }
  ];

  // Touch Gesture Handlers (Pinch-to-zoom and Pan)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      // Initiate pinch gesture
      const p1 = { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
      const p2 = { clientX: e.touches[1].clientX, clientY: e.touches[1].clientY };
      const dist = calculateTouchDistance(p1, p2);

      touchStartDistRef.current = dist;
      touchStartScaleRef.current = scale;
      touchStartPanRef.current = { ...pan };
      setIsPinching(true);
      setIsDragging(false);
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      const now = Date.now();

      // Double-tap to quickly toggle zoom between 1.0x and 1.6x
      if (now - lastTapTimeRef.current < 300) {
        if (scale > 1.1) {
          setScale(DEFAULT_ZOOM);
          setPan({ x: 0, y: 0 });
        } else {
          setScale(1.6);
        }
        lastTapTimeRef.current = 0;
        return;
      }
      lastTapTimeRef.current = now;

      // Single touch pan when zoomed in
      if (scale > 1.0) {
        touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
        touchStartPanRef.current = { ...pan };
        setIsDragging(true);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && isPinching) {
      // Active two-finger pinch
      const p1 = { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
      const p2 = { clientX: e.touches[1].clientX, clientY: e.touches[1].clientY };
      const currentDist = calculateTouchDistance(p1, p2);

      const nextScale = calculatePinchScale(
        touchStartDistRef.current,
        currentDist,
        touchStartScaleRef.current,
        MIN_ZOOM,
        MAX_ZOOM
      );
      setScale(nextScale);
    } else if (e.touches.length === 1 && isDragging && scale > 1.0) {
      // 1-finger pan while zoomed in
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartPosRef.current.x;
      const deltaY = touch.clientY - touchStartPosRef.current.y;

      const nextPan = clampPanOffset(
        {
          x: touchStartPanRef.current.x + deltaX,
          y: touchStartPanRef.current.y + deltaY
        },
        scale
      );
      setPan(nextPan);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) {
      setIsPinching(false);
    }
    if (e.touches.length === 0) {
      setIsDragging(false);
      // Snap pan back if scale returned to default or below
      if (scale <= 1.0) {
        setPan({ x: 0, y: 0 });
      }
    }
  };

  // Trackpad / Mouse Wheel Zoom Support
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomDelta = e.deltaY * -0.005;
      const nextScale = clampZoomScale(scale + zoomDelta, MIN_ZOOM, MAX_ZOOM);
      setScale(nextScale);
      if (nextScale <= 1.0) {
        setPan({ x: 0, y: 0 });
      }
    }
  };

  // Button Zoom Helpers
  const handleZoomIn = () => {
    setScale((prev) => clampZoomScale(prev + 0.3, MIN_ZOOM, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = clampZoomScale(prev - 0.3, MIN_ZOOM, MAX_ZOOM);
      if (next <= 1.0) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setScale(DEFAULT_ZOOM);
    setPan({ x: 0, y: 0 });
  };

  const getSeatClasses = (seat: Seat) => {
    const isSelected = selectedSeats.includes(seat.seatNumber);
    if (isSelected) {
      return 'bg-emerald-500 text-slate-950 font-extrabold border-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.6)] scale-105';
    }
    if (seat.status === 'BOOKED') {
      return 'bg-slate-950/80 text-slate-700 border-slate-900 cursor-not-allowed opacity-40';
    }
    if (seat.status === 'LOCKED') {
      if (seat.lockedBy === currentUserId) {
        return 'bg-emerald-600/30 text-emerald-300 border-emerald-500/60';
      }
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30 cursor-not-allowed';
    }
    return 'bg-[#0F172A] text-slate-300 border-slate-700 hover:border-rose-500 hover:text-white cursor-pointer hover:bg-slate-800';
  };

  return (
    <div className="w-full flex flex-col items-center select-none relative">
      {/* Zoom Control Toolbar & Mobile Pinch Hint */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <Move className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden sm:inline">Pinch with two fingers to zoom</span>
          <span className="sm:hidden">Pinch to zoom / double-tap</span>
          {scale > 1.0 && (
            <span className="text-emerald-400 font-bold ml-1">
              ({Math.round(scale * 100)}%)
            </span>
          )}
        </div>

        {/* Zoom Action Buttons */}
        <div className="flex items-center gap-1 bg-[#0F172A] border border-slate-800 p-1 rounded-xl shadow-lg">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= MIN_ZOOM}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out Matrix"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="px-2 font-mono text-[11px] font-bold text-slate-200 min-w-[42px] text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= MAX_ZOOM}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Zoom In"
            aria-label="Zoom In Matrix"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {scale !== DEFAULT_ZOOM && (
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors ml-0.5 border-l border-slate-800"
              title="Reset Zoom to 100%"
              aria-label="Reset Matrix Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Pinch-to-Zoom Viewport Container */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onWheel={handleWheel}
        className="w-full overflow-hidden relative touch-none py-2 flex flex-col items-center"
        style={{
          cursor: scale > 1.0 ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }}
      >
        {/* Transformable Inner Matrix Wrapper */}
        <div
          className="w-full flex flex-col items-center will-change-transform"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
            transformOrigin: '50% 15%',
            transition: isPinching || isDragging ? 'none' : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Cinema Screen Curve Indicator */}
          <div className="w-full max-w-2xl mb-8 flex flex-col items-center pointer-events-none">
            <div className="w-4/5 h-2.5 rounded-full bg-gradient-to-r from-transparent via-rose-500 to-transparent screen-glow" />
            <div className="w-3/5 h-5 bg-gradient-to-b from-rose-500/10 to-transparent blur-sm rounded-t-full" />
            <span className="text-[10px] font-bold tracking-[0.25em] text-slate-400 uppercase mt-2 font-mono">
              Screen This Way — All Eyes Front
            </span>
          </div>

          {/* Tiered Rows */}
          <div className="w-full max-w-3xl space-y-7 px-2">
            {categories.map((tier) => {
              const tierSeats = seats.filter((s) => s.category === tier.name);
              if (tierSeats.length === 0) return null;

              const uniqueRows = Array.from(new Set(tierSeats.map((s) => s.row)));

              return (
                <div key={tier.name} className="space-y-3">
                  {/* Tier Header with Price */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5 text-xs">
                    <span className="font-bold text-slate-200 tracking-wide flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      {tier.label}
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      ₹{tier.price}
                    </span>
                  </div>

                  {/* Rows */}
                  <div className="space-y-2">
                    {uniqueRows.map((rowLetter) => {
                      const rowSeats = tierSeats.filter((s) => s.row === rowLetter);

                      return (
                        <div
                          key={rowLetter}
                          className="flex items-center justify-center gap-2 sm:gap-3"
                        >
                          {/* Left Row Label */}
                          <span className="w-5 text-right font-mono text-xs font-bold text-slate-500">
                            {rowLetter}
                          </span>

                          {/* Seats Grid Left Side */}
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            {rowSeats.slice(0, 5).map((seat) => (
                              <button
                                key={seat.seatNumber}
                                disabled={
                                  seat.status === 'BOOKED' ||
                                  (seat.status === 'LOCKED' && seat.lockedBy !== currentUserId)
                                }
                                onClick={() => onToggleSeat(seat.seatNumber)}
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-t-lg rounded-b-sm border text-[11px] font-medium flex items-center justify-center transition-all duration-150 transform active:scale-90 ${getSeatClasses(
                                  seat
                                )}`}
                                title={`Seat ${seat.seatNumber} (${tier.label} - ₹${seat.price})`}
                                aria-label={`Seat ${seat.seatNumber}`}
                              >
                                {selectedSeats.includes(seat.seatNumber) ? (
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                ) : seat.status === 'LOCKED' && seat.lockedBy !== currentUserId ? (
                                  <Lock className="w-2.5 h-2.5" />
                                ) : (
                                  seat.col
                                )}
                              </button>
                            ))}
                          </div>

                          {/* Center Aisle Walkway */}
                          <div className="w-4 sm:w-8" aria-hidden="true" />

                          {/* Seats Grid Right Side */}
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            {rowSeats.slice(5, 10).map((seat) => (
                              <button
                                key={seat.seatNumber}
                                disabled={
                                  seat.status === 'BOOKED' ||
                                  (seat.status === 'LOCKED' && seat.lockedBy !== currentUserId)
                                }
                                onClick={() => onToggleSeat(seat.seatNumber)}
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-t-lg rounded-b-sm border text-[11px] font-medium flex items-center justify-center transition-all duration-150 transform active:scale-90 ${getSeatClasses(
                                  seat
                                )}`}
                                title={`Seat ${seat.seatNumber} (${tier.label} - ₹${seat.price})`}
                                aria-label={`Seat ${seat.seatNumber}`}
                              >
                                {selectedSeats.includes(seat.seatNumber) ? (
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                ) : seat.status === 'LOCKED' && seat.lockedBy !== currentUserId ? (
                                  <Lock className="w-2.5 h-2.5" />
                                ) : (
                                  seat.col
                                )}
                              </button>
                            ))}
                          </div>

                          {/* Right Row Label */}
                          <span className="w-5 text-left font-mono text-xs font-bold text-slate-500">
                            {rowLetter}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-t-md bg-[#0F172A] border border-slate-700" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-t-md bg-emerald-500 border border-emerald-400 text-slate-950 flex items-center justify-center">
            <Check className="w-2.5 h-2.5" />
          </div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-t-md bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
            <Lock className="w-2.5 h-2.5" />
          </div>
          <span>Temporarily Held</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-t-md bg-slate-950 border border-slate-900 opacity-40" />
          <span>Sold Out</span>
        </div>
      </div>
    </div>
  );
};
