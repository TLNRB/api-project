import { Schema, model } from 'mongoose';
import { Game } from '../interfaces/game';

const gameSchema = new Schema<Game>({
   title: { type: String, required: true, min: 6, max: 255 },
   description: { type: String, required: false, min: 6, max: 255 },
   imageURL: { type: String, required: true },
   price: { type: Number, required: true },
   rating: { type: Number, required: true },
   platform: { type: String, required: true, min: 6, max: 255 },
   genre: { type: String, required: true, min: 6, max: 255 },
   releaseDate: { type: Date, required: true },
   _createdBy: { type: String, ref: 'User', required: true }
});

export const gameModel = model<Game>('Game', gameSchema);