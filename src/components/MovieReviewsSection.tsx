import React, { useState } from 'react';
import { useCinema } from '../context/CinemaContext';
import { MovieReview, Movie } from '../types';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
  Trash2,
  AlertTriangle,
  Send,
  Ticket,
  Filter
} from 'lucide-react';

interface MovieReviewsSectionProps {
  movie: Movie;
  onOpenAuth?: () => void;
}

export const MovieReviewsSection: React.FC<MovieReviewsSectionProps> = ({
  movie,
  onOpenAuth
}) => {
  const {
    currentUser,
    reviews,
    addReview,
    deleteReview,
    moderateReview,
    toggleLikeReview,
    hasUserBookedMovie
  } = useCinema();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'verified' | 'top'>('all');

  const movieReviews = reviews.filter((r) => r.movieId === movie.id);
  const isVerifiedBuyer = hasUserBookedMovie(movie.id);

  // Compute distribution & average
  const totalReviews = movieReviews.length;
  const avgRating =
    totalReviews > 0
      ? (movieReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : movie.rating.toFixed(1);

  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  movieReviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating)));
    starCounts[star] = (starCounts[star] || 0) + 1;
  });

  const verifiedReviewsCount = movieReviews.filter((r) => r.isVerifiedBooking).length;

  // Filter reviews
  const filteredReviews = movieReviews.filter((r) => {
    // If not admin, only show APPROVED reviews
    if (currentUser.role !== 'admin' && r.status === 'REJECTED') {
      return false;
    }
    if (activeFilter === 'verified') return r.isVerifiedBooking;
    if (activeFilter === 'top') return r.rating >= 4;
    return true;
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim() || !content.trim()) return;

    setIsSubmitting(true);
    addReview({
      movieId: movie.id,
      rating,
      headline: headline.trim(),
      content: content.trim()
    });

    setSuccessMsg('Your review was successfully published!');
    setHeadline('');
    setContent('');
    setFormOpen(false);
    setIsSubmitting(false);

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <section className="mt-14 border-t border-slate-800/80 pt-10" aria-label="Audience Reviews and Ratings">
      {/* Header and Call to Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>Audience Reviews & Ratings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real spectator feedback and community impressions
          </p>
        </div>

        <button
          onClick={() => setFormOpen(!formOpen)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-rose-950/40 cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{formOpen ? 'Close Review Form' : 'Rate & Write a Review'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Review Submission Form Card */}
      {formOpen && (
        <div className="mb-10 bg-[#0F172A] border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Review {movie.title}</h3>
              <p className="text-xs text-slate-400">
                Share your cinematic experience with fellow movie lovers
              </p>
            </div>
            {isVerifiedBuyer && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                <Ticket className="w-3.5 h-3.5" />
                <span>Verified Ticket Holder</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-5">
            {/* Star Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Your Star Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-600 hover:scale-110 transition-transform cursor-pointer"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-3 text-xs font-mono font-bold text-amber-400">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            {/* Headline */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Headline / One-Line Summary
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Unbelievable visuals in IMAX laser with phenomenal soundtrack"
                required
                className="w-full bg-[#080C15] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Detailed Content */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Detailed Review
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What did you think of the direction, acting, IMAX sound, or storyline? (No major spoilers)"
                required
                className="w-full bg-[#080C15] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Posting as <strong className="text-white">{currentUser.name}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-rose-950/40 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Ratings Metrics & Breakdown Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8">
        {/* Left: Overall Big Score */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-800/80">
          <div className="text-5xl font-black text-white font-mono flex items-baseline gap-1">
            <span>{avgRating}</span>
            <span className="text-lg text-slate-500 font-sans">/5</span>
          </div>

          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  parseFloat(avgRating) >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-slate-400">
            Based on <strong className="text-white">{totalReviews}</strong> user reviews
          </p>

          {verifiedReviewsCount > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              <span>{verifiedReviewsCount} Verified Cinema Attendees</span>
            </div>
          )}
        </div>

        {/* Center: Rating Distribution Bar Chart */}
        <div className="md:col-span-2 space-y-2 flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = starCounts[star] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-10 text-slate-400 font-mono text-right flex items-center justify-end gap-1">
                  <span>{star}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400 inline" />
                </span>

                <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <span className="w-12 text-slate-400 font-mono text-[11px]">
                  {count} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 mb-6 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeFilter === 'all'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            All Reviews ({movieReviews.length})
          </button>
          <button
            onClick={() => setActiveFilter('verified')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeFilter === 'verified'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Verified Viewers ({verifiedReviewsCount})</span>
          </button>
          <button
            onClick={() => setActiveFilter('top')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeFilter === 'top'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            Top Rated (4★+)
          </button>
        </div>

        {currentUser.role === 'admin' && (
          <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Moderation Active
          </span>
        )}
      </div>

      {/* Reviews Cards List */}
      {filteredReviews.length === 0 ? (
        <div className="p-8 text-center bg-[#0F172A]/50 border border-slate-800 rounded-2xl text-slate-400 text-xs">
          No reviews found under the selected filter. Be the first to review {movie.title}!
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => {
            const isLiked = rev.likedBy?.includes(currentUser.id);

            return (
              <div
                key={rev.id}
                className={`p-5 rounded-2xl bg-[#0F172A] border transition-all ${
                  rev.status === 'REJECTED'
                    ? 'border-rose-900/50 opacity-60 bg-rose-950/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
                      {rev.userName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{rev.userName}</span>
                        {rev.isVerifiedBooking && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified Booking
                          </span>
                        )}
                        {rev.status === 'REJECTED' && (
                          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded">
                            Flagged / Rejected
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(rev.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Star Rating Badge */}
                  <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg border border-slate-800 self-start">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold font-mono text-amber-400">
                      {rev.rating}/5
                    </span>
                  </div>
                </div>

                {/* Review Headline & Body */}
                <h4 className="text-sm font-bold text-white mb-1.5">{rev.headline}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{rev.content}</p>

                {/* Footer with Like Button & Admin Controls */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <button
                    onClick={() => toggleLikeReview(rev.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                      isLiked
                        ? 'bg-rose-600/20 border-rose-500/40 text-rose-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful ({rev.likes})</span>
                  </button>

                  {/* Admin Moderation Bar */}
                  {currentUser.role === 'admin' && (
                    <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1.5">
                        Moderate:
                      </span>
                      {rev.status !== 'APPROVED' && (
                        <button
                          onClick={() => moderateReview(rev.id, 'APPROVED')}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                        >
                          Approve
                        </button>
                      )}
                      {rev.status !== 'REJECTED' && (
                        <button
                          onClick={() => moderateReview(rev.id, 'REJECTED')}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => deleteReview(rev.id)}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 flex items-center gap-1"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
