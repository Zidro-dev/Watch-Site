import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@anizone.com' },
    update: {},
    create: {
      id: 'admin-uuid-placeholder', // In a real app, this matches Supabase Auth ID
      email: 'admin@anizone.com',
      role: 'ADMIN',
    },
  });

  const creatorUser = await prisma.user.upsert({
    where: { email: 'creator@anizone.com' },
    update: {},
    create: {
      id: 'creator-uuid-placeholder',
      email: 'creator@anizone.com',
      role: 'FANDUB_CREATOR',
    },
  });

  const freeUser = await prisma.user.upsert({
    where: { email: 'user@anizone.com' },
    update: {},
    create: {
      id: 'user-uuid-placeholder',
      email: 'user@anizone.com',
      role: 'FREE',
    },
  });

  console.log('Created Users.');

  // 2. Create Anime
  const aotAnime = await prisma.anime.create({
    data: {
      title: 'Attack on Titan: The Final Season',
      description: 'As Paradis Island braces for an impending attack from Marley, Eren Yeager sets his own destructive plan in motion to free his people once and for all.',
      coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2560&auto=format&fit=crop',
      releaseYear: 2021,
      status: 'COMPLETED',
      tags: ['Action', 'Dark Fantasy', 'Drama'],
      episodes: {
        create: [
          {
            episodeNumber: 1,
            title: 'The Other Side of the Sea',
            videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isPremiumOnly: false,
          },
          {
            episodeNumber: 2,
            title: 'Midnight Train',
            videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            isPremiumOnly: true, // Premium episode
          },
        ],
      },
    },
    include: { episodes: true },
  });

  const romanceAnime = await prisma.anime.create({
    data: {
      title: 'Your Lie in April',
      description: 'A piano prodigy who lost his ability to play after suffering a tragedy in his childhood is forced back into the spotlight by an eccentric girl with a secret of her own.',
      coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=2560&auto=format&fit=crop',
      releaseYear: 2014,
      status: 'COMPLETED',
      tags: ['Romance', 'Drama', 'Music'],
      episodes: {
        create: [
          {
            episodeNumber: 1,
            title: 'Monotone/Colorful',
            videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            isPremiumOnly: false,
          },
        ],
      },
    },
    include: { episodes: true },
  });

  console.log('Created Anime and Episodes.');

  // 3. Create Audio and Subtitle Tracks for AOT Episode 1
  const aotEp1 = aotAnime.episodes.find(ep => ep.episodeNumber === 1);
  if (aotEp1) {
    // Official Subtitles
    await prisma.subtitleTrack.create({
      data: {
        episodeId: aotEp1.id,
        language: 'EN',
        url: '/subs/aot-ep1-en.vtt', // Placeholder path
      },
    });

    // Fandub Audio Tracks
    await prisma.audioTrack.create({
      data: {
        episodeId: aotEp1.id,
        language: 'UZ',
        source: 'FANDUB',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder audio
        creatorId: creatorUser.id,
      },
    });

    await prisma.audioTrack.create({
      data: {
        episodeId: aotEp1.id,
        language: 'RU',
        source: 'FANDUB',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Placeholder audio
        creatorId: creatorUser.id,
      },
    });
  }

  console.log('Created Audio and Subtitle Tracks.');
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
