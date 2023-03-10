import { Router } from 'express';

import Enemy from '../models/Enemy.js';

const router = Router();

router.get('/', async (_, res) => {
  try {
    const enemies = await Enemy.find();

    res.status(200).json(enemies);
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
