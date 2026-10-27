import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Movie,
  Theatre,
  Show,
  Seat,
  Booking,
  FoodItem,
  SnackOrderItem,
  AdminMetrics,
  SeatCategory,
  MovieReview
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_MOVIES,
  INITIAL_THEATRES,
  INITIAL_FOOD_ITEMS,
  INITIAL_REVIEWS
} from '../data/mockData';
import { generateTicketQR } from '../utils/qrGenerator';

interface CinemaContextType {
  // Auth & City
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchUserRole: (role: 'user' | 'admin') => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  login: (email: string, pass?: string) => boolean;
  registerUser: (data: { name: string; email: string; phone: string; password?: string }) => User;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;

  // Watchlist
  watchlist: string[];
  toggleWatchlist: (movieId: string) => void;
  isInWatchlist: (movieId: string) => boolean;

  // Catalog
  movies: Movie[];
  theatres: Theatre[];
  foodItems: FoodItem[];
  addMovie: (movie: Omit<Movie, 'id'>) => Movie;
  addShow: (showData: {
    movieId: string;
    theaterId: string;
    showDate: string;
    showTime: string;
    screenNumber: number;
    screenFormat: string;
    pricing: { silver: number; gold: number; platinum: number };
  }) => Show;

  // Reviews & Ratings
  reviews: MovieReview[];
  addReview: (review: {
    movieId: string;
    rating: number;
    headline: string;
    content: string;
  }) => MovieReview;
  deleteReview: (reviewId: string) => void;
  moderateReview: (reviewId: string, status: 'APPROVED' | 'PENDING' | 'REJECTED') => void;
  toggleLikeReview: (reviewId: string) => void;
  getReviewsForMovie: (movieId: string) => MovieReview[];
  hasUserBookedMovie: (movieId: string) => boolean;

  // Shows & Seats
  getShowsForMovieAndDate: (movieId: string, date: string, city?: string) => Show[];
  getSeatsForShow: (showId: string) => Seat[];
  lockSeatsForShow: (showId: string, seatNumbers: string[]) => { success: boolean; error?: string };
  releaseSeatsForShow: (showId: string, seatNumbers: string[]) => void;
  activeLock: {
    showId: string;
    seats: string[];
    expiresAt: number;
  } | null;
  lockRemainingSeconds: number;

  // Booking Flow
  selectedShow: Show | null;
  setSelectedShow: (show: Show | null) => void;
  selectedSeats: string[];
  toggleSelectSeat: (seatNumber: string) => void;
  clearSelectedSeats: () => void;
  selectedSnacks: SnackOrderItem[];
  updateSnackQuantity: (item: FoodItem, delta: number) => void;
  clearSnacks: () => void;
  confirmBooking: (params: {
    paymentMethod: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING';
    couponCode?: string;
    discountAmount: number;
  }) => Promise<Booking>;

  // User & Admin Bookings
  bookings: Booking[];
  cancelBooking: (bookingId: string) => boolean;
  adminMetrics: AdminMetrics;
}

const CinemaContext = createContext<CinemaContextType | undefined>(undefined);

const SEAT_HOLD_DURATION_SECONDS = 10 * 60; // 10 minutes hold

export const CinemaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. User State
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('imovies_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [selectedCity, setSelectedCity] = useState<string>(() => {
    return localStorage.getItem('imovies_city') || 'Mumbai';
  });

  // 2. Movies & Theatres
  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('imovies_movies_v2');
    return saved ? JSON.parse(saved) : INITIAL_MOVIES;
  });

  const [theatres] = useState<Theatre[]>(INITIAL_THEATRES);
  const [foodItems] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);

  // 3. Custom / Created Shows
  const [customShows, setCustomShows] = useState<Show[]>(() => {
    const saved = localStorage.getItem('imovies_custom_shows');
    return saved ? JSON.parse(saved) : [];
  });

  // 4. Seats State per show (stored as map { [showId_seatNumber]: Seat })
  const [seatsState, setSeatsState] = useState<Record<string, { status: 'AVAILABLE' | 'LOCKED' | 'BOOKED'; lockedBy?: string; lockExpiresAt?: number }>>(() => {
    const saved = localStorage.getItem('imovies_seats_state');
    return saved ? JSON.parse(saved) : {};
  });

  // 5. Active Hold Timer
  const [activeLock, setActiveLock] = useState<{
    showId: string;
    seats: string[];
    expiresAt: number;
  } | null>(() => {
    const saved = localStorage.getItem('imovies_active_lock');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.expiresAt > Date.now()) {
        return parsed;
      }
    }
    return null;
  });

  const [lockRemainingSeconds, setLockRemainingSeconds] = useState<number>(0);

  // 6. Active Booking in progress
  const [selectedShow, setSelectedShow] = useState<Show | null>(() => {
    const saved = localStorage.getItem('imovies_selected_show');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedSnacks, setSelectedSnacks] = useState<SnackOrderItem[]>([]);

  // 7. Bookings
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('imovies_bookings');
    if (saved) {
      return JSON.parse(saved);
    }
    // Initial sample confirmed booking for realistic portfolio presentation
    const today = new Date().toISOString().split('T')[0];
    const initialBooking: Booking = {
      id: 'bk_sample_1',
      bookingId: 'IMOV-92X7KA',
      userId: INITIAL_USERS[0].id,
      userName: INITIAL_USERS[0].name,
      userEmail: INITIAL_USERS[0].email,
      userPhone: INITIAL_USERS[0].phone,
      show: {
        id: 'show_dune_sample',
        movieId: 'mov_dune2',
        theaterId: 'th_pvr_palladium',
        theater: INITIAL_THEATRES[0],
        screenNumber: 1,
        screenFormat: 'IMAX 3D',
        showDate: today,
        showTime: '07:30 PM',
        pricing: { silver: 180, gold: 280, platinum: 420 },
        occupancyStatus: 'FILLING_FAST'
      },
      movie: INITIAL_MOVIES[0],
      seats: ['A4', 'A5'],
      seatDetails: [
        { seatNumber: 'A4', category: 'Platinum', price: 420 },
        { seatNumber: 'A5', category: 'Platinum', price: 420 }
      ],
      snacks: [
        { item: INITIAL_FOOD_ITEMS[0], quantity: 1 }
      ],
      ticketSubtotal: 840,
      convenienceFee: 101,
      snacksSubtotal: 240,
      discountAmount: 100,
      couponCode: 'MOVIE20',
      totalAmount: 1081,
      bookingStatus: 'CONFIRMED',
      paymentMethod: 'UPI',
      transactionId: 'TXN-984210982X',
      qrCodeDataUrl: '',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    };
    return [initialBooking];
  });

  // 8. Reviews State
  const [reviews, setReviews] = useState<MovieReview[]>(() => {
    const saved = localStorage.getItem('imovies_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // 9. Watchlist State (tied to currentUser.id)
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(`imovies_watchlist_${currentUser.id}`);
    if (saved) return JSON.parse(saved);
    return currentUser.watchlist || ['mov_dune2', 'mov_interstellar'];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('imovies_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('imovies_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(`imovies_watchlist_${currentUser.id}`, JSON.stringify(watchlist));
  }, [watchlist, currentUser.id]);

  useEffect(() => {
    const saved = localStorage.getItem(`imovies_watchlist_${currentUser.id}`);
    if (saved) {
      setWatchlist(JSON.parse(saved));
    } else {
      setWatchlist(currentUser.watchlist || []);
    }
  }, [currentUser.id]);

  useEffect(() => {
    localStorage.setItem('imovies_city', selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    localStorage.setItem('imovies_movies_v2', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('imovies_custom_shows', JSON.stringify(customShows));
  }, [customShows]);

  useEffect(() => {
    localStorage.setItem('imovies_seats_state', JSON.stringify(seatsState));
  }, [seatsState]);

  useEffect(() => {
    localStorage.setItem('imovies_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (activeLock) {
      localStorage.setItem('imovies_active_lock', JSON.stringify(activeLock));
    } else {
      localStorage.removeItem('imovies_active_lock');
    }
  }, [activeLock]);

  useEffect(() => {
    if (selectedShow) {
      localStorage.setItem('imovies_selected_show', JSON.stringify(selectedShow));
    } else {
      localStorage.removeItem('imovies_selected_show');
    }
  }, [selectedShow]);

  // Lock countdown timer
  useEffect(() => {
    if (!activeLock) {
      setLockRemainingSeconds(0);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((activeLock.expiresAt - now) / 1000));
      setLockRemainingSeconds(diff);

      if (diff <= 0) {
        // Expired! Release seats
        const updatedSeats = { ...seatsState };
        activeLock.seats.forEach((seatNum) => {
          const key = `${activeLock.showId}_${seatNum}`;
          if (updatedSeats[key]?.status === 'LOCKED' && updatedSeats[key]?.lockedBy === currentUser.id) {
            delete updatedSeats[key];
          }
        });
        setSeatsState(updatedSeats);
        setActiveLock(null);
        setSelectedSeats([]);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeLock, seatsState, currentUser.id]);

  // Seed sample QR for initial booking if empty
  useEffect(() => {
    const seedInitialQR = async () => {
      if (bookings.length > 0 && !bookings[0].qrCodeDataUrl) {
        const qr = await generateTicketQR({
          bookingId: bookings[0].bookingId,
          movieTitle: bookings[0].movie.title,
          theaterName: bookings[0].show.theater.name,
          showDate: bookings[0].show.showDate,
          showTime: bookings[0].show.showTime,
          seats: bookings[0].seats,
          totalAmount: bookings[0].totalAmount,
          userName: bookings[0].userName,
          timestamp: bookings[0].createdAt
        });
        setBookings((prev) => [{ ...prev[0], qrCodeDataUrl: qr }, ...prev.slice(1)]);
      }
    };
    seedInitialQR();
  }, []);

  // Switch Role
  const switchUserRole = (role: 'user' | 'admin') => {
    const target = role === 'admin' ? INITIAL_USERS[1] : INITIAL_USERS[0];
    setCurrentUser(target);
  };

  const login = (email: string) => {
    const match = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (match) {
      setCurrentUser(match);
      return true;
    }
    // Create new session user
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      phone: '+91 99000 88776',
      role: email.includes('admin') ? 'admin' : 'user',
      memberSince: 'Today',
      loyaltyTier: 'Silver',
      rewardPoints: 100,
      watchlist: []
    };
    setCurrentUser(newUser);
    return true;
  };

  const registerUser = (data: { name: string; email: string; phone: string; password?: string }): User => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'user',
      memberSince: 'Today',
      loyaltyTier: 'Silver',
      rewardPoints: 150,
      watchlist: []
    };
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(INITIAL_USERS[0]);
  };

  const updateUserProfile = (data: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...data }));
  };

  const toggleWatchlist = (movieId: string) => {
    setWatchlist((prev) => {
      if (prev.includes(movieId)) {
        return prev.filter((id) => id !== movieId);
      } else {
        return [...prev, movieId];
      }
    });
  };

  const isInWatchlist = (movieId: string) => watchlist.includes(movieId);

  const hasUserBookedMovie = (movieId: string): boolean => {
    return bookings.some(
      (b) =>
        b.movie.id === movieId &&
        (b.userId === currentUser.id || b.userEmail.toLowerCase() === currentUser.email.toLowerCase()) &&
        b.bookingStatus === 'CONFIRMED'
    );
  };

  const addReview = (reviewData: {
    movieId: string;
    rating: number;
    headline: string;
    content: string;
  }): MovieReview => {
    const isVerified = hasUserBookedMovie(reviewData.movieId);
    const newRev: MovieReview = {
      id: `rev_${Date.now()}`,
      movieId: reviewData.movieId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      rating: reviewData.rating,
      headline: reviewData.headline,
      content: reviewData.content,
      isVerifiedBooking: isVerified,
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
      status: 'APPROVED' // Pre-approved, admin can moderate
    };
    setReviews((prev) => [newRev, ...prev]);
    return newRev;
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const moderateReview = (reviewId: string, status: 'APPROVED' | 'PENDING' | 'REJECTED') => {
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, status } : r)));
  };

  const toggleLikeReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        const alreadyLiked = r.likedBy?.includes(currentUser.id);
        const newLikes = alreadyLiked ? Math.max(0, r.likes - 1) : r.likes + 1;
        const newLikedBy = alreadyLiked
          ? (r.likedBy || []).filter((id) => id !== currentUser.id)
          : [...(r.likedBy || []), currentUser.id];
        return { ...r, likes: newLikes, likedBy: newLikedBy };
      })
    );
  };

  const getReviewsForMovie = (movieId: string): MovieReview[] => {
    return reviews.filter((r) => r.movieId === movieId);
  };

  // Add Movie
  const addMovie = (movieData: Omit<Movie, 'id'>): Movie => {
    const newMovie: Movie = {
      ...movieData,
      id: `mov_${Date.now()}`
    };
    setMovies((prev) => [newMovie, ...prev]);
    return newMovie;
  };

  // Add Show
  const addShow = (showData: {
    movieId: string;
    theaterId: string;
    showDate: string;
    showTime: string;
    screenNumber: number;
    screenFormat: string;
    pricing: { silver: number; gold: number; platinum: number };
  }): Show => {
    const theater = theatres.find((t) => t.id === showData.theaterId) || theatres[0];
    const newShow: Show = {
      id: `show_${Date.now()}`,
      movieId: showData.movieId,
      theaterId: showData.theaterId,
      theater,
      screenNumber: showData.screenNumber,
      screenFormat: showData.screenFormat,
      showDate: showData.showDate,
      showTime: showData.showTime,
      pricing: showData.pricing,
      occupancyStatus: 'AVAILABLE'
    };
    setCustomShows((prev) => [newShow, ...prev]);
    return newShow;
  };

  // Generate dynamic shows for any movie & date based on city
  const getShowsForMovieAndDate = (movieId: string, date: string, city: string = selectedCity): Show[] => {
    const relevantTheaters = theatres.filter((t) => t.city.toLowerCase() === city.toLowerCase());
    const matchedCustom = customShows.filter(
      (s) => s.movieId === movieId && s.showDate === date && s.theater.city.toLowerCase() === city.toLowerCase()
    );

    // Standard showtime schedule slots
    const slots = [
      { time: '10:15 AM', format: '2D', occupancy: 'AVAILABLE' as const },
      { time: '01:30 PM', format: 'Dolby Atmos', occupancy: 'FILLING_FAST' as const },
      { time: '04:45 PM', format: 'IMAX 3D', occupancy: 'AVAILABLE' as const },
      { time: '07:30 PM', format: 'IMAX 3D', occupancy: 'FILLING_FAST' as const },
      { time: '10:45 PM', format: '4DX', occupancy: 'ALMOST_FULL' as const }
    ];

    const generated: Show[] = [];
    const theatersToUse = relevantTheaters.length > 0 ? relevantTheaters : theatres.slice(0, 2);

    theatersToUse.forEach((theater, tIndex) => {
      // Pick 2-3 show slots for each theater
      const theaterSlots = slots.slice(tIndex % 2, 4 + (tIndex % 2));
      theaterSlots.forEach((slot, sIndex) => {
        const showId = `gen_${movieId}_${theater.id}_${date}_${sIndex}`;
        // check if custom already has it
        if (!matchedCustom.some((c) => c.id === showId)) {
          generated.push({
            id: showId,
            movieId,
            theaterId: theater.id,
            theater,
            screenNumber: (sIndex % 3) + 1,
            screenFormat: slot.format,
            showDate: date,
            showTime: slot.time,
            pricing: {
              silver: 180 + (sIndex * 20),
              gold: 280 + (sIndex * 30),
              platinum: 420 + (sIndex * 40)
            },
            occupancyStatus: slot.occupancy
          });
        }
      });
    });

    return [...matchedCustom, ...generated];
  };

  // Generate 60 seats (A-F, 1-10) for a show with persistent state
  const getSeatsForShow = (showId: string): Seat[] => {
    const seats: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const now = Date.now();

    // Default pre-booked coordinates for realistic cinema look
    const prebookedMock = ['B3', 'B4', 'C5', 'C6', 'D7', 'D8', 'E2'];

    rows.forEach((row, rIndex) => {
      let category: SeatCategory = 'Silver';
      let price = 180;
      if (rIndex < 2) {
        category = 'Platinum';
        price = 420;
      } else if (rIndex < 4) {
        category = 'Gold';
        price = 280;
      }

      for (let col = 1; col <= 10; col++) {
        const seatNumber = `${row}${col}`;
        const key = `${showId}_${seatNumber}`;
        const state = seatsState[key];

        let status: 'AVAILABLE' | 'LOCKED' | 'BOOKED' = 'AVAILABLE';
        let lockedBy: string | null = null;

        if (state) {
          if (state.status === 'BOOKED') {
            status = 'BOOKED';
          } else if (state.status === 'LOCKED') {
            if (state.lockExpiresAt && state.lockExpiresAt > now) {
              status = 'LOCKED';
              lockedBy = state.lockedBy || null;
            } else {
              // Lazy release expired lock
              status = 'AVAILABLE';
            }
          }
        } else if (prebookedMock.includes(seatNumber)) {
          // Pre-booked baseline
          status = 'BOOKED';
        }

        seats.push({
          seatNumber,
          row,
          col,
          category,
          status,
          price,
          lockedBy
        });
      }
    });

    return seats;
  };

  // Lock seats for 10 minutes
  const lockSeatsForShow = (showId: string, seatNumbers: string[]) => {
    const now = Date.now();
    const expiresAt = now + SEAT_HOLD_DURATION_SECONDS * 1000;

    // Verify all seats are available or held by current user
    for (const seatNum of seatNumbers) {
      const key = `${showId}_${seatNum}`;
      const existing = seatsState[key];
      if (existing) {
        if (existing.status === 'BOOKED') {
          return { success: false, error: `Seat ${seatNum} is already booked by another patron.` };
        }
        if (existing.status === 'LOCKED' && existing.lockedBy !== currentUser.id && existing.lockExpiresAt && existing.lockExpiresAt > now) {
          return { success: false, error: `Seat ${seatNum} is temporarily on hold for another guest.` };
        }
      }
    }

    // Apply lock
    const updated = { ...seatsState };
    seatNumbers.forEach((seatNum) => {
      updated[`${showId}_${seatNum}`] = {
        status: 'LOCKED',
        lockedBy: currentUser.id,
        lockExpiresAt: expiresAt
      };
    });

    setSeatsState(updated);
    setActiveLock({
      showId,
      seats: seatNumbers,
      expiresAt
    });

    return { success: true };
  };

  const releaseSeatsForShow = (showId: string, seatNumbers: string[]) => {
    const updated = { ...seatsState };
    seatNumbers.forEach((seatNum) => {
      delete updated[`${showId}_${seatNum}`];
    });
    setSeatsState(updated);
    if (activeLock && activeLock.showId === showId) {
      setActiveLock(null);
    }
  };

  // Selected seats toggling
  const toggleSelectSeat = (seatNumber: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      } else {
        if (prev.length >= 8) {
          alert('Maximum of 8 seats allowed per single transaction.');
          return prev;
        }
        return [...prev, seatNumber];
      }
    });
  };

  const clearSelectedSeats = () => {
    setSelectedSeats([]);
  };

  // F&B Snacks Cart
  const updateSnackQuantity = (item: FoodItem, delta: number) => {
    setSelectedSnacks((prev) => {
      const existing = prev.find((s) => s.item.id === item.id);
      if (!existing && delta > 0) {
        return [...prev, { item, quantity: delta }];
      }
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter((s) => s.item.id !== item.id);
        }
        return prev.map((s) => (s.item.id === item.id ? { ...s, quantity: newQty } : s));
      }
      return prev;
    });
  };

  const clearSnacks = () => {
    setSelectedSnacks([]);
  };

  // Confirm Booking
  const confirmBooking = async ({
    paymentMethod,
    couponCode,
    discountAmount
  }: {
    paymentMethod: 'UPI' | 'CREDIT_CARD' | 'NET_BANKING';
    couponCode?: string;
    discountAmount: number;
  }): Promise<Booking> => {
    if (!selectedShow) throw new Error('No active show selected');

    const showSeats = getSeatsForShow(selectedShow.id);
    const chosenSeats = showSeats.filter((s) => selectedSeats.includes(s.seatNumber));

    const ticketSubtotal = chosenSeats.reduce((acc, s) => acc + s.price, 0);
    const convenienceFee = Math.round(ticketSubtotal * 0.12);
    const snacksSubtotal = selectedSnacks.reduce((acc, s) => acc + s.item.price * s.quantity, 0);
    const totalAmount = Math.max(0, ticketSubtotal + convenienceFee + snacksSubtotal - discountAmount);

    const bookingId = `IMOV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const transactionId = `TXN-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const createdAt = new Date().toISOString();

    const movie = movies.find((m) => m.id === selectedShow.movieId) || INITIAL_MOVIES[0];

    // Generate real scannable QR
    const qrDataUrl = await generateTicketQR({
      bookingId,
      movieTitle: movie.title,
      theaterName: selectedShow.theater.name,
      showDate: selectedShow.showDate,
      showTime: selectedShow.showTime,
      seats: selectedSeats,
      totalAmount,
      userName: currentUser.name,
      timestamp: createdAt
    });

    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      bookingId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhone: currentUser.phone,
      show: selectedShow,
      movie,
      seats: selectedSeats,
      seatDetails: chosenSeats.map((s) => ({
        seatNumber: s.seatNumber,
        category: s.category,
        price: s.price
      })),
      snacks: selectedSnacks,
      ticketSubtotal,
      convenienceFee,
      snacksSubtotal,
      discountAmount,
      couponCode,
      totalAmount,
      bookingStatus: 'CONFIRMED',
      paymentMethod,
      transactionId,
      qrCodeDataUrl: qrDataUrl,
      createdAt
    };

    // Mark seats as permanently BOOKED
    const updatedSeats = { ...seatsState };
    selectedSeats.forEach((seatNum) => {
      updatedSeats[`${selectedShow.id}_${seatNum}`] = {
        status: 'BOOKED'
      };
    });

    setSeatsState(updatedSeats);
    setBookings((prev) => [newBooking, ...prev]);

    // Reset hold session
    setActiveLock(null);
    setSelectedSeats([]);
    setSelectedSnacks([]);

    return newBooking;
  };

  // Cancel Booking
  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.bookingId === bookingId);
    if (!booking) return false;

    // Release seats
    const updatedSeats = { ...seatsState };
    booking.seats.forEach((seatNum) => {
      delete updatedSeats[`${booking.show.id}_${seatNum}`];
    });
    setSeatsState(updatedSeats);

    setBookings((prev) =>
      prev.map((b) => (b.bookingId === bookingId ? { ...b, bookingStatus: 'CANCELLED' } : b))
    );
    return true;
  };

  // Compute Admin Metrics
  const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'CONFIRMED');
  const totalRevenue = confirmedBookings.reduce((acc, b) => acc + b.totalAmount, 0);
  const ticketsSold = confirmedBookings.reduce((acc, b) => acc + b.seats.length, 0);
  const activeShows = 12 + customShows.length;
  const occupancyRate = Math.min(94, Math.round((ticketsSold / (activeShows * 60)) * 100) + 42);

  const adminMetrics: AdminMetrics = {
    totalRevenue,
    ticketsSold,
    activeShows,
    occupancyRate
  };

  return (
    <CinemaContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUserRole,
        selectedCity,
        setSelectedCity,
        login,
        registerUser,
        logout,
        updateUserProfile,
        watchlist,
        toggleWatchlist,
        isInWatchlist,
        movies,
        theatres,
        foodItems,
        addMovie,
        addShow,
        reviews,
        addReview,
        deleteReview,
        moderateReview,
        toggleLikeReview,
        getReviewsForMovie,
        hasUserBookedMovie,
        getShowsForMovieAndDate,
        getSeatsForShow,
        lockSeatsForShow,
        releaseSeatsForShow,
        activeLock,
        lockRemainingSeconds,
        selectedShow,
        setSelectedShow,
        selectedSeats,
        toggleSelectSeat,
        clearSelectedSeats,
        selectedSnacks,
        updateSnackQuantity,
        clearSnacks,
        confirmBooking,
        bookings,
        cancelBooking,
        adminMetrics
      }}
    >
      {children}
    </CinemaContext.Provider>
  );
};

export const useCinema = () => {
  const context = useContext(CinemaContext);
  if (!context) {
    throw new Error('useCinema must be used within a CinemaProvider');
  }
  return context;
};
