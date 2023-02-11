import mongoose from 'mongoose';

const { Schema } = mongoose;

export const itemSchema = new Schema(
  {
    name: String,
    description: String,
    role: String,
    image: String,
    status: {
      attack: Number,
      defense: Number,
    },
    gold: Number,
    type: String,
  },
  { timestamps: true }
);

const Item = mongoose.model('Item', itemSchema);

export default Item;
