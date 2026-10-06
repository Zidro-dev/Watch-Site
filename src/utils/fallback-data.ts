export const fallbackAnimes = [
  {
    id: "fb-1",
    title: "Solo Leveling",
    description: "In a world where hunters, humans who possess magical abilities, must battle deadly monsters to protect the human race from certain annihilation, a notoriously weak hunter named Sung Jinwoo finds himself in a seemingly endless struggle for survival.",
    coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-m1gX3iqITiv3.png",
    releaseYear: 2024,
    status: "ONGOING",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ _count: 15200 }],
    genres: [{ genre: { name: "Action" } }, { genre: { name: "Fantasy" } }]
  },
  {
    id: "fb-2",
    title: "Jujutsu Kaisen",
    description: "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman's school to be able to locate the demon's other body parts and thus exorcise himself.",
    coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pEFseh.jpg",
    releaseYear: 2020,
    status: "COMPLETED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ _count: 22000 }],
    genres: [{ genre: { name: "Action" } }, { genre: { name: "Supernatural" } }]
  },
  {
    id: "fb-3",
    title: "Attack on Titan",
    description: "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called titans, forcing humans to hide in fear behind enormous concentric walls.",
    coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-m5ZMNtFiG7ng.webp",
    releaseYear: 2013,
    status: "COMPLETED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ _count: 35000 }],
    genres: [{ genre: { name: "Action" } }, { genre: { name: "Drama" } }]
  },
  {
    id: "fb-4",
    title: "Demon Slayer: Kimetsu no Yaiba",
    description: "It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon. To make matters worse, his younger sister Nezuko, the sole survivor, has been transformed into a demon herself.",
    coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-PEn1CTc93DQl.jpg",
    releaseYear: 2019,
    status: "ONGOING",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ _count: 18000 }],
    genres: [{ genre: { name: "Action" } }, { genre: { name: "Historical" } }]
  },
  {
    id: "fb-5",
    title: "One Piece",
    description: "Gold Roger was known as the Pirate King, the strongest and most infamous being to have sailed the Grand Line. The capture and death of Roger by the World Government brought a change throughout the world.",
    coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDignzx8e1n.jpg",
    releaseYear: 1999,
    status: "ONGOING",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ _count: 40000 }],
    genres: [{ genre: { name: "Adventure" } }, { genre: { name: "Comedy" } }]
  },
  {
    id: "fb-6",
    title: "Naruto: Shippuden",
    description: "It has been two and a half years since Naruto Uzumaki left Konohagakure, the Hidden Leaf Village, for intense training following events which fueled his desire to be stronger.",
    coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1735-Az5suN3OgBw3.png",
    releaseYear: 2007,
    status: "COMPLETED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ _count: 31000 }],
    genres: [{ genre: { name: "Action" } }, { genre: { name: "Adventure" } }]
  },
  {
    id: "fb-7",
    title: "Frieren: Beyond Journey's End",
    description: "The demon king has been defeated, and the victorious hero party returns home before disbanding. The four—mage Frieren, hero Himmel, priest Heiter, and warrior Eisen—reminisce about their decade-long journey as the moment to bid each other farewell arrives.",
    coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-n1MjwNCJEQJ8.jpg",
    releaseYear: 2023,
    status: "COMPLETED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ _count: 12500 }],
    genres: [{ genre: { name: "Adventure" } }, { genre: { name: "Fantasy" } }]
  },
  {
    id: "fb-8",
    title: "Chainsaw Man",
    description: "Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he has been living a rock-bottom life while repaying his debt by harvesting devil corpses with Pochita.",
    coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-NuFVXEXzBqil.png",
    releaseYear: 2022,
    status: "COMPLETED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reviews: [{ _count: 14000 }],
    genres: [{ genre: { name: "Action" } }, { genre: { name: "Supernatural" } }]
  }
];

export const fallbackEpisodes = [
  {
    id: "ep-fb-1",
    animeId: "fb-1",
    episodeNumber: 1,
    title: "I'm Used to It",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    isPremiumOnly: false,
    audioTracks: [
      { id: "at-1", language: "Uzbek (Tarjima)", url: "", source: "FANDUB" }
    ],
    subtitleTracks: []
  },
  {
    id: "ep-fb-2",
    animeId: "fb-1",
    episodeNumber: 2,
    title: "If I Had One More Chance",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    isPremiumOnly: false,
    audioTracks: [],
    subtitleTracks: []
  }
];

export const fallbackGenres = [
  { id: "g-1", name: "Action" },
  { id: "g-2", name: "Fantasy" },
  { id: "g-3", name: "Drama" },
  { id: "g-4", name: "Comedy" },
  { id: "g-5", name: "Supernatural" },
  { id: "g-6", name: "Adventure" },
];

export const fallbackWatchProgress = [
  {
    userId: "demo-user",
    episodeId: "ep-fb-1",
    timestamp: 120,
    episode: {
      id: "ep-fb-1",
      episodeNumber: 1,
      anime: fallbackAnimes[0]
    }
  }
];
