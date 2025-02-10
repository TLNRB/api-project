import { User } from './user';

export interface Game extends Document {
   id: string,
   title: string,
   description: string,
   image: string,
   price: number,
   rating: number,
   platform: string,
   genre: string,
   releaseDate: Date,
   _createdBy: User['id'];
}