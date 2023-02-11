import { Router } from 'express';
import mongoose from 'mongoose';

import Hero from '../models/Hero.js';
import Item from '../models/Item.js';

const router = Router();

router.post('/:id/purchase', async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findOne({ _id: id });
    const hero = await Hero.findOne();

    if (hero.gold >= item.gold) {
      item._id = new mongoose.Types.ObjectId();

      await Hero.findOneAndUpdate(
        {},
        { gold: hero.gold - item.gold, inventory: [...hero.inventory, item] },
        { new: true }
      );

      res.status(200).json({
        message: `Item '${item.name}' comprado com sucesso.`,
      });
    } else {
      throw 'Ouro insuficiente.';
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

export default router;
