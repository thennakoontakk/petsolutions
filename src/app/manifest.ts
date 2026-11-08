import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PetSolutions.lk — Premium Pet Care Products',
    short_name: 'PetSolutions',
    description: "Sri Lanka's trusted online pet store. Shop premium pet foods, accessories, and veterinary care supplies delivered islandwide.",
    start_url: '/',
    display: 'standalone',
    background_color: '#FEFCF3',
    theme_color: '#00ACDF',
    icons: [
      {
        src: '/logo-icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
