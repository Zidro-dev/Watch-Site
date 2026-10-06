<div align="center">
  <img src="https://img.shields.io/badge/AniZone-E50914?style=for-the-badge&logo=netflix&logoColor=white" alt="AniZone Logo" />
  <h1>AniZone</h1>
  <p><strong>The Ultimate Hybrid Anime Streaming & Community Fandub Platform</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  </p>
</div>

<hr />

## 🌟 About AniZone

**AniZone** is a next-generation anime streaming platform built to bring the global anime community together. Not only can you watch anime with official subtitles and audio, but AniZone also features a **Hybrid Fandub System**. Community creators and voice actors can easily upload their own voiceovers directly onto official episodes, allowing viewers to seamlessly switch between official Japanese audio and community-submitted dubs on the fly!

Combined with gamification features, Watch Parties, and a powerful Creator Studio, AniZone is where true Otakus belong.

---

## ✨ Key Features

- 🎭 **Hybrid Audio Streaming:** Watch your favorite anime and seamlessly switch between official Japanese audio and user-generated Fandub audio tracks without reloading the page.
- 🎙️ **Fandub Creator Studio:** A dedicated portal for voice actors to submit audio files and AI-generated subtitles for anime episodes. Creators can even earn donations!
- 🍿 **Watch Party:** Share a link with your friends and watch anime together in real-time. Includes a synchronized chat room, viewer count, and flying emoji reactions on the screen.
- 🎮 **Gamification (Otaku XP & Ranks):** Earn XP and unlock achievements by watching episodes, writing reviews, and curating your watchlist. Level up from "Rookie" all the way to "Anime God"!
- 👑 **Interactive Premium System:** Built-in monetization tiers (Free, Otaku Pro, Studio Creator) unlocking 4K streaming, Watch Party hosting, and AI auto-dubbing.
- 📊 **Powerful Admin Dashboard:** Manage users, moderate community fandubs, and import real anime data directly from **MyAnimeList (Jikan API)** in a single click.
- 📱 **PWA (Progressive Web App):** Install AniZone on your mobile device or desktop PC just like a native app.
- ⌨️ **Pro Player Hotkeys:** Ultimate control over the video player (`Space`, `F`, `M`, and Arrow keys).

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js 14](https://nextjs.org/) (App Router), React, Tailwind CSS, Lucide Icons.
- **Backend:** Next.js Server Actions, API Routes.
- **Database / ORM:** PostgreSQL, [Prisma Client](https://www.prisma.io/).
- **Authentication:** [Supabase Auth](https://supabase.com/) with a custom fault-tolerant Fallback/Mock Authentication system.
- **External APIs:** [Jikan API](https://jikan.moe/) (MyAnimeList unofficial API).

---

## 🚀 Getting Started

Follow these steps to run the AniZone project on your local machine:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/anizone.git
cd anizone
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` or `.env.local` file in the root directory and add the following keys:
```env
DATABASE_URL="your_postgresql_database_url_here"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url_here"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key_here"
```
> **Note:** If you don't have Supabase set up, the app features a Hybrid Mock Auth system that will let you log in locally regardless!

### 4. Setup the Database (Prisma)
Push the Prisma schema to your database and generate the Prisma Client:
```bash
npx prisma db push
npx prisma generate
```

### 5. Seed the Database (Optional but Recommended)
Populate the database with demo users, 300+ anime titles from the Kitsu API, and sample episodes:
```bash
npm run prisma db seed
# Or manually run: npx tsx prisma/seed.ts
```

### 6. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Enjoy AniZone! 🎉

---

## 👨‍💻 Project Roadmap (Completed)
- [x] UI / UX Foundation & Catalog System
- [x] Database Seeding & Interactive Player
- [x] User Authentication & Admin Dashboards
- [x] Creator Fandub portal
- [x] Gamification, Ranks, & Watch Party
- [x] Hybrid Auth & Error Boundaries

<br />

<div align="center">
  <i>Built with ❤️ for Anime fans.</i>
</div>
