import mongoose from 'mongoose';

import { itemSchema } from './Item.js';

const { Schema } = mongoose;

const heroSchema = new Schema(
  {
    name: String,
    role: String,
    gold: Number,
    status: {
      attack: Number,
      defense: Number,
      hp: Number,
    },
    inventory: [itemSchema],
    equipment: [itemSchema],
  },
  { timestamps: true }
);

const Hero = mongoose.model('Hero', heroSchema);

export default Hero;
