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
   catch (error) {
      res.status(500).send("Error creating a new game. Error: " + error);
   }
   finally {
      await disconnect();
   }
}

// Get all games
export async function getAllGames(req: Request, res: Response) {
   try {
      await connect();

      const result = await gameModel.find({});

      res.status(200).send(result);
   }
   catch (error) {
      res.status(500).send("Error retrieving all games. Error: " + error);
   }
   finally {
      await disconnect();
   }
}

// Get a single game by ID
export async function getGameById(req: Request, res: Response) {
   try {
      await connect();

      const id = req.params.id;
      const result = await gameModel.find({ _id: id });

      if (result.length === 0) {
         res.status(404).send("Game not found by id: " + id);
      }
      else {
         res.status(200).send(result);
      }
   }
   catch (error) {
      res.status(500).send("Error retrieving game by id. Error: " + error);
   }
   finally {
      await disconnect();
   }
}

export async function updateGameById(req: Request, res: Response) {
   try {
      await connect();

      const id = req.params.id;
      const result = await gameModel.findByIdAndUpdate(id, req.body);

      if (!result) {
         res.status(404).send("Game not found by id: " + id);
      }
      else {
         res.status(200).send("Game updated successfully");
      }
   }
   catch (error) {
      res.status(500).send("Error updating game by id. Error: " + error);
   }
   finally {
      await disconnect();
   }
}

export async function deleteGameById(req: Request, res: Response) {
   try {
      await connect();

      const id = req.params.id;
      const result = await gameModel.findByIdAndDelete(id);

      if (!result) {
         res.status(404).send("Game not found by id: " + id);
      }
      else {
         res.status(200).send("Game deleted successfully");
      }
   }
   catch (error) {
      res.status(500).send("Error deleting game by id. Error: " + error);
   }
   finally {
      await disconnect();
   }
}