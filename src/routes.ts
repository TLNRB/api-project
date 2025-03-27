import { Router, Request, Response } from 'express';
import { createGame, getGames, getGameById, updateGameById, deleteGameById } from './controllers/gameController';
import { loginUser, registerUser, verifyToken } from './controllers/authController';
import { startCron } from './controllers/devToolsController';

const router: Router = Router();

// Welcome route
/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - App Routes
 *     summary: Health check
 *     description: Basic route to check if the API is up and running.
 *     responses: 
 *       200:
 *         description: Server is up and running.
 */
router.get('/', (req: Request, res: Response) => {
   res.status(200).send({ message: 'Hello there!' });
});

// Post routes
/**
 * @swagger
 * /games:
 *   post:
 *     tags:
 *       - Game Routes
 *     summary: Create a new game
 *     description: Takes a game object in the body and creates a new game in the database.
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       201:
 *         description: Game created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 */
router.post('/games', verifyToken, createGame); // Create a new game

// Get routes
/**
 * @swagger
 * /start-cron:
 *   get:
 *     tags:
 *       - Start Cron Jobs
 *     summary: Starts the cron job that keep render alive
 *     description: Starts the cron job that keep render alive
 *     responses:
 *       200:
 *         description: Response from the cron job
 *         content:
 *           application/json:
 *             schema:
 *               type: array               
 */
router.get('/start-cron', startCron);
/**
 * @swagger
 * /games:
 *   get:
 *     tags:
 *       - Game Routes
 *     summary: Get games based on optional query parameters (all games, game by title, games by platform)
 *     description: |
 *       Get all games if no parameter is provided, get games by title if a title is provided,
 *       or get games by platform if a platform is provided. 
 *       (Note: If both title and platform are provided, the API will return games by title only.
 *       Correct title and platform values are required, however, it is not case-sensitive.)
 *     parameters:
 *       - name: title
 *         in: query
 *         required: false
 *         description: Title of the game to retrieve.
 *         schema:
 *           type: string
 *       - name: platform
 *         in: query
 *         required: false
 *         description: Platform of the games to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game(s) retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 */
router.get('/games', getGames); // Get all games, get game by title, get games by platform
/**
 * @swagger
 * /games/{id}:
 *   get:
 *     tags:
 *       - Game Routes
 *     summary: Get a specific game
 *     description: Takes an Id and returns a game from the database based on that Id.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Id of the game to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 */
router.get('/games/:id', getGameById); // Get a game by Id

// Put routes
/**
 * @swagger
 * /games/{id}:
 *   put:
 *     tags:
 *       - Game Routes
 *     summary: Update a specific game
 *     description: Takes a game object in the body and updates a game in the database based on its Id.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Id of the game to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       200:
 *         description: Game updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 */
router.put('/games/:id', verifyToken, updateGameById); // Update a game by Id

// Delete routes
/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     tags:
 *       - Game Routes
 *     summary: Delete a specific game
 *     description: Deletes a game from the database based on its Id.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Id of the game to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 */
router.delete('/games/:id', verifyToken, deleteGameById); // Delete a game by Id

// Authentication
/**
 * @swagger
 * /user/register:
 *   post:
 *     tags:
 *       - User Routes
 *     summary: Register a new user
 *     description: Takes a user object in the body and registers a new user in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201: 
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 _id:
 *                   type: string
 */
router.post('/user/register', registerUser); // Register a new user
/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - User Routes
 *     summary: Login an existing user
 *     description: Takes a user object in the body and logs in an existing user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200: 
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     token:
 *                       type: string
 */
router.post('/user/login', loginUser); // Login a user

export default router;