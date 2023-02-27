import { WebSocketServer } from 'ws';

import Hero from '../src/models/Hero.js';

const PORT = 8080;

export const wss = new WebSocketServer({ port: PORT });

const GOBLIN = {
  name: 'goblin',
  velocity: 3000,
  status: {
    hp: 25,
    maxHp: 25,
    attack: 1,
    defense: 1,
  },
};

wss.on('connection', (ws) => {
  const interval = setInterval(async () => {
    const hero = await Hero.findOne();
    const currentHeroHp = hero.status.hp;
    const damagedHeroHp = currentHeroHp - GOBLIN.status.attack;

    await Hero.updateOne({}, { 'status.hp': damagedHeroHp });

    ws.send(
      JSON.stringify({
        hero,
        monster: GOBLIN,
        combat: { damageTaken: GOBLIN.status.attack },
      })
    );
  }, GOBLIN.velocity);

  ws.on('close', async () => {
    clearInterval(interval);
    await Hero.updateOne({}, { 'status.hp': 100 });

    ws.close();
  });

  ws.on('error', (err) => ws.send(err));
});
