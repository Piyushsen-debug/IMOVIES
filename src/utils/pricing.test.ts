import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSeatTotal,
  calculateConvenienceFee,
  applyCouponDiscount,
  formatCountdownTimer,
  canSelectSeat,
  type SeatItem,
  type PricingTiers
} from './pricing';

test('calculateSeatTotal calculates correct prices across tiers', () => {
  const seats: SeatItem[] = [
    { seatNumber: 'A1', category: 'Platinum' },
    { seatNumber: 'A2', category: 'Platinum' },
    { seatNumber: 'C1', category: 'Gold' },
    { seatNumber: 'E1', category: 'Silver' }
  ];

  const pricing: PricingTiers = {
    silver: 150,
    gold: 250,
    platinum: 400
  };

  // 400 + 400 + 250 + 150 = 1200
  assert.equal(calculateSeatTotal(seats, pricing), 1200);
});

test('calculateConvenienceFee applies 12% rounded', () => {
  assert.equal(calculateConvenienceFee(1000), 120);
  assert.equal(calculateConvenienceFee(550), 66);
  assert.equal(calculateConvenienceFee(0), 0);
});

test('applyCouponDiscount validates codes and limits discounts properly', () => {
  // DISTRICT50 capped at 250
  const d50 = applyCouponDiscount('DISTRICT50', 800);
  assert.equal(d50.valid, true);
  assert.equal(d50.discountAmount, 250);

  // MOVIE20 min order 400 check
  const m20Low = applyCouponDiscount('MOVIE20', 300);
  assert.equal(m20Low.valid, false);

  const m20Pass = applyCouponDiscount('MOVIE20', 500);
  assert.equal(m20Pass.valid, true);
  assert.equal(m20Pass.discountAmount, 100);

  // Invalid code
  const invalid = applyCouponDiscount('RANDOMCODE', 500);
  assert.equal(invalid.valid, false);
});

test('formatCountdownTimer formats seconds correctly', () => {
  assert.equal(formatCountdownTimer(600), '10:00');
  assert.equal(formatCountdownTimer(75), '01:15');
  assert.equal(formatCountdownTimer(9), '00:09');
  assert.equal(formatCountdownTimer(0), '00:00');
  assert.equal(formatCountdownTimer(-5), '00:00');
});

test('canSelectSeat enforces max seats limit', () => {
  assert.equal(canSelectSeat(7), true);
  assert.equal(canSelectSeat(8), false);
  assert.equal(canSelectSeat(9), false);
});
