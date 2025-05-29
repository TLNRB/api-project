import { Document, Schema } from 'mongoose';

export interface Game extends Document {
   title: string,
   description: string,
   imageURL: string,
   price: number,
   rating: number,
   platform: string,
   genre: string,
   releaseDate: Date,
   _createdBy: Schema.Types.ObjectId;
}