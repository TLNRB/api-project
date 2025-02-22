import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Joi, { ValidationResult } from 'joi';

import { userModel } from '../models/userModel';
import { User } from '../interfaces/user';
import { connect, disconnect } from '../repository/database';

export async function registerUser(req: Request, res: Response) {
   try {

   }
   catch (error) {

   }
   finally {

   }
}