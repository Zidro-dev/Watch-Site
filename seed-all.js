const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fetchKitsuAnime(offset) {
  let retries = 3;
  while (retries > 0) {
    try {
      const res = await fetch(`https://kitsu.io/api/edge/anime?sort=popularityRank&page[limit]=20&page[offset]=${offset}`);
      if (!res.ok) {
        throw new Error(`Kitsu API Error: ${res.statusText}`);
      }
      return await res.json();
    } catch (e) {
      retries--;
      console.log(`Retry ${3 - retries} for offset ${offset}...`);
      await new Promise(r => setTimeout(r, 2000));
      if (retries === 0) throw e;
    }
  }
}

async function main() {
  console.log('Fetching ALL popular anime from Kitsu API to fill DB...');
  let count = 0;
  
  // Start from offset 300, go up to 10000 (Top 10,000 anime in the world)
  // Step is 20 per request
  for (let offset = 300; offset <= 10000; offset += 20) {
    console.log(`Fetching Kitsu offset ${offset}...`);
    try {
      const data = await fetchKitsuAnime(offset);
      
      if (!data || !data.data || data.data.length === 0) {
        console.log("No more data from Kitsu, stopping.");
        break; // Reached the end of the API
      }

      for (const item of data.data) {
        const attrs = item.attributes;
        const title = attrs.titles.en || attrs.titles.en_jp || attrs.canonicalTitle;
        if (!title) continue;

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
        }
      }
      console.log(`Successfully processed offset ${offset}. Total new inserted so far: ${count}`);
    } catch (e) {
      console.error(`Failed at offset ${offset}:`, e.message);
    }
    
    // Sleep to prevent getting banned by API rate limits (Wait 500ms between requests)
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`MASSIVE Kitsu seed completed! Inserted ${count} new anime records.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
