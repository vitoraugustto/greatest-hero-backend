import { WebSocketServer } from 'ws';

import Hero from '../src/models/Hero.js';

const PORT = 8080;

export const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
  const interval = setInterval(async () => {
    const hero = await Hero.findOne();
    const heroStatus = { ...hero.status };

    heroStatus.hp -= ENEMIES[0].status.attack;

    await Hero.updateOne({}, { status: heroStatus });

    ws.send(
      JSON.stringify({
        hero: { ...hero.toObject(), status: heroStatus },
        enemy: ENEMIES[0],
        combat: { damageTaken: ENEMIES[0].status.attack },
      })
    );
  }, ENEMIES[0].status.attackSpeed);

  ws.on('close', async () => {
    clearInterval(interval);
    await Hero.updateOne({}, { 'status.hp': 100 });

    ws.close();
  });

  ws.on('error', (err) => ws.send(err));
});

const ENEMIES = [
  {
    name: 'goblin',
    status: {
      hp: 25,
      maxHp: 25,
      attack: 3,
      defense: 1,
      attackSpeed: 3000,
    },
  },
  {
    name: 'slime',
    status: {
      hp: 12,
      maxHp: 12,
      attack: 1,
      defense: 1,
      attackSpeed: 2500,
    },
  },
];
