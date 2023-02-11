import { CronJob } from 'cron';

import Hero from '../models/Hero.js';

export const addGold = new CronJob(
  '0 */10 * * * *',
  async () => {
    const hero = await Hero.findOne();

    await Hero.findOneAndUpdate({}, { gold: hero.gold + 3 }, { new: true });
  },
  null,
  true,
  'America/Sao_Paulo'
);
