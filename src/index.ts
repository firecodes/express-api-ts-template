
import { createExpressApp } from './server';
import { NODE_ENV, isNodeDev } from './server/environment';
import initApp from './init-app';
import initApi from './initApi';
import dotenv from 'dotenv';

import { enableDevRenderer } from './server/renderer/dev';
import { enableProdRenderer } from './server/renderer/prod';
// init env variables for BFF server env
dotenv.config();
console.log('dotenv---:', dotenv, NODE_ENV, isNodeDev);
// app
createExpressApp().then(async ({ app, server, cache }) => {
  initApi(app, cache);
  initApp(app);

  // vue renderer
  // await (isNodeDev ? enableDevRenderer(app, cache) : enableProdRenderer(app, cache));
  // run
  server.listen(5000, () => {
    const infos = [
      `at ${new Date().toLocaleString()}`,
      `listening on ${JSON.stringify(server.address())}`,
    ];
    console.info('[myblog]', `Run! ${infos.join(', ')}.`);
  });
});