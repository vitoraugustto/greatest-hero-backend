import { WebSocketServer } from 'ws';

import Enemy from '../src/models/Enemy.js';
import Hero from '../src/models/Hero.js';

const PORT = 8080;

export const wss = new WebSocketServer({ port: PORT });

wss.on('connection', async (ws) => {
  const enemy = await Enemy.findOne({ name: 'Goblin' });

  const interval = setInterval(async () => {
    const hero = await Hero.findOne();

    const heroStatus = { ...hero.status };
    heroStatus.hp -= enemy.status.attack;

    await Hero.updateOne({}, { status: heroStatus });

    ws.send(
      JSON.stringify({
        hero: { ...hero.toObject(), status: heroStatus },
        enemy: enemy,
        combat: { damageTaken: enemy.status.attack },
      })
    );
  }, enemy.status.attackSpeed);

  ws.on('close', async () => {
    clearInterval(interval);
    await Hero.updateOne({}, { 'status.hp': 100 });

    ws.close();
  });

  ws.on('error', (err) => ws.send(err));
});
