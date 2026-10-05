const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchTopAnime(page) {
  let retries = 3;
  while (retries > 0) {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/top/anime?limit=25&page=${page}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch page ${page}: ${res.statusText}`);
      }
      return await res.json();
    } catch (e) {
      retries--;
      console.log(`Retry ${3 - retries} for page ${page}...`);
      await delay(2000);
      if (retries === 0) throw e;
    }
  }
}

async function main() {
  console.log('Fetching more anime to reach 100 total...');
  let animesToInsert = [];

  for (let page = 3; page <= 6; page++) {
    console.log(`Fetching page ${page}...`);
    try {
      const data = await fetchTopAnime(page);
      
      const animes = data.data.map(anime => {
        let status = 'ONGOING';
        if (anime.status === 'Finished Airing') status = 'COMPLETED';
        if (anime.status === 'Not yet aired') status = 'UPCOMING';

        let releaseYear = anime.year;
        if (!releaseYear && anime.aired && anime.aired.from) {
          releaseYear = new Date(anime.aired.from).getFullYear();
        }

        const title = anime.title_english || anime.title;
        const description = anime.synopsis ? anime.synopsis.slice(0, 5000) : null;
        const coverImage = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

        return {
          title: title,
          description: description,
          coverImage: coverImage,
          releaseYear: releaseYear || null,
          status: status,
        };
      });

      animesToInsert = [...animesToInsert, ...animes];
    } catch (e) {
      console.error(e);
    }
    
    await delay(1500);
  }

  console.log(`Fetched ${animesToInsert.length} animes. Inserting into DB...`);

  let count = 0;
  for (const anime of animesToInsert) {
    try {
      const existing = await prisma.anime.findFirst({
        where: { title: anime.title }
      });
      
      if (!existing) {
        await prisma.anime.create({
          data: anime
        });
        count++;
      }
    } catch (error) {
      console.error(`Failed to insert ${anime.title}:`, error.message);
    }
  }

  console.log(`Seed completed! Inserted ${count} new anime records.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
