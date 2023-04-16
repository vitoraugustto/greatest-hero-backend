import mongoose from 'mongoose';

import { DB_PASSWORD, DB_USERNAME } from '../../.env.js';

mongoose.set('strictQuery', false);

export const connectDB = mongoose
  .connect(
    `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@greatest-hero-cluster.iqrhkun.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => console.log(err));
