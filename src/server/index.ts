
import http from 'http';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { PROXY_ROUTE_PATH, proxyer } from './proxy';
import { createCacheClient, createCacheClientMap } from './cache';
import { META } from '../config/app.config';

export const createExpressApp = async () => {
  // init cache client
  const cache = createCacheClientMap();
  // const cache = await createCacheClient({
  //   namespace: META.domain.replace(/\./gi, '_'),
  // });

  // init app
  const app = express();
  const server = http.createServer(app);

  // app proxy
  // app.use(PROXY_ROUTE_PATH, proxyer());

  // app middlewares
  app.use(express.json());
  app.use(cookieParser());
  app.use(compression());

  return { app, server, cache };
};
