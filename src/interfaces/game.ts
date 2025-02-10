import { User } from './user';

export interface Game extends Document {
   id: string,
   title: string,
   description: string,
   imageURL: string,
   price: number,
   rating: number,
   platform: string,
   genre: string,
   releaseDate: Date,
   _createdBy: User['id'];
}