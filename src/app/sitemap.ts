import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rumongetrails.bi';
  const lastModified = new Date();

  const routes = [
    '',
    '/wonders',
    '/heritage',
    '/dining',
    '/stays',
    '/transport',
    '/itinerary',
    '/community',
    '/office',
    '/guide',
    '/news',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
