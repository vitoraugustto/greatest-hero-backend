import { Router } from 'express';
import multer from 'multer';

import Enemy from '../models/Enemy.js';
import cloudinary from '../services/cloudinary.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), async (req, res) => {
  const image = req.file;
  const { name, status } = req.body;

  const enemy = {
    name,
    status,
    image,
  };

  try {
    await cloudinary.v2.uploader.upload(
      image.path,
      { public_id: image.originalname.split('.')[0] },
      (_, result) => {
        enemy.image = result.url;
      }
    );
  } catch (error) {
    res.status(500).json({ error });
  }

  if (!name || !image || Object.keys(enemy.status).length === 0) {
    res.status(422).json({
      error: "'Name', 'status', e 'image' são obrigatórios.",
    });
    return;
  }

  try {
    await Enemy.create(enemy);

    res.status(201).json(enemy);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get('/', async (_, res) => {
  try {
    const enemies = await Enemy.find();

    res.status(200).json(enemies);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const enemy = await Enemy.findById(id);

    if (!enemy) {
      throw 'Item não encontrado.';
    }

    res.status(200).json(enemy);
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
