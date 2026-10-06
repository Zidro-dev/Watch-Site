import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AniZone - Hybrid Anime Platform',
    short_name: 'AniZone',
    description: 'The ultimate hybrid anime streaming platform with community fandubs and next-gen features.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#E50914',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
