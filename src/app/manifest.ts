
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Rumonge Cultural Trails',
    short_name: 'RumongeTrails',
    description: 'Explore the heart of Burundi: Rumonge Commune.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#D97706',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
