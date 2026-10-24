import type { MetadataRoute } from 'next';
import { projectConfig } from '@/src/config/project';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: projectConfig.SITE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }];
}
