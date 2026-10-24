import type { MetadataRoute } from 'next';
import { projectConfig } from '@/src/config/project';

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/' }], sitemap: `${projectConfig.SITE_URL}/sitemap.xml` };
}
