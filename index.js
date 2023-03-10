import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';

import { DB_PASSWORD, DB_USERNAME } from './.env.js';
import './listeners/webSocket.js';
import { addGold } from './src/crons/addGold.js';
import enemiesRoutes from './src/routes/enemiesRoutes.js';
import heroRoutes from './src/routes/heroRoutes.js';
import itemsRoutes from './src/routes/itemsRoutes.js';
import storeRoutes from './src/routes/storeRoutes.js';
import { CLIENT_URL, VERCEL_URLS } from './src/utils/constants.js';

const app = express();
const PORT = 8000;

const allowedOrigins = {
  domains: [CLIENT_URL, ...VERCEL_URLS],
  default: CLIENT_URL,
};

app.use((req, res, next) => {
  const origin = () => {
    if (allowedOrigins.domains.includes(req.headers.origin))
      return req.headers.origin;

    return allowedOrigins.default;
  };

  res.header('Access-Control-Allow-Origin', origin());
  res.setHeader('Access-Control-Allow-Methods', [
    'POST',
    'PUT',
    'GET',
    'PATCH',
    'DELETE',
  ]);
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v1/items', itemsRoutes);
app.use('/api/v1/hero', heroRoutes);
app.use('/api/v1/store', storeRoutes);
app.use('/api/v1/enemies', enemiesRoutes);

mongoose
  .connect(
    `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@greatest-hero-cluster.iqrhkun.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(PORT, () => {
      addGold.start();

      console.log('App listening on port', PORT);
    });
  })
  .catch((err) => console.log(err));
