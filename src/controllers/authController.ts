import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Joi, { ValidationResult } from 'joi';

import { userModel } from '../models/userModel';
import { User } from '../interfaces/user';
import { connect, disconnect } from '../repository/database';

// Register a new user
export async function registerUser(req: Request, res: Response) {
   try {
      // Validate user registration data
      const { error } = validateUserRegistrationData(req.body);

      if (error) {
         res.status(400).json({ error: error.details[0].message });
         return;
      }

      // Check if the user with this email is already registered
      await connect();

      const emailExists = await userModel.findOne({ email: req.body.email });

      if (emailExists) {
         res.status(400).json({ error: "Email already exists." });
         return;
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      const userObject = new userModel({
         name: req.body.name,
         email: req.body.email,
         password: passwordHashed
      });

      const savedUser = await userObject.save();

      res.status(201).json({ error: null, data: savedUser._id });
   }
   catch (error) {
      res.status(500).send("Error registering a new user. Error: " + error);
   }
   finally {
      await disconnect();
   }
}

// Login a user
export async function loginUser(req: Request, res: Response) {
   try {
      // Validate user login data
      const { error } = validateUserLoginData(req.body);

      if (error) {
         res.status(400).json({ error: error.details[0].message });
         return;
      }

      // Find the user with this email
      await connect();

      const user: User | null = await userModel.findOne({ email: req.body.email });

      if (!user) {
         res.status(400).json({ error: "User is not found with this email." });
         return;
      }
      else {
         // Check if the password is correct
         const validPassword: boolean = await bcrypt.compare(req.body.password, user.password);

         if (!validPassword) {
            res.status(400).json({ error: "Invalid password." });
            return;
         }

         const userId: string = user.id;
         const token: string = jwt.sign(
            {
               // Payload
               name: user.name,
               email: user.email,
               id: userId,
            },
            process.env.TOKEN_SECRET as string,
            { expiresIn: '1h' }
         );

         // Attach the token to the header and send it to the client
         res.status(200).header('auth-token', token).json({ error: null, data: { userId, token } });
      }
   }
   catch (error) {
      res.status(500).send("Error logging in a user. Error: " + error);
   }
   finally {
      await disconnect();
   }
}

// Verify the token
export function verifyToken(req: Request, res: Response, next: NextFunction) {
   const token = req.header('auth-token');

   if (!token) {
      res.status(400).json({ error: "Access denied." });
      return;
   }

   try {
      jwt.verify(token, process.env.TOKEN_SECRET as string);

      next();
   }
   catch (error) {
      res.status(401).send("Invalid token.");
   }
}

// Validate user registration data
export function validateUserRegistrationData(data: User): ValidationResult {
   const schema = Joi.object({
      name: Joi.string().min(6).max(255).required(),
      email: Joi.string().email().min(6).max(255).required(),
      password: Joi.string().min(6).max(20).required()
   });

   return schema.validate(data);
}

// Validate user login data
export function validateUserLoginData(data: User): ValidationResult {
   const schema = Joi.object({
      email: Joi.string().email().min(6).max(255).required(),
      password: Joi.string().min(6).max(20).required()
   });

   return schema.validate(data);
}