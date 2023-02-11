import { Router } from 'express';
import multer from 'multer';

import Item from '../models/Item.js';
import cloudinary from '../services/cloudinary.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), async (req, res) => {
  const image = req.file;
  const { name, description, role, status, type, gold } = req.body;

  const item = {
    name,
    description,
    role,
    status,
    image,
    type,
    gold,
  };

  try {
    await cloudinary.v2.uploader.upload(
      image.path,
      { public_id: image.originalname.split('.')[0] },
      (_, result) => {
        item.image = result.url;
      }
    );
  } catch (error) {
    res.status(500).json({ error });
  }

  if (
    !name ||
    !description ||
    !role ||
    !type ||
    !gold ||
    Object.keys(item.status).length === 0
  ) {
    res.status(422).json({
      error:
        "'Name', 'description', 'role', 'status', 'type', 'gold' e 'image' são obrigatórios.",
    });
    return;
  }

  try {
    await Item.create(item);

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get('/', async (_, res) => {
  try {
    const items = await Item.find();

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findOne({ _id: id });

    if (!item) {
      res.status(422).json({ message: 'Item não encontrado.' });
      return;
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;

  const { name, description, role, status, image, gold, type } = req.body;
  const item = {
    name,
    description,
    role,
    status,
    image,
    gold,
    type,
  };

  try {
    const updatedItem = await Item.findOneAndUpdate({ _id: id }, item, {
      new: true,
    });

    if (updatedItem.matchedCount === 0) {
      res.status(422).json({ message: 'Item não encontrado.' });
      return;
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const item = await Item.findOne({ _id: id });

  if (!item) {
    res.status(422).json({ message: 'Item não encontrado.' });
    return;
  }

  try {
    await Item.deleteOne({ _id: id });

    res.status(200).json({ message: 'Item deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
