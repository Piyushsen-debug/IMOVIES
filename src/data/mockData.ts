import { Movie, Theatre, FoodItem, User, MovieReview } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_default',
    name: 'Piyush Sen',
    email: 'piyush292sen1234567@gmail.com',
    phone: '+91 98765 43210',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    watchlist: ['mov_dune2', 'mov_interstellar'],
    memberSince: 'March 2023',
    loyaltyTier: 'District Black',
    rewardPoints: 850
  },
  {
    id: 'usr_admin',
    name: 'Vikram Roy (Cinema Director)',
    email: 'admin@imovies.in',
    phone: '+91 98200 11223',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    watchlist: ['mov_oppenheimer'],
    memberSince: 'January 2022',
    loyaltyTier: 'District Black',
    rewardPoints: 3400
  }
];

export const CITIES = [
  'Mumbai',
  'Delhi-NCR',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Narsinghpur',
];

export const INITIAL_MOVIES: Movie[] = [
  {
    id: "mov_dune2",
    title: "Dune: Part Two",
    tagline: "Long live the fighters.",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
    genre: ["Sci-Fi", "Adventure", "Action"],
    language: ["English", "Hindi", "Tamil"],
    formats: ["IMAX 3D", "4DX", "Dolby Atmos", "2D"],
    duration: 166,
    censorRating: "U/A 16+",
    releaseDate: "2024-03-01",
    rating: 4.9,
    votes: 184500,
    featured: true,
    director: "Denis Villeneuve",
    posterUrl: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg",
    trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w",
    cast: [
      { actorName: "Timothée Chalamet", roleName: "Paul Atreides" },
      { actorName: "Zendaya", roleName: "Chani" },
      { actorName: "Rebecca Ferguson", roleName: "Lady Jessica" },
      { actorName: "Austin Butler", roleName: "Feyd-Rautha Harkonnen" },
      { actorName: "Florence Pugh", roleName: "Princess Irulan" },
      { actorName: "Javier Bardem", roleName: "Stilgar" },
      { actorName: "Josh Brolin", roleName: "Gurney Halleck" },
      { actorName: "Dave Bautista", roleName: "Glossu Rabban" }
    ]
  },
  {
    id: "mov_kalki",
    title: "Kalki 2898 AD",
    tagline: "The future begins now.",
    description: "Set in a post-apocalyptic dystopian city of Kasi in the year 2898 AD, a modern avatar of Vishnu is believed to have descended upon Earth to shield humanity from malevolent tyrant Supreme Yaskin.",
    genre: ["Sci-Fi", "Action", "Mythology"],
    language: ["Telugu", "Hindi", "Tamil", "English"],
    formats: ["IMAX 3D", "3D", "Dolby Atmos"],
    duration: 181,
    censorRating: "U/A 16+",
    releaseDate: "2024-06-27",
    rating: 4.8,
    votes: 215000,
    featured: true,
    director: "Nag Ashwin",
    posterUrl: "https://image.tmdb.org/t/p/w780/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/w1280/p5ozvmdgsmbWe0H8Xk7Rc8SCwAB.jpg",
    trailerUrl: "https://www.youtube.com/embed/kQDd1AhGIHk",
    cast: [
      { actorName: "Prabhas", roleName: "Bhairava" },
      { actorName: "Amitabh Bachchan", roleName: "Ashwatthama" },
      { actorName: "Deepika Padukone", roleName: "SUM-80" },
      { actorName: "Kamal Haasan", roleName: "Supreme Yaskin" },
      { actorName: "Disha Patani", roleName: "Roxie" },
      { actorName: "Saswata Chatterjee", roleName: "Commander Manas" }
    ]
  },
  {
    id: "mov_oppenheimer",
    title: "Oppenheimer",
    tagline: "The world changes forever.",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during the Manhattan Project, exploring the moral and political aftermath.",
    genre: ["Biography", "Drama", "History"],
    language: ["English", "Hindi"],
    formats: ["IMAX 70mm", "Dolby Atmos", "2D"],
    duration: 180,
    censorRating: "A",
    releaseDate: "2023-07-21",
    rating: 4.9,
    votes: 320000,
    director: "Christopher Nolan",
    posterUrl: "https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
    trailerUrl: "https://www.youtube.com/embed/uYPbbksJxIg",
    cast: [
      { actorName: "Cillian Murphy", roleName: "J. Robert Oppenheimer" },
      { actorName: "Emily Blunt", roleName: "Katherine Oppenheimer" },
      { actorName: "Matt Damon", roleName: "Leslie Groves" },
      { actorName: "Robert Downey Jr.", roleName: "Lewis Strauss" },
      { actorName: "Florence Pugh", roleName: "Jean Tatlock" },
      { actorName: "Josh Hartnett", roleName: "Ernest Lawrence" }
    ]
  },
  {
    id: "mov_deadpool",
    title: "Deadpool & Wolverine",
    tagline: "Everyone deserves a happy ending.",
    description: "Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool. They team up to defeat a common enemy in the Marvel Cinematic Universe.",
    genre: ["Action", "Comedy", "Sci-Fi"],
    language: ["English", "Hindi", "Telugu"],
    formats: ["4DX", "3D", "IMAX 3D", "2D"],
    duration: 128,
    censorRating: "A",
    releaseDate: "2024-07-26",
    rating: 4.7,
    votes: 198000,
    director: "Shawn Levy",
    posterUrl: "https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
    trailerUrl: "https://www.youtube.com/embed/73_1biulkYk",
    cast: [
      { actorName: "Ryan Reynolds", roleName: "Wade Wilson / Deadpool" },
      { actorName: "Hugh Jackman", roleName: "Logan / Wolverine" },
      { actorName: "Emma Corrin", roleName: "Cassandra Nova" },
      { actorName: "Matthew Macfadyen", roleName: "Mr. Paradox" },
      { actorName: "Dafne Keen", roleName: "Laura / X-23" },
      { actorName: "Morena Baccarin", roleName: "Vanessa" }
    ]
  },
  {
    id: "mov_interstellar",
    title: "Interstellar: 10th Anniversary",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    genre: ["Sci-Fi", "Drama", "Adventure"],
    language: ["English"],
    formats: ["IMAX 70mm", "Dolby Atmos"],
    duration: 169,
    censorRating: "U/A 13+",
    releaseDate: "2014-11-07",
    rating: 5.0,
    votes: 450000,
    director: "Christopher Nolan",
    posterUrl: "https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
    cast: [
      { actorName: "Matthew McConaughey", roleName: "Joseph Cooper" },
      { actorName: "Anne Hathaway", roleName: "Dr. Amelia Brand" },
      { actorName: "Jessica Chastain", roleName: "Murphy Cooper" },
      { actorName: "Michael Caine", roleName: "Professor John Brand" },
      { actorName: "Matt Damon", roleName: "Dr. Mann" },
      { actorName: "Mackenzie Foy", roleName: "Young Murph" }
    ]
  },
  {
    id: "mov_stree2",
    title: "Stree 2: Sarkate Ka Aatank",
    tagline: "Aatank wapas aa raha hai.",
    description: "The town of Chanderi is being haunted again. This time, an evil headless entity known as Sarkata abducts progressive women, and Vicky and his gang reunite with the mysterious girl to defeat it.",
    genre: ["Comedy", "Horror"],
    language: ["Hindi"],
    formats: ["2D", "Dolby Atmos"],
    duration: 147,
    censorRating: "U/A 16+",
    releaseDate: "2024-08-15",
    rating: 4.6,
    votes: 165000,
    director: "Amar Kaushik",
    posterUrl: "https://upload.wikimedia.org/wikipedia/en/a/a1/Stree_2.jpg",
    bannerUrl: "https://image.tmdb.org/t/p/w780/rMhuegV0wGb3vdxT0wFw9FaWqLl.jpg",
    trailerUrl: "https://www.youtube.com/embed/KVnhefZ_440",
    cast: [
      { actorName: "Rajkummar Rao", roleName: "Vicky" },
      { actorName: "Shraddha Kapoor", roleName: "The Mysterious Girl" },
      { actorName: "Pankaj Tripathi", roleName: "Rudra Bhaiya" },
      { actorName: "Abhishek Banerjee", roleName: "Jana" },
      { actorName: "Aparshakti Khurana", roleName: "Bittu" }
    ]
  }
];

export const INITIAL_THEATRES: Theatre[] = [
  // Mumbai
  {
    id: 'th_pvr_palladium',
    name: 'PVR INOX Palladium, Lower Parel',
    chain: 'PVR INOX',
    city: 'Mumbai',
    location: {
      address: 'Level 3, High Street Phoenix, Senapati Bapat Marg',
      area: 'Lower Parel'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'Recliner', 'Dolby Atmos', 'Wheelchair', 'Valet Parking'],
    screens: [
      { screenNumber: 1, name: 'IMAX Laser 1', format: 'IMAX 3D', totalSeats: 60 },
      { screenNumber: 2, name: 'Dolby Atmos Club', format: 'Dolby Atmos', totalSeats: 60 },
      { screenNumber: 3, name: 'Director\'s Lounge', format: '2D', totalSeats: 60 }
    ]
  },
  {
    id: 'th_pvr_kurla',
    name: 'PVR ICON Phoenix Marketcity, Kurla',
    chain: 'PVR INOX',
    city: 'Mumbai',
    location: {
      address: 'LBS Marg, Kurla West',
      area: 'Kurla'
    },
    amenities: ['M-Ticket', 'Food & Beverage', '4DX Motion', 'Dolby Atmos', 'Recliner'],
    screens: [
      { screenNumber: 1, name: '4DX Dynamic Audi', format: '4DX', totalSeats: 60 },
      { screenNumber: 2, name: 'ICON Atmos Luxe', format: 'Dolby Atmos', totalSeats: 60 }
    ]
  },
  {
    id: 'th_cinepolis_viviana',
    name: 'Cinepolis Grand Viviana Mall',
    chain: 'Cinepolis',
    city: 'Mumbai',
    location: {
      address: 'Eastern Express Highway, Near Jupiter Hospital',
      area: 'Thane West'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'Recliner', 'IMAX 3D', 'VIP Club'],
    screens: [
      { screenNumber: 1, name: 'IMAX Grand Screen', format: 'IMAX 3D', totalSeats: 60 },
      { screenNumber: 2, name: 'VIP Lounge 2', format: '2D', totalSeats: 60 }
    ]
  },

  // Delhi-NCR
  {
    id: 'th_pvr_delhi_ambience',
    name: 'PVR Director\'s Cut, Ambience Mall',
    chain: 'PVR INOX',
    city: 'Delhi-NCR',
    location: {
      address: '3rd Floor, Ambience Mall, NH 8',
      area: 'Gurugram'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'Recliner', 'Dolby Atmos', 'Valet Parking'],
    screens: [
      { screenNumber: 1, name: 'Gold Premiere 1', format: 'Dolby Atmos', totalSeats: 60 },
      { screenNumber: 2, name: 'IMAX Experience', format: 'IMAX 3D', totalSeats: 60 }
    ]
  },
  {
    id: 'th_inox_megamall',
    name: 'INOX Insignia, Megamall',
    chain: 'PVR INOX',
    city: 'Delhi-NCR',
    location: {
      address: 'Golf Course Road, DLF Phase 1',
      area: 'Gurugram'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'Recliner', 'Dolby Atmos'],
    screens: [
      { screenNumber: 1, name: 'Insignia Audi 1', format: 'Dolby Atmos', totalSeats: 60 },
      { screenNumber: 2, name: 'Laser 4K Audi', format: '2D', totalSeats: 60 }
    ]
  },
  {
    id: 'th_pvr_logix_noida',
    name: 'PVR Superplex Logix City Centre',
    chain: 'PVR INOX',
    city: 'Delhi-NCR',
    location: {
      address: 'Sector 32, Near Wave City Centre Metro',
      area: 'Noida'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'IMAX 3D', '4DX Motion', 'PlayHouse'],
    screens: [
      { screenNumber: 1, name: 'IMAX Laser Superplex', format: 'IMAX 3D', totalSeats: 60 },
      { screenNumber: 2, name: '4DX Simulator', format: '4DX', totalSeats: 60 }
    ]
  },

  // Bengaluru
  {
    id: 'th_pvr_bengaluru_forum',
    name: 'PVR Superplex Forum South Bengaluru',
    chain: 'PVR INOX',
    city: 'Bengaluru',
    location: {
      address: 'Konanakunte Cross, Kanakapura Road',
      area: 'South Bengaluru'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'Recliner', 'IMAX 3D', 'Wheelchair'],
    screens: [
      { screenNumber: 1, name: 'IMAX Laser South', format: 'IMAX 3D', totalSeats: 60 },
      { screenNumber: 2, name: 'Luxe Dolby Atmos', format: 'Dolby Atmos', totalSeats: 60 }
    ]
  },
  {
    id: 'th_inox_lido_bengaluru',
    name: 'INOX Lido Mall, MG Road',
    chain: 'PVR INOX',
    city: 'Bengaluru',
    location: {
      address: '1/2, Swami Vivekananda Road, Halasuru',
      area: 'MG Road'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'Dolby Atmos', 'Recliner'],
    screens: [
      { screenNumber: 1, name: 'Screen 1 Atmos', format: 'Dolby Atmos', totalSeats: 60 },
      { screenNumber: 2, name: 'Screen 2 Classic', format: '2D', totalSeats: 60 }
    ]
  },
  {
    id: 'th_cinepolis_shantiniketan',
    name: 'Cinepolis Nexus Shantiniketan',
    chain: 'Cinepolis',
    city: 'Bengaluru',
    location: {
      address: 'Whitefield Main Road, Sadaramangala',
      area: 'Whitefield'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'Macro XE', '4DX Motion'],
    screens: [
      { screenNumber: 1, name: 'Macro XE Laser', format: 'Dolby Atmos', totalSeats: 60 },
      { screenNumber: 2, name: '4DX Whitefield', format: '4DX', totalSeats: 60 }
    ]
  },

  // Hyderabad
  {
    id: 'th_amb_cinemas',
    name: 'AMB Cinemas, Gachibowli',
    chain: 'AMB Cinemas',
    city: 'Hyderabad',
    location: {
      address: 'Level 5, Sarath City Capital Mall, Kondapur',
      area: 'Gachibowli'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'Laser Projection', 'Dolby Atmos', 'Recliner', 'VIP Lounge'],
    screens: [
      { screenNumber: 1, name: 'Superplex Screen 1 Laser', format: 'Dolby Atmos', totalSeats: 60 },
      { screenNumber: 2, name: 'Screen 2 Gold VIP', format: '2D', totalSeats: 60 }
    ]
  },
  {
    id: 'th_prasads_multiplex',
    name: 'Prasads Multiplex, NTR Gardens',
    chain: 'Prasads',
    city: 'Hyderabad',
    location: {
      address: 'Necklace Road, Khairatabad',
      area: 'NTR Gardens'
    },
    amenities: ['M-Ticket', 'Large Screen', 'Dolby Atmos', 'Food Court', 'Wheelchair'],
    screens: [
      { screenNumber: 1, name: 'Prasads Large Screen', format: 'IMAX 3D', totalSeats: 60 },
      { screenNumber: 2, name: 'Audi 3 Atmos 4K', format: 'Dolby Atmos', totalSeats: 60 }
    ]
  },
  {
    id: 'th_inox_hyderabad_gvk',
    name: 'INOX GVK One Mall, Banjara Hills',
    chain: 'PVR INOX',
    city: 'Hyderabad',
    location: {
      address: 'Rd Number 1, Balapur Basthi, Banjara Hills',
      area: 'Banjara Hills'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'Recliner', 'Dolby Atmos'],
    screens: [
      { screenNumber: 1, name: 'Audi 1 Insignia', format: 'Dolby Atmos', totalSeats: 60 },
      { screenNumber: 2, name: 'Audi 2 BigScreen', format: '2D', totalSeats: 60 }
    ]
  },

  // Chennai
  {
    id: 'th_sathyam_chennai',
    name: 'Sathyam Cinemas (SPI PVR), Royapettah',
    chain: 'PVR INOX',
    city: 'Chennai',
    location: {
      address: '8, Thiru Vi Ka Road, Royapettah',
      area: 'Royapettah'
    },
    amenities: ['M-Ticket', 'Iconic Butter Popcorn', 'Dolby Atmos', 'RDX 4K', 'Wheelchair'],
    screens: [
      { screenNumber: 1, name: 'Sathyam Main Screen', format: 'Dolby Atmos', totalSeats: 60 },
      { screenNumber: 2, name: 'Santham Laser 4K', format: '2D', totalSeats: 60 }
    ]
  },
  {
    id: 'th_pvr_grand_galada',
    name: 'PVR Grand Galada, Pallavaram',
    chain: 'PVR INOX',
    city: 'Chennai',
    location: {
      address: 'Grand Galada Centre Mall, GST Road',
      area: 'Pallavaram'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'IMAX 3D', 'Dolby Atmos'],
    screens: [
      { screenNumber: 1, name: 'IMAX Laser Galada', format: 'IMAX 3D', totalSeats: 60 },
      { screenNumber: 2, name: 'Audi 2 Atmos', format: 'Dolby Atmos', totalSeats: 60 }
    ]
  },
  {
    id: 'th_ags_t_nagar',
    name: 'AGS Cinemas, T. Nagar',
    chain: 'AGS Cinemas',
    city: 'Chennai',
    location: {
      address: 'Coromandel Plaza, GN Chetty Road, T. Nagar',
      area: 'T. Nagar'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'Recliner', 'Dolby Atmos'],
    screens: [
      { screenNumber: 1, name: 'Audi 1 4K Atmos', format: 'Dolby Atmos', totalSeats: 60 },
      { screenNumber: 2, name: 'Audi 2 Elite', format: '2D', totalSeats: 60 }
    ]
  },

  // Kolkata
  {
    id: 'th_inox_quest_mall',
    name: 'INOX Quest Mall, Park Circus',
    chain: 'PVR INOX',
    city: 'Kolkata',
    location: {
      address: '33, Syed Amir Ali Avenue, Park Circus',
      area: 'Park Circus'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'IMAX 3D', 'Insignia Lounge', 'Recliner'],
    screens: [
      { screenNumber: 1, name: 'IMAX Laser Quest', format: 'IMAX 3D', totalSeats: 60 },
      { screenNumber: 2, name: 'Insignia 1', format: 'Dolby Atmos', totalSeats: 60 }
    ]
  },
  {
    id: 'th_pvr_south_city',
    name: 'PVR South City Mall, Jadavpur',
    chain: 'PVR INOX',
    city: 'Kolkata',
    location: {
      address: '375, Prince Anwar Shah Road, South City Complex',
      area: 'Jadavpur'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'IMAX 3D', 'Gold Class', 'Dolby Atmos'],
    screens: [
      { screenNumber: 1, name: 'IMAX South City', format: 'IMAX 3D', totalSeats: 60 },
      { screenNumber: 2, name: 'Gold Audi 2', format: '2D', totalSeats: 60 }
    ]
  },
  {
    id: 'th_miraj_mani_square',
    name: 'Miraj Cinemas, Mani Square Mall',
    chain: 'Miraj',
    city: 'Kolkata',
    location: {
      address: 'EM Bypass, Kankurgachi',
      area: 'Kankurgachi'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'Dolby Atmos', 'Recliner'],
    screens: [
      { screenNumber: 1, name: 'Audi 1 Atmos', format: 'Dolby Atmos', totalSeats: 60 },
      { screenNumber: 2, name: 'Audi 2 CineMax', format: '2D', totalSeats: 60 }
    ]
  },

  // Pune
  {
    id: 'th_cinepolis_westend',
    name: 'Cinepolis Westend Mall, Aundh',
    chain: 'Cinepolis',
    city: 'Pune',
    location: {
      address: 'Westend Mall, Harmony Society, Ward No. 8, Wireless Colony, Aundh',
      area: 'Aundh'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'IMAX 3D', '4DX Motion', 'VIP Club'],
    screens: [
      { screenNumber: 1, name: 'IMAX Laser Aundh', format: 'IMAX 3D', totalSeats: 60 },
      { screenNumber: 2, name: '4DX Motion Dynamic', format: '4DX', totalSeats: 60 }
    ]
  },
  {
    id: 'th_pvr_phoenix_pune',
    name: 'PVR Phoenix Marketcity, Viman Nagar',
    chain: 'PVR INOX',
    city: 'Pune',
    location: {
      address: 'S No. 207, Viman Nagar Road, Clover Park',
      area: 'Viman Nagar'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'Dolby Atmos', 'Recliner', 'Gold Class'],
    screens: [
      { screenNumber: 1, name: 'Gold Premiere 1', format: 'Dolby Atmos', totalSeats: 60 },
      { screenNumber: 2, name: 'Audi 2 4K', format: '2D', totalSeats: 60 }
    ]
  },
  {
    id: 'th_esquare_heritage',
    name: 'E-Square Heritage, Shivaji Nagar',
    chain: 'E-Square',
    city: 'Pune',
    location: {
      address: '132/A, University Road, Ganeshkhind',
      area: 'Shivaji Nagar'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'Dolby Atmos', 'Recliner'],
    screens: [
      { screenNumber: 1, name: 'Titan Screen Atmos', format: 'Dolby Atmos', totalSeats: 60 },
      { screenNumber: 2, name: 'Heritage Screen 2', format: '2D', totalSeats: 60 }
    ]
  },

  // Ahmedabad
  {
    id: 'th_pvr_acropolis',
    name: 'PVR Acropolis Mall, SG Highway',
    chain: 'PVR INOX',
    city: 'Ahmedabad',
    location: {
      address: 'Acropolis Mall, SG Highway, Thaltej',
      area: 'Thaltej'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'IMAX 3D', 'Dolby Atmos', 'Recliner'],
    screens: [
      { screenNumber: 1, name: 'IMAX Acropolis', format: 'IMAX 3D', totalSeats: 60 },
      { screenNumber: 2, name: 'Audi 2 Dolby Atmos', format: 'Dolby Atmos', totalSeats: 60 }
    ]
  },
  {
    id: 'th_cinepolis_alpha_one',
    name: 'Cinepolis Nexus Ahmedabad One',
    chain: 'Cinepolis',
    city: 'Ahmedabad',
    location: {
      address: 'Alpha One Mall, Vastrapur Lake',
      area: 'Vastrapur'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'Dolby Atmos', 'VIP Club', 'Recliner'],
    screens: [
      { screenNumber: 1, name: 'Macro XE Vastrapur', format: 'Dolby Atmos', totalSeats: 60 },
      { screenNumber: 2, name: 'VIP Screen 2', format: '2D', totalSeats: 60 }
    ]
  },
  {
    id: 'th_rajhans_nikol',
    name: 'Rajhans Cinemas, Nikol',
    chain: 'Rajhans',
    city: 'Ahmedabad',
    location: {
      address: 'Rajhans Prime, Raspan Arcade, Nikol',
      area: 'Nikol'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'Dolby 7.1', 'Push-Back Seats'],
    screens: [
      { screenNumber: 1, name: 'Audi 1 Grand', format: 'Dolby Atmos', totalSeats: 60 },
      { screenNumber: 2, name: 'Audi 2 Classic', format: '2D', totalSeats: 60 }
    ]
  },

  // Narsinghpur
  {
    id: 'th_raj_cinema_nsp',
    name: 'Raj Cinema & Multiplex, Station Road',
    chain: 'Raj Cinema',
    city: 'Narsinghpur',
    location: {
      address: 'Near Railway Station, Station Road',
      area: 'Station Road'
    },
    amenities: ['M-Ticket', 'Food & Beverage', 'Dolby Digital Sound', 'Air Conditioned', 'Push-Back Seats'],
    screens: [
      { screenNumber: 1, name: 'Screen 1 2K Dolby', format: 'Dolby Atmos', totalSeats: 60 },
      { screenNumber: 2, name: 'Screen 2 Gold Class', format: '2D', totalSeats: 60 }
    ]
  },
  {
    id: 'th_milan_multiplex_nsp',
    name: 'Milan Multiplex, Patel Ward',
    chain: 'Milan Cinemas',
    city: 'Narsinghpur',
    location: {
      address: 'Main Market Road, Patel Ward',
      area: 'Patel Ward'
    },
    amenities: ['M-Ticket', 'Fresh Popcorn & Snacks', 'Dolby Surround 7.1', 'Recliners'],
    screens: [
      { screenNumber: 1, name: 'Audi 1 Premiere', format: 'Dolby Atmos', totalSeats: 60 },
      { screenNumber: 2, name: 'Audi 2 Digital 2D', format: '2D', totalSeats: 60 }
    ]
  },
  {
    id: 'th_bharat_talkies_nsp',
    name: 'Bharat Talkies Cine Premiere, Kandeli',
    chain: 'Bharat Talkies',
    city: 'Narsinghpur',
    location: {
      address: 'Cinema Square, Kandeli Main Road',
      area: 'Kandeli'
    },
    amenities: ['M-Ticket', 'Canteen Refreshments', 'Digital 2K Sound', 'Push-Back Seats'],
    screens: [
      { screenNumber: 1, name: 'Screen 1 Main', format: '2D', totalSeats: 60 },
      { screenNumber: 2, name: 'Screen 2 Silver', format: 'Dolby Atmos', totalSeats: 60 }
    ]
  }
];

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'fnb_salted_popcorn',
    name: 'CineClassic Salted Popcorn (Tub)',
    category: 'Popcorn',
    price: 240,
    description: 'Hot, crunchy, golden cinema corn popped fresh with pure coconut oil and sea salt.',
    isVeg: true,
    calories: '380 kcal',
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'fnb_caramel_popcorn',
    name: 'Caramel Gold Crisp Popcorn',
    category: 'Popcorn',
    price: 290,
    description: 'Double-glazed with artisan cane sugar and golden butter caramel glaze.',
    isVeg: true,
    calories: '490 kcal',
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'fnb_nachos',
    name: 'Loaded Fiesta Nachos & Warm Cheese',
    category: 'Bites',
    price: 280,
    description: 'Crispy corn tortilla triangles with melted jalapeño cheese dip and spicy salsa.',
    isVeg: true,
    calories: '510 kcal',
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'fnb_combo_premiere',
    name: 'District Premiere Duo Combo',
    category: 'Combos',
    price: 490,
    description: '1 Large Tub Popcorn (Choice of Salted or Cheese) + 2 Chilled Fountain Sodas (600ml).',
    isVeg: true,
    calories: '720 kcal',
    imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'fnb_sliders',
    name: 'Gourmet Truffle Mushroom Sliders',
    category: 'Bites',
    price: 340,
    description: 'Pair of artisanal brioche sliders with caramelized onions and truffle aioli.',
    isVeg: true,
    calories: '460 kcal',
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'fnb_cold_brew',
    name: 'Artisan Chilled Cold Brew Coffee',
    category: 'Beverages',
    price: 180,
    description: 'Slow-steeped Arabica blend over crystal ice with subtle hazelnut notes.',
    isVeg: true,
    calories: '45 kcal',
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=300&q=80'
  }
];

export const INITIAL_REVIEWS: MovieReview[] = [
  {
    id: 'rev_1',
    movieId: 'mov_dune2',
    userId: 'usr_default',
    userName: 'Piyush Sen',
    userEmail: 'piyush292sen1234567@gmail.com',
    rating: 5,
    headline: 'A true modern cinematic masterpiece in IMAX!',
    content: 'Denis Villeneuve has outdone himself. The sound design in IMAX 3D shook the entire auditorium, especially the sandworm riding sequence and the arena duel. Timothée and Austin Butler delivered incredible performances.',
    isVerifiedBooking: true,
    likes: 42,
    likedBy: ['usr_admin'],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: 'APPROVED'
  },
  {
    id: 'rev_2',
    movieId: 'mov_dune2',
    userId: 'usr_rohit',
    userName: 'Rohit Deshmukh',
    userEmail: 'rohit.d@gmail.com',
    rating: 5,
    headline: 'Epic scale, haunting visuals, and Zimmer score',
    content: 'Watched this at PVR INOX Palladium. The visuals are completely unparalleled. Hans Zimmer’s brass and synthesizer score gives goosebumps throughout the 166-minute runtime.',
    isVerifiedBooking: true,
    likes: 28,
    likedBy: [],
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    status: 'APPROVED'
  },
  {
    id: 'rev_3',
    movieId: 'mov_kalki',
    userId: 'usr_ananya',
    userName: 'Ananya Sharma',
    userEmail: 'ananya.s@outlook.com',
    rating: 5,
    headline: 'Nag Ashwin created something truly revolutionary',
    content: 'Amitabh Bachchan as Ashwatthama steals every single scene he is in. The fusion of Mahabharata lore with futuristic cyberpunk dystopia works remarkably well. Interval and climax sequences are pure cinema adrenaline!',
    isVerifiedBooking: true,
    likes: 35,
    likedBy: [],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'APPROVED'
  },
  {
    id: 'rev_4',
    movieId: 'mov_oppenheimer',
    userId: 'usr_aditya',
    userName: 'Aditya Kulkarni',
    userEmail: 'aditya.k@gmail.com',
    rating: 5,
    headline: 'Cillian Murphy’s eyes tell a tragic, historic story',
    content: 'Nolan crafts a 3-hour biographical thriller that feels like a runaway locomotive. The Trinity test sequence without music — just pure breathing and explosion shockwave — was one of the most chilling theater experiences of my life.',
    isVerifiedBooking: true,
    likes: 56,
    likedBy: [],
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    status: 'APPROVED'
  },
  {
    id: 'rev_5',
    movieId: 'mov_interstellar',
    userId: 'usr_tanvi',
    userName: 'Tanvi Verma',
    userEmail: 'tanvi.v@gmail.com',
    rating: 5,
    headline: 'The 10th Anniversary IMAX re-release was magical',
    content: 'Seeing Gargantua on the giant IMAX laser screen 10 years later brought tears to my eyes. The docking scene with Zimmer’s organ music is timeless cinematic art.',
    isVerifiedBooking: true,
    likes: 64,
    likedBy: [],
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    status: 'APPROVED'
  },
  {
    id: 'rev_6',
    movieId: 'mov_stree2',
    userId: 'usr_manish',
    userName: 'Manish Gupta',
    userEmail: 'manish.g@gmail.com',
    rating: 4,
    headline: 'Laugh out loud comedy with great jump scares!',
    content: 'Pankaj Tripathi and Rajkummar Rao have legendary comic timing. The Sarkata concept was creepy, and the cameos had the whole theatre whistling and cheering.',
    isVerifiedBooking: false,
    likes: 19,
    likedBy: [],
    createdAt: new Date(Date.now() - 3600000 * 60).toISOString(),
    status: 'APPROVED'
  }
];
