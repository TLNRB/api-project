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
      const { error } = validateUserRegistrationData(req.body);
      if (error) {
         res.status(400).json({ error: error.details[0].message });
         return;
      }
   }
   catch (error) {

   }
   finally {

   }
}

// Validate user registration data
export async function validateUserRegistrationData(data: User): ValidationResult {
   const schema = Joi.object({
      name: Joi.string().min(6).max(255).required(),
      email: Joi.string().email().min(6).max(255).required(),
      password: Joi.string().min(6).max(20).required()
   });

   return schema.validate(data);
}

// Validate user login data
export async function validateUserLoginData(data: User): ValidationResult {
   const schema = Joi.object({
      email: Joi.string().email().min(6).max(255).required(),
      password: Joi.string().min(6).max(20).required()
   });

   return schema.validate(data);
}