import type { MetadataRoute } from 'next';
import { config } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: config.siteUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }];
}
