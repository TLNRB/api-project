import { Request, Response } from 'express';
import mongoose from 'mongoose';
import xss from 'xss';
import Joi, { ValidationResult } from 'joi';

import { gameModel } from '../models/gameModel';
import { Game } from '../interfaces/game';

// Create a new game
export async function createGame(req: Request, res: Response): Promise<void> {
   try {
      const data = req.body;

      // Validate user input
      const { error } = validateGameData(data);
      if (error) {
         res.status(400).json({ error: error.details[0].message });
         return;
      }

      // Sanitize user input
      data.title = xss(data.title);
      data.description = xss(data.description);
      data.imageURL = xss(data.imageURL);
      data.platform = xss(data.platform);
      data.genre = xss(data.genre);
      data._createdBy = xss(data._createdBy);

      // Check if the Game already exists
      const existingGame = await gameModel.findOne({
         title: { $regex: `^${data.title.trim()}$`, $options: 'i' }
      });
      if (existingGame) {
         res.status(400).send("Game with this title already exists.");
         return;
      }

      const game = new gameModel(data);
      const result = await game.save();

      res.status(201).send(result);
   }
   catch (error) {
      res.status(500).send("Error creating a new game. Error: " + error);
   }
}

// Get all games 
export async function getAllGames(req: Request, res: Response) {
   try {
      // Decide if we want to populate the users or not
      const populate: boolean = req.query.populate === 'true';

      let games;

      if (populate) {
         games = await gameModel.find({}).populate('_createdBy', 'name email');
      }
      else {
         games = await gameModel.find({});
      }

      res.status(200).send(games);
   }
   catch (error) {
      res.status(500).send("Error retrieving all games. Error: " + error);
   }
}

// Get a single game by ID
export async function getGameById(req: Request, res: Response) {
   try {
      // Decide if we want to populate the users or not
      const populate: boolean = req.query.populate === 'true';

      // Sanitize and validate id
      const id = xss(req.params.id);
      if (!mongoose.Types.ObjectId.isValid(id)) {
         res.status(400).json({ error: 'Invalid game Id format' });
         return;
      }

      let games;

      // Find the game by ID, optionally populating the _createdBy field
      if (populate) {
         games = await gameModel.find({ _id: id }).populate('_createdBy', 'name email');
      }
      else {
         games = await gameModel.find({ _id: id });
      }

      if (games.length === 0) {
         res.status(404).send("Game not found by id: " + id);
         return;
      }
      else {
         res.status(200).send(games);
      }
   }
   catch (error) {
      res.status(500).send("Error retrieving game by id. Error: " + error);
   }
}

// Get game(s) by query parameters
export async function getGamesByQuery(req: Request, res: Response) {
   try {
      // Sanitize query parameters
      const field: string = xss(req.query.field as string);
      const value: string = xss(req.query.value as string);
      const populate: boolean = req.query.populate === 'true';

      if (!field || !value) {
         res.status(400).send("Field and value are required!");
         return;
      }

      let games;

      // Check if the field is id or _createdBy
      if (field === '_id' || field === '_createdBy') {
         if (!mongoose.Types.ObjectId.isValid(value)) {
            res.status(400).json({ error: 'Invalid Id format!' });
            return;
         }

         if (populate) {
            games = await gameModel.find({ [field]: value }).populate('_createdBy', 'name email');
         }
         else {
            games = await gameModel.find({ [field]: value });
         }
      }
      // Check if the field is not string type
      else if (field === 'price' || field === 'rating' || field === 'releaseDate') {
         if (populate) {
            games = await gameModel.find({ [field]: value }).populate('_createdBy', 'name email');
         }
         else {
            games = await gameModel.find({ [field]: value });
         }
      }
      else {
         if (populate) {
            games = await gameModel.find({ [field]: { $regex: value, $options: 'i' } }).populate('_createdBy', 'name email');
         }
         else {
            games = await gameModel.find({ [field]: { $regex: value, $options: 'i' } });
         }
      }

      res.status(200).send(games);
   }
   catch (error) {
      res.status(500).send("Error retrieving game by query. Error: " + error);
   }
}

// Update a game by ID
export async function updateGameById(req: Request, res: Response) {
   try {
      const data = req.body;

      // Validate user input
      const { error } = validateGameData(data);
      if (error) {
         res.status(400).json({ error: error.details[0].message });
         return;
      }

      // Sanitize user input and id
      const id = xss(req.params.id);
      data.title = xss(data.title);
      data.description = xss(data.description);
      data.imageURL = xss(data.imageURL);
      data.platform = xss(data.platform);
      data.genre = xss(data.genre);

      if (!mongoose.Types.ObjectId.isValid(id)) {
         res.status(400).json({ error: 'Invalid game Id format' });
         return;
      }

      const { _createdBy, ...safeBody } = data; // Exclude _createdBy from the update object

      // Check if the Game already exists
      const existingGame = await gameModel.findOne({ title: { $regex: `^${data.title.trim()}$`, $options: 'i' } });
      if (existingGame && existingGame._id != id) {
         res.status(400).send("Game with this title already exists.");
         return;
      }

      const result = await gameModel.findByIdAndUpdate(id, safeBody);
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
}

// Delete a game by ID
export async function deleteGameById(req: Request, res: Response) {
   try {
      // Sanitize and validate id
      const id = xss(req.params.id);
      if (!mongoose.Types.ObjectId.isValid(id)) {
         res.status(400).json({ error: 'Invalid game Id format' });
         return;
      }

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
}

function validateGameData(data: Game): ValidationResult {
   const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      imageURL: Joi.string().uri().required(),
      price: Joi.number().min(0).required(),
      rating: Joi.number().min(0).max(5).required(),
      platform: Joi.string().required(),
      genre: Joi.string().required(),
      releaseDate: Joi.date().required(),
      _createdBy: Joi.string().required()
   });

   return schema.validate(data);
}