const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fetchKitsuAnime(offset) {
  // sort=popularityRank, limit=20 (kitsu max)
  const res = await fetch(`https://kitsu.io/api/edge/anime?sort=popularityRank&page[limit]=20&page[offset]=${offset}`);
  if (!res.ok) {
    throw new Error(`Kitsu API Error: ${res.statusText}`);
  }
  return await res.json();
}

async function main() {
  console.log('Fetching NEXT 100 anime from Kitsu API to fill DB...');
  let count = 0;

  // We already fetched up to offset 80. Now let's fetch from offset 100 to 280 (10 pages)
  for (let i = 5; i < 15; i++) {
    const offset = i * 20;
    console.log(`Fetching Kitsu offset ${offset}...`);
    try {
      const data = await fetchKitsuAnime(offset);
      
      for (const item of data.data) {
        const attrs = item.attributes;
        const title = attrs.titles.en || attrs.titles.en_jp || attrs.canonicalTitle;
        const description = attrs.synopsis ? attrs.synopsis.slice(0, 5000) : "No description available.";
        const coverImage = attrs.posterImage?.original || attrs.posterImage?.large || null;
        const releaseYear = attrs.startDate ? parseInt(attrs.startDate.split('-')[0]) : null;
        
        let status = 'ONGOING';
        if (attrs.status === 'finished') status = 'COMPLETED';
        if (attrs.status === 'upcoming' || attrs.status === 'tba') status = 'UPCOMING';

        // Check if exists STRICTLY
        const existing = await prisma.anime.findFirst({
          where: { title: title }
        });

        if (!existing && coverImage) {
          await prisma.anime.create({
            data: {
              title,
              description,
              coverImage,
              releaseYear,
              status
            }
          });
          count++;
          console.log(`Inserted: ${title}`);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  console.log(`Kitsu seed completed! Inserted ${count} new anime records.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
