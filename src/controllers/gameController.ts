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

// Get games by title, platform, or all games
export function getGames(req: Request, res: Response) {
   const { title, platform } = req.query;

   if (title) {
      getGameByTitle(req, res, title as string);
      return;
   }
   else if (platform) {
      getGamesByPlatform(req, res, platform as string);
      return;
   }
   else {
      getAllGames(req, res);
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

// Get a single game by title
export async function getGameByTitle(req: Request, res: Response, title: string) {
   try {
      await connect();

      // Case-insensitive but exact title match
      const result = await gameModel.find({ title: new RegExp(`^${title}$`, 'i') });

      if (result.length === 0) {
         res.status(404).send("Game not found by title: " + title);
      }
      else {
         res.status(200).send(result);
      }
   }
   catch (error) {
      res.status(500).send("Error retrieving game by title. Error: " + error);
   }
   finally {
      await disconnect();
   }
}

// Get games by platform
export async function getGamesByPlatform(req: Request, res: Response, platform: string) {
   try {
      await connect();

      // Find games where the platform field contains the provided platform (case-insensitive)
      const result = await gameModel.find({ platform: new RegExp(platform, 'i') });

      if (result.length === 0) {
         res.status(404).send("Games not found by platform: " + platform);
      }
      else {
         res.status(200).send(result);
      }
   }
   catch (error) {
      res.status(500).send("Error retrieving games by platform. Error: " + error);
   }
   finally {
      await disconnect();
   }
}

// Update a game by ID
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

// Delete a game by ID
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