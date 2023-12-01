
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';

export default function initApp(app: any) {
  //  app.get<{}, MessageResponse>('/', (req, res)
  app.get('/', (req, res) => {
    res.json({ message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄' });
  });
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(cors());
  app.use('/api/v1', api);
  app.use(middlewares.notFound);
  app.use(middlewares.errorHandler);
}