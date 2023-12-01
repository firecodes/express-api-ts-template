import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';
import demo from './demo';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);
router.use('/demo', demo);

export default router;
