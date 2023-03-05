import { Router } from 'express';

import Hero from '../models/Hero.js';

const router = Router();

router.get('/', async (_, res) => {
  try {
    const hero = await Hero.find();

    res.status(200).json(...hero);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post('/', async (req, res) => {
  const { name, role } = req.body;
  const hero = { name, role };

  try {
    const createdHero = await Hero.findOneAndUpdate(
      {},
      {
        ...hero,
        gold: 0,
        status: {
          attack: 1,
          defense: 0,
          hp: 100,
          maxHp: 100,
          attackSpeed: 1000,
        },
        inventory: [],
        equipment: [],
      },
      { upsert: true, new: true }
    );

    res.status(201).json(createdHero);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post('/inventory/:id/equipment', async (req, res) => {
  const { id } = req.params;
  let itemFoundInInventory;
  let itemAlreadyEquipped;
  let itemTypeAlreadyEquipped;

  try {
    const hero = await Hero.findOne();
    const item = hero.inventory.find((item) => String(item._id) === id);

    itemTypeAlreadyEquipped = hero.equipment.find(
      (equippedItem) => equippedItem.type === item.type
    );

    const currentAttack = hero.status.attack;
    const currentDefense = hero.status.defense;
    const itemAttack = item.status.attack;
    const itemDefense = item.status.defense;

    itemFoundInInventory = hero.inventory.some(
      (inventoryItem) => String(inventoryItem._id) === id
    );

    itemAlreadyEquipped = hero.equipment.some(
      (inventoryItem) => String(inventoryItem._id) === id
    );

    if (
      itemFoundInInventory &&
      !itemAlreadyEquipped &&
      !itemTypeAlreadyEquipped
    ) {
      const updatedInventory = hero.inventory.filter(
        (inventoryItem) => String(inventoryItem._id) !== id
      );

      await Hero.findOneAndUpdate(
        {},
        {
          'status.attack': currentAttack + itemAttack,
          'status.defense': currentDefense + itemDefense,
          equipment: [...hero.equipment, item],
          inventory: updatedInventory,
        },
        { new: true }
      );

      res
        .status(200)
        .json({ message: `Item '${item.name}' equipado com sucesso.` });
    } else if (itemAlreadyEquipped) {
      throw `Item '${item.name}' já equipado.`;
    } else if (!itemFoundInInventory && !itemAlreadyEquipped) {
      throw `Item '${item.name}' não encontrado no inventário.`;
    } else if (itemTypeAlreadyEquipped) {
      throw `Item do tipo '${item.type}' já equipado. Você só pode ter um item do mesmo tipo equipado.`;
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.put('/inventory/:id/equipment', async (req, res) => {
  const { id } = req.params;

  try {
    const hero = await Hero.findOne();
    const item = hero.equipment.find((item) => String(item._id) === id);

    const currentAttack = hero.status.attack;
    const currentDefense = hero.status.defense;
    const itemAttack = item.status.attack;
    const itemDefense = item.status.defense;

    if (item) {
      const updatedEquipment = hero.equipment.filter(
        (equippedItem) => String(equippedItem._id) !== id
      );

      await Hero.updateOne(
        {},
        {
          'status.attack': currentAttack - itemAttack,
          'status.defense': currentDefense - itemDefense,
          equipment: updatedEquipment,
          inventory: [...hero.inventory, item],
        }
      );

      res.status(200).json({
        message: `Item '${item.name}' desequipado com sucesso.`,
      });
    } else {
      throw `Item ${item.name} não está equipado.`;
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.put('/inventory/:id/sell', async (req, res) => {
  const { id } = req.params;
  let itemFound = false;

  try {
    const hero = await Hero.findOne();

    itemFound = hero.inventory.find(
      (inventoryItem) => String(inventoryItem._id) === id
    );

    if (itemFound) {
      const updatedInventory = hero.inventory.filter(
        (inventoryItem) => String(inventoryItem._id) !== id
      );

      await Hero.updateOne(
        {},
        { gold: hero.gold + itemFound.gold, inventory: updatedInventory }
      );

      res.status(200).json({
        message: `Item '${itemFound.name}' vendido com sucesso.`,
      });
    } else {
      throw 'Item não encontrado no inventário.';
    }
  } catch (error) {
    if (!itemFound) {
      res.status(400).json({ error });
    } else {
      res.status(500).json({ error });
    }
  }
});

export default router;
