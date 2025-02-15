import { Request, Response } from 'express';
import { gameModel } from '../models/gameModel';
import { connect, disconnect } from '../repository/database';

// Create a new game
export async function createGame(req: Request, res: Response): Promise<void> {
   const data = req.body;

   try {
      await connect();

      const game = new gameModel(data);
      const result = await game.save();

      res.status(201).send(result);
   }
   catch {
      res.status(500).send("Error creating a new game");
   }
   finally {
      await disconnect();
   }
}