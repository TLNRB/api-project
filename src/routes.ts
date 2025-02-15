import { Router, Request, Response } from 'express';
import { createGame, getAllGames } from './controllers/gameController';
import { create } from 'domain';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
   res.status(200).send('Hello there!');
});

router.post('/games', createGame);

router.get('/games', getAllGames);

export default router;