/**
 * Pure calculation logic for IMovies ticketing, convenience fees, and promotions.
 */

export interface PricingTiers {
  silver: number;
  gold: number;
  platinum: number;
}

export interface SeatItem {
  seatNumber: string;
  category: 'Silver' | 'Gold' | 'Platinum';
}

export interface CouponResult {
  valid: boolean;
  code: string;
  discountAmount: number;
  message: string;
}

export const DEFAULT_PRICING: PricingTiers = {
  silver: 180,
  gold: 280,
  platinum: 420
};

export const CONVENIENCE_FEE_PERCENT = 0.12; // 12% standard ticketing fee incl. GST
export const MAX_SEATS_PER_BOOKING = 8;

/**
 * Calculates raw ticket total based on seat categories
 */
export function calculateSeatTotal(seats: SeatItem[], pricing: PricingTiers = DEFAULT_PRICING): number {
  return seats.reduce((total, seat) => {
    const tier = seat.category.toLowerCase() as keyof PricingTiers;
    const price = pricing[tier] ?? pricing.silver;
    return total + price;
  }, 0);
}

/**
 * Calculates integrated convenience fee with GST
 */
export function calculateConvenienceFee(ticketTotal: number): number {
  if (ticketTotal <= 0) return 0;
  return Math.round(ticketTotal * CONVENIENCE_FEE_PERCENT);
}

/**
 * Evaluates promotional coupons (District / BookMyShow inspired)
 */
export function applyCouponDiscount(code: string, subtotal: number): CouponResult {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, code: '', discountAmount: 0, message: 'Please enter a voucher code.' };
  }

  if (cleanCode === 'DISTRICT50') {
    // 50% discount up to ₹250
    const discount = Math.min(Math.round(subtotal * 0.5), 250);
    return {
      valid: true,
      code: 'DISTRICT50',
      discountAmount: discount,
      message: `District Premiere 50% applied (Saved ₹${discount})!`
    };
  }

  if (cleanCode === 'MOVIE20') {
    // Flat ₹100 off on min order ₹400
    if (subtotal < 400) {
      return {
        valid: false,
        code: 'MOVIE20',
        discountAmount: 0,
        message: 'MOVIE20 requires a minimum booking subtotal of ₹400.'
      };
    }
    return {
      valid: true,
      code: 'MOVIE20',
      discountAmount: 100,
      message: 'Flat ₹100 BookMyShow Special discount applied!'
    };
  }

  if (cleanCode === 'IMAXPASS') {
    const discount = Math.min(Math.round(subtotal * 0.25), 300);
    return {
      valid: true,
      code: 'IMAXPASS',
      discountAmount: discount,
      message: `IMAX Club Pass 25% applied (Saved ₹${discount})!`
    };
  }

  return {
    valid: false,
    code: cleanCode,
    discountAmount: 0,
    message: 'Invalid or expired promotional code.'
  };
}

/**
 * Formats countdown seconds into MM:SS
 */
export function formatCountdownTimer(seconds: number): string {
  const safeSecs = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSecs / 60);
  const remainingSecs = safeSecs % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
}

/**
 * Validates maximum allowable seat selection per transaction
 */
export function canSelectSeat(currentCount: number, maxAllowed = MAX_SEATS_PER_BOOKING): boolean {
  return currentCount < maxAllowed;
}
