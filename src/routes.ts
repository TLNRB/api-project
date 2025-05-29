import { Router, Request, Response } from 'express';
import { createGame, getAllGames, getGameById, getGamesByQuery, updateGameById, deleteGameById } from './controllers/gameController';
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
 *             $ref: '#/components/schemas/GameUnpopulated'
 *     responses:
 *       201:
 *         description: Game created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameUnpopulated'
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
 *     summary: Get all games
 *     description: |
 *       Get all games populated with user data for _createdBy if populate parameter is true, else user ID is returned for _createdBy.
 *     parameters:
 *       - name: populate
 *         in: query
 *         required: false
 *         description: Populate the _createdBy field.
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Game(s) retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GamePopulated'
 */
router.get('/games', getAllGames); // Get all games
/**
 * @swagger
 * /games/{id}:
 *   get:
 *     tags:
 *       - Game Routes
 *     summary: Get a specific game
 *     description: |
 *       Takes an ID and returns a game from the database based on that ID. Populates the user if the `populate` parameter is true; otherwise, the ID is returned.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the game to retrieve.
 *         schema:
 *           type: string
 *       - name: populate
 *         in: query
 *         required: false
 *         description: Populate the _createdBy field.
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Game retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GamePopulated'
 */
router.get('/games/:id', getGameById); // Get a game by Id
/**
 * @swagger
 * /games/query:
 *   get:
 *     tags:
 *       - Game Routes
 *     summary: Get games by query
 *     description: |
 *       Get games based on a specific field and value. Populates the user if the `populate` parameter is true.
 *     parameters:
 *       - name: field
 *         in: query
 *         required: true
 *         description: Field to query by.
 *         schema:
 *           type: string
 *       - name: value
 *         in: query
 *         required: true
 *         description: Value of the field.
 *         schema:
 *           type: string
 *       - name: populate
 *         in: query
 *         required: false
 *         description: Populate the _createdBy field.
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Game(s) retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GamePopulated'
 */
router.get('/query/games', getGamesByQuery); // Get game(s) by query parameters

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
 *             $ref: '#/components/schemas/GameUnpopulated'
 *     responses:
 *       200:
 *         description: Game updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Game updated successfully.
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
 *               type: string
 *               example: Game deleted successfully.
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