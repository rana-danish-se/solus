import axios from 'axios';
import * as cheerio from 'cheerio';

function getDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function buildFaviconUrl(url) {
  const domain = getDomain(url);
  if (!domain) return '';
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

const DEFAULT_BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
};

export async function scrapeUrl(url) {
  const fallback = {
    url,
    title: '',
    siteName: '',
    favicon: buildFaviconUrl(url),
    metaDescription: '',
  };

  if (!url || typeof url !== 'string') {
    return fallback;
  }

  try {
    new URL(url);
  } catch {
    return fallback;
  }

  try {
    const response = await axios.get(url, {
      timeout: 8000,
      maxRedirects: 5,
      responseType: 'text',
      headers: DEFAULT_BROWSER_HEADERS,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    const html = typeof response.data === 'string' ? response.data : '';
    if (!html) {
      return fallback;
    }

    const $ = cheerio.load(html);

    const title =
      $('title').first().text().trim() ||
      $('meta[property="og:title"]').attr('content')?.trim() ||
      $('meta[name="twitter:title"]').attr('content')?.trim() ||
      $('meta[name="title"]').attr('content')?.trim() ||
      '';

    const metaDescription =
      $('meta[name="description"]').attr('content')?.trim() ||
      $('meta[property="og:description"]').attr('content')?.trim() ||
      $('meta[name="twitter:description"]').attr('content')?.trim() ||
      '';

    const siteName =
      $('meta[property="og:site_name"]').attr('content')?.trim() ||
      $('meta[name="application-name"]').attr('content')?.trim() ||
      getDomain(url);

    return {
      url,
      title,
      siteName: siteName || getDomain(url),
      favicon: buildFaviconUrl(url),
      metaDescription,
    };
  } catch (err) {
    console.warn(`[scraper] Failed to scrape ${url}: ${err.message}`);
    return fallback;
  }
}
