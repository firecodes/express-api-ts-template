
import { responser, errorer } from './server/helpers/responser';
import { cacher } from './server/helpers/cacher';
import { TUNNEL_PREFIX } from './config';

import { TunnelModule } from './constants/tunnel';
import { BAD_REQUEST } from './constants/http-code';


import { getSitemapXml } from './server/getters/sitemap';
import { getRssXml } from './server/getters/rss';
import { getGTagScript } from './server/getters/gtag';
import { getWebFont, WebFontContentType } from './server/getters/webfont';

import { getAllWallpapers } from './server/getters/wallpaper';
import { getMyGoogleMap } from './server/getters/my-google-map';
// import { getTwitterAggregate } from './server/getters/twitter';
// import { getGitHubSponsors, getGitHubContributions } from './server/getters/github';
import { getInstagramMedias, getInstagramMediaChildren, getInstagramCalendar, initInstagramCalendar } from './server/getters/instagram';
import { getYouTubeChannelPlayLists, getYouTubeVideoListByPlayerlistId } from './server/getters/youtube';
import { getGitHubStatistic, getNPMStatistic } from './server/getters/open-srouce';
import { getDoubanMovies } from './server/getters/douban';
import { getSongList } from './server/getters/netease-music';

export default function initApi(app: any, cache: any) {
  console.log('Listening: initApi');
  // init thirds task
  // initInstagramCalendar();

  // sitemap
  app.get('/sitemap.xml', async (_: any, response: any) => {
    try {
      response.header('Content-Type', 'application/xml');
      response.send(await getSitemapXml());
    } catch (error) {
      errorer(response, { message: error });
    }
  });

  // RSS
  app.get('/rss.xml', async (_: any, response: any) => {
    try {
      response.header('Content-Type', 'application/xml');
      response.send(await getRssXml());
    } catch (error) {
      errorer(response, { message: error });
    }
  });

  // gtag
  app.get('/effects/gtag', async (_: any, response: any) => {
    console.log('Listening: initApi /effects/gtag');
    try {
      const data = await cacher({
        cache,
        key: 'gtag',
        ttl: 60 * 60 * 48, // 48 hours
        retryWhen: 60 * 60 * 1, // 1 hours
        getter: getGTagScript,
      });
      response.header('Content-Type', 'text/javascript');
      response.send(data);
    } catch (error) {
      errorer(response, { message: error });
    }
  });

  // WebFont  url: /_tunnel/webfont
  app.get(`${TUNNEL_PREFIX}/${TunnelModule.WebFont}`, async (request: any, response: any) => {
    console.log('Listening: initApi url: /_tunnel/webfont', request.query);
    const fontnameVal = request.query.fontname !== undefined ? request.query.fontname : '';
    const textVal = request.query.text !== undefined ? request.query.text : '';
    const fontname = decodeURIComponent(String(fontnameVal)).trim();
    const text = decodeURIComponent(String(textVal)).trim();
    if (!text || !fontname) {
      errorer(response, { code: BAD_REQUEST, message: 'Invalid params' });
      return;
    }

    try {
      const data = await getWebFont({ fontname, text });
      // never expired
      response.header('Cache-Control', 'public, max-age=31536000');
      response.header('Content-Type', WebFontContentType);
      response.send(data);
    } catch (error) {
      errorer(response, { message: error });
    }
  });

  // Bing wallpapers   url: /_tunnel/bing_wallpaper
  app.get(`${TUNNEL_PREFIX}/${TunnelModule.BingWallpaper}`,
    responser(() => {
      return cacher({
        cache,
        key: TunnelModule.BingWallpaper,
        ttl: 60 * 60 * 6, // 6 hours
        retryWhen: 60 * 30, // 30 minutes
        getter: getAllWallpapers,
      });
    }),
  );

  // My GoogleMap   url: /_tunnel/my_google_map
  // app.get(`${TUNNEL_PREFIX}/${TunnelModule.MyGoogleMap}`, responser(() => {
  //   return cacher({
  //     cache,
  //     key: TunnelModule.MyGoogleMap,
  //     ttl: 60 * 60 * 6, // 6 hours
  //     retryWhen: 60 * 30, // 30 minutes
  //     getter: getMyGoogleMap,
  //   });
  // }));

  // GitHub sponsors   delete
  // app.get(`${TUNNEL_PREFIX}/${TunnelModule.GitHubSponsors}`, responser(() => {
  //   return cacher({
  //     cache,
  //     key: TunnelModule.GitHubSponsors,
  //     ttl: 60 * 60 * 18, // 18 hours
  //     retryWhen: 60 * 10, // 10 minutes
  //     getter: getGitHubSponsors,
  //   });
  // }));

  // GitHub contributions   delete
  // app.get(`${TUNNEL_PREFIX}/${TunnelModule.GitHubContributions}`, responser(() => {
  //   return cacher({
  //     cache,
  //     key: TunnelModule.GitHubContributions,
  //     ttl: 60 * 60 * 8, // 8 hours
  //     retryWhen: 60 * 10, // 10 minutes
  //     getter: () => {
  //       const now = new Date();
  //       const end = now.toISOString();
  //       now.setFullYear(now.getFullYear() - 1);
  //       const start = now.toISOString();
  //       return getGitHubContributions(start, end);
  //     },
  //   });
  // }));

  // open-source   url: /_tunnel/open_source_github_statistic
  app.get(`${TUNNEL_PREFIX}/${TunnelModule.OpenSourceGitHubStatistic}`, responser(() => {
    return cacher({
      cache,
      key: TunnelModule.OpenSourceGitHubStatistic,
      ttl: 60 * 60 * 8, // 8 hours
      retryWhen: 60 * 10, // 10 minutes
      getter: getGitHubStatistic,
    });
  }));

  // open-source   url: /_tunnel/open_source_npm_statistic
  app.get(`${TUNNEL_PREFIX}/${TunnelModule.OpenSourceNPMStatistic}`, responser(() => {
    return cacher({
      cache,
      key: TunnelModule.OpenSourceNPMStatistic,
      ttl: 60 * 60 * 8, // 8 hours
      retryWhen: 60 * 10, // 10 minutes
      getter: getNPMStatistic,
    });
  }));

  // 163 music BGM list  url: /_tunnel/netease_music
  app.get(`${TUNNEL_PREFIX}/${TunnelModule.NetEaseMusic}`, responser(() => {
    return cacher({
      cache,
      key: TunnelModule.NetEaseMusic,
      ttl: 60 * 60 * 6, // 6 hours
      retryWhen: 60 * 10, // 10 minutes
      getter: getSongList,
    });
  }));

  // Douban movies   url: /_tunnel/douban_movies
  app.get(`${TUNNEL_PREFIX}/${TunnelModule.DoubanMovies}`, responser(() => {
    return cacher({
      cache,
      key: TunnelModule.DoubanMovies,
      ttl: 60 * 60 * 32, // 32 hours
      retryWhen: 60 * 10, // 10 minutes
      getter: getDoubanMovies,
    });
  }));

  // // Twitter aggregate  delete
  // app.get(`${TUNNEL_PREFIX}/${TunnelModule.TwitterAggregate}`, responser(() => {
  //   return cacher({
  //     cache,
  //     key: TunnelModule.TwitterAggregate,
  //     ttl: 60 * 60 * 1, // 1 hour
  //     retryWhen: 60 * 10, // 10 minutes
  //     getter: getTwitterAggregate,
  //   });
  // }));

  // Instagram medias    url: /_tunnel/instagram_medias
  app.get(`${TUNNEL_PREFIX}/${TunnelModule.InstagramMedias}`, (request: any, response: any, next: any) => {
    const afterToken = request.query.after;
    if (afterToken && typeof afterToken !== 'string') {
      errorer(response, { code: BAD_REQUEST, message: 'Invalid params' });
      return;
    }

    responser(() => {
      return cacher({
        cache,
        key: `instagram_medias_page_${afterToken ?? 'first'}`,
        preRefresh: !afterToken, // Disable pre-refresh when not first pafe
        ttl: 60 * 60 * 3, // 3 hours
        retryWhen: 60 * 10, // 10 minutes
        getter: () => getInstagramMedias({ after: afterToken }),
      });
    })(request, response, next);
  });

  // Instagram media children     url: /_tunnel/instagram_media_children
  app.get(`${TUNNEL_PREFIX}/${TunnelModule.InstagramMediaChildren}`, (request: any, response: any, next: any) => {
    const mediaId = request.query.id;
    if (!mediaId || typeof mediaId !== 'string') {
      errorer(response, { code: BAD_REQUEST, message: 'Invalid params' });
      return;
    }

    responser(() => {
      return cacher({
        cache,
        key: `instagram_media_children_${mediaId}`,
        ttl: 60 * 60 * 24 * 7, // 7 days
        retryWhen: 60 * 10, // 10 minutes
        getter: () => getInstagramMediaChildren(mediaId),
      });
    })(request, response, next);
  });

  // Instagram calendar   url: /_tunnel/instagram_calendar
  app.get(`${TUNNEL_PREFIX}/${TunnelModule.InstagramCalendar}`,
    responser(() => getInstagramCalendar()),
  );

  // YouTube platlists   url: /_tunnel/youtube_playlist
  app.get(`${TUNNEL_PREFIX}/${TunnelModule.YouTubePlaylist}`,
    responser(() => {
      return cacher({
        cache,
        key: TunnelModule.YouTubePlaylist,
        ttl: 60 * 60 * 24, // 24 hours
        retryWhen: 60 * 10, // 10 minutes
        getter: getYouTubeChannelPlayLists,
      });
    }),
  );

  // YouTube videos   url: /_tunnel/youtube_video_list
  app.get(`${TUNNEL_PREFIX}/${TunnelModule.YouTubeVideoList}`, (request: any, response: any, next: any) => {
    const playlistId = request.query.id;
    if (!playlistId || typeof playlistId !== 'string') {
      errorer(response, { code: BAD_REQUEST, message: 'Invalid params' });
      return;
    }
    responser(() => {
      return cacher({
        cache,
        key: `youtube_playlist_${playlistId}`,
        ttl: 60 * 60 * 1, // 1 hours
        retryWhen: 60 * 10, // 10 minutes
        getter: () => getYouTubeVideoListByPlayerlistId(playlistId),
      });
    })(request, response, next);
  });
}