import { Router, Request, Response } from 'express';
import { createGame, getAllGames, getGameById, updateGameById, deleteGameById } from './controllers/gameController';
import { create } from 'domain';
import { registerUser } from './controllers/authController';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
   res.status(200).send('Hello there!');
});

// Create a new game
router.post('/games', createGame);
// Get all games
router.get('/games', getAllGames);
// Get a game by ID
router.get('/games/:id', getGameById);
// Update a game by ID
router.put('/games/:id', updateGameById);
// Delete a game by ID
router.delete('/games/:id', deleteGameById);

// Authentication
router.post('/user/register', registerUser);

export default router;