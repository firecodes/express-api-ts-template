
import axios from 'axios';
import { SitemapStream, streamToPromise, SitemapItemLoose, EnumChangefreq } from 'sitemap';

import { Readable } from 'stream';
import { getArticleURL, getPageURL, getTagURL, getCategoryURL } from '../helpers/route';
import { getNodePressAPI } from '../helpers/configurer';
import { META } from '../../config/app.config';

export const getSitemapXml = async () => {
  const sitemapStream = new SitemapStream({ hostname: META.url });
  const api = `${getNodePressAPI()}/archive`;
  console.log('Listening: getSitemapXml', META, api, sitemapStream);
  // const response = await axios.get(api, { timeout: 6000 });
  // const archive = response.data.result;
  const archive = { categories: [], tags: [], articles: [] };

  const sitemapItemList: SitemapItemLoose[] = [
    { url: META.url, changefreq: EnumChangefreq.ALWAYS, priority: 1 },
    {
      url: getPageURL('about'),
      changefreq: EnumChangefreq.YEARLY,
      priority: 1,
    },
    {
      url: getPageURL('archive'),
      changefreq: EnumChangefreq.ALWAYS,
      priority: 1,
    },
    {
      url: getPageURL('guestbook'),
      changefreq: EnumChangefreq.ALWAYS,
      priority: 1,
    },
  ];


  archive.categories.forEach((category: any) => {
    sitemapItemList.push({
      priority: 0.6,
      changefreq: EnumChangefreq.DAILY,
      url: getCategoryURL(category.slug),
    });
  });

  archive.tags.forEach((tag: any) => {
    sitemapItemList.push({
      priority: 0.6,
      changefreq: EnumChangefreq.DAILY,
      url: getTagURL(tag.slug),
    });
  });

  archive.articles.forEach((article: any) => {
    sitemapItemList.push({
      priority: 0.8,
      changefreq: EnumChangefreq.DAILY,
      url: getArticleURL(article.id),
      lastmodISO: new Date(article.updated_at).toISOString(),
    });
  });

  return streamToPromise(Readable.from(sitemapItemList).pipe(sitemapStream)).then((data) => {
    return data.toString();
  });
};
