import { generateSitemapXml } from '../../lib/sitemap';

export async function GET() {
  const xml = await generateSitemapXml();
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 