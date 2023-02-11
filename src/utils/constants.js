const { NODE_ENV } = process.env;

export const ENVIRONMENT = NODE_ENV || 'development';

export const CLIENT_URL =
  ENVIRONMENT === 'production'
    ? 'https://greatest-hero.vercel.app'
    : 'http://localhost:5173';

export const VERCEL_URLS = [
  'https://greatest-hero-vitoraugustto.vercel.app',
  'https://greatest-hero-35u2tgryy-vitoraugustto.vercel.app',
  'https://greatest-hero-git-master-vitoraugustto.vercel.app',
];
