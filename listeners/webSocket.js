import { WebSocketServer } from 'ws';

import Hero from '../src/models/Hero.js';

const PORT = 8080;

export const wss = new WebSocketServer({ port: PORT });

const GOBLIN = {
  name: 'goblin',
  velocity: 3000,
  status: {
    hp: 25,
    attack: 1,
    defense: 1,
  },
};

wss.on('connection', (ws) => {
  setInterval(async () => {
    const hero = await Hero.findOne();
    const currentHeroHp = hero.status.hp;
    const damagedHeroHp = currentHeroHp - GOBLIN.status.attack;

    await Hero.updateOne({}, { 'status.hp': damagedHeroHp });
    ws.send(
      `O ${GOBLIN.name} te atacou e desferiu ${
        GOBLIN.status.attack
      } de dano. Vida atual: ${JSON.stringify(damagedHeroHp)}`
    );
  }, GOBLIN.velocity);

  ws.on('error', (err) => ws.send(err));
  ws.send('CONNECTED');
});
