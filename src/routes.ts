import { Router, Request, Response } from 'express';
import { createGame } from './controllers/gameController';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
   res.status(200).send('Hello there!');
});

router.post('/games', createGame);

export default router;