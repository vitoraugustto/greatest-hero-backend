import mongoose from 'mongoose';

const { Schema } = mongoose;

const enemySchema = new Schema(
  {
    name: String,
    status: {
      attack: Number,
      defense: Number,
      hp: Number,
      maxHp: Number,
      attackSpeed: Number,
    },
  },
  { timestamps: true }
);

const Enemy = mongoose.model('Enemy', enemySchema);

export default Enemy;
