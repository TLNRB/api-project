import { Router, Request, Response } from 'express';
import { createGame, getGames, getGameById, updateGameById, deleteGameById } from './controllers/gameController';
import { loginUser, registerUser, verifyToken } from './controllers/authController';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
   res.status(200).send('Hello there!');
});

// Post routes
router.post('/games', verifyToken, createGame); // Create a new game

// Get routes
router.get('/games', getGames); // Get all games, get game by title, get games by platform
router.get('/games/:id', getGameById); // Get a game by ID

// Put routes
router.put('/games/:id', verifyToken, updateGameById); // Update a game by ID

// Delete routes
router.delete('/games/:id', verifyToken, deleteGameById); // Delete a game by ID

// Authentication
router.post('/user/register', registerUser); // Register a new user
router.post('/user/login', loginUser); // Login a user

export default router;