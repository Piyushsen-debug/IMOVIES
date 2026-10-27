import test from 'node:test';
import assert from 'node:assert/strict';

interface TestReview {
  id: string;
  rating: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  isVerifiedBooking: boolean;
}

function calculateAverageRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

function filterVisibleReviews(
  reviews: TestReview[],
  isAdmin: boolean,
  filter: 'all' | 'verified' | 'top'
): TestReview[] {
  return reviews.filter((r) => {
    if (!isAdmin && r.status === 'REJECTED') return false;
    if (filter === 'verified') return r.isVerifiedBooking;
    if (filter === 'top') return r.rating >= 4;
    return true;
  });
}

test('calculateAverageRating computes correct 1-decimal average', () => {
  const reviews = [{ rating: 5 }, { rating: 4 }, { rating: 5 }];
  assert.equal(calculateAverageRating(reviews), 4.7);
});

test('calculateAverageRating handles empty list gracefully', () => {
  assert.equal(calculateAverageRating([]), 0);
});

test('filterVisibleReviews hides rejected reviews for non-admin users', () => {
  const reviews: TestReview[] = [
    { id: '1', rating: 5, status: 'APPROVED', isVerifiedBooking: true },
    { id: '2', rating: 1, status: 'REJECTED', isVerifiedBooking: false },
    { id: '3', rating: 4, status: 'APPROVED', isVerifiedBooking: false }
  ];

  const visibleToUser = filterVisibleReviews(reviews, false, 'all');
  assert.equal(visibleToUser.length, 2);
  assert.equal(visibleToUser.some((r) => r.id === '2'), false);

  const visibleToAdmin = filterVisibleReviews(reviews, true, 'all');
  assert.equal(visibleToAdmin.length, 3);
});

test('filterVisibleReviews filters verified bookings only', () => {
  const reviews: TestReview[] = [
    { id: '1', rating: 5, status: 'APPROVED', isVerifiedBooking: true },
    { id: '2', rating: 4, status: 'APPROVED', isVerifiedBooking: false }
  ];

  const verified = filterVisibleReviews(reviews, false, 'verified');
  assert.equal(verified.length, 1);
  assert.equal(verified[0].id, '1');
});
