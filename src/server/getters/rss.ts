
import RSS from 'rss';
import axios from 'axios';
import { META } from '../../config/app.config';
import { getNodePressAPI } from '../helpers/configurer';
import { getArticleURL } from '../helpers/route';

export const getRssXml = async () => {
  const api = `${getNodePressAPI()}/archive`;
  // const response = await axios.get(api, { timeout: 6000 });
  // const archive = response.data.result;

  const archive = { categories: [], tags: [], articles: [] };
  const feed = new RSS({
    title: META.title,
    description: META.zh_sub_title,
    site_url: META.url,
    feed_url: `${META.url}/rss.xml`,
    image_url: `${META.url}/icon.png`,
    managingEditor: META.author,
    webMaster: META.author,
    generator: `${META.domain}`,
    categories: archive.categories.map((category: any) => category.slug),
    copyright: `${new Date().getFullYear()} ${META.title}`,
    language: 'zh',
    ttl: 60,
  });

  archive.articles.forEach((article: any) => {
    return feed.item({
      title: article.title,
      description: article.description,
      url: getArticleURL(article.id),
      guid: String(article.id),
      categories: article.categories.map((category: any) => category.slug),
      author: META.author,
      date: article.created_at,
      enclosure: {
        url: article.thumbnail,
      },
    });
  });

  return feed.xml({ indent: true });
};
