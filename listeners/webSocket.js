import { WebSocketServer } from 'ws';

import Enemy from '../src/models/Enemy.js';
import Hero from '../src/models/Hero.js';

const PORT = 8080;

export const wss = new WebSocketServer({ port: PORT });

wss.on('connection', async (ws) => {
  const enemy = await Enemy.findOne({ name: 'Goblin' });
  const hero = await Hero.findOne();

  const enemyIntervalAttack = setInterval(async () => {
    const enemy = await Enemy.findOne({ name: 'Goblin' });
    const hero = await Hero.findOne();

    if (hero.status.hp <= 0) {
      ws.send(JSON.stringify({ combat: { winner: enemy.name } }));
      ws.close();
    }

    const heroStatus = { ...hero.status };
    heroStatus.hp -= 49;

    await Hero.updateOne({}, { status: heroStatus });

    ws.send(
      JSON.stringify({
        hero: { ...hero.toObject(), status: heroStatus },
        combat: { damageTaken: enemy.status.attack },
      })
    );
  }, enemy.status.attackSpeed);

  const heroIntervalAttack = setInterval(async () => {
    const enemy = await Enemy.findOne({ name: 'Goblin' });
    const hero = await Hero.findOne();

    if (enemy.status.hp <= 0) {
      ws.send(JSON.stringify({ combat: { winner: hero.name } }));
      ws.close();
    }

    const enemyStatus = { ...enemy.status };

    enemyStatus.hp -= hero.status.attack;

    await Enemy.updateOne({}, { status: enemyStatus });

    ws.send(
      JSON.stringify({
        enemy: { ...enemy.toObject(), status: enemyStatus },
        combat: { damageTaken: hero.status.attack },
      })
    );
  }, hero.status.attackSpeed);

  ws.on('close', async () => {
    clearInterval(enemyIntervalAttack);
    clearInterval(heroIntervalAttack);
    await Hero.updateOne({}, { 'status.hp': 100 });
    await Enemy.updateOne({}, { 'status.hp': 25 });

    ws.close();
  });

  ws.on('error', (err) => ws.send(err));
});
