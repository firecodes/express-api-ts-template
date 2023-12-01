import fs from 'fs';
import path from 'path';
import { Express } from 'express';
import { createServer } from 'vite';
import { ROOT_PATH } from '../helpers/configurer';
import { resolveTemplate } from './template';

export const enableDevRenderer = async (app: Express, cache: any) => {
  // https://vitejs.dev/guide/ssr.html
  const viteServer = await createServer({
    root: process.cwd(),
    logLevel: 'info',
    appType: 'custom',
    server: {
      middlewareMode: true,
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
  });

  // use vite's connect instance as middleware
  app.use(viteServer.middlewares);
  app.use('*', async (request, response) => {
    const { renderApp, renderError } = await viteServer.ssrLoadModule('/src/ssr.ts');
    let template = fs.readFileSync(path.resolve(ROOT_PATH, 'index.html'), 'utf-8');

    try {
      const url = request.originalUrl;
      template = await viteServer.transformIndexHtml(url, template);
      const redered = await renderApp(request, cache);
      response.status(redered.code)
        .set({ 'Content-Type': 'text/html' })
        .end(resolveTemplate({
          template,
          heads: redered.heads,
          appHTML: redered.html,
          scripts: redered.stateScripts,
          extraScripts: redered.contextScripts,
        }));
    } catch (error: any) {
      viteServer.ssrFixStacktrace(error);
      const redered = await renderError(request, error);
      response.status(redered.code).end(
        resolveTemplate({
          template,
          heads: redered.heads,
          appHTML: redered.html,
          scripts: redered.stateScripts,
          extraScripts: redered.contextScripts,
        }),
      );
    }
  });
};
