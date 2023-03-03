import { WebSocketServer } from 'ws';

import Hero from '../src/models/Hero.js';

const PORT = 8080;

export const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
  const interval = setInterval(async () => {
    const hero = await Hero.findOne();
    const heroStatus = { ...hero.status };

    heroStatus.hp -= MONSTERS[0].status.attack;

    await Hero.updateOne({}, { status: heroStatus });

    ws.send(
      JSON.stringify({
        hero: { ...hero.toObject(), status: heroStatus },
        monster: MONSTERS[0],
        combat: { damageTaken: MONSTERS[0].status.attack },
      })
    );
  }, MONSTERS[0].velocity);

  ws.on('close', async () => {
    clearInterval(interval);
    await Hero.updateOne({}, { 'status.hp': 100 });

    ws.close();
  });

  ws.on('error', (err) => ws.send(err));
});

const MONSTERS = [
  {
    name: 'goblin',
    velocity: 3000,
    status: {
      hp: 25,
      maxHp: 25,
      attack: 3,
      defense: 1,
    },
  },
  {
    name: 'slime',
    velocity: 2500,
    status: {
      hp: 12,
      maxHp: 12,
      attack: 1,
      defense: 1,
    },
  },
];
