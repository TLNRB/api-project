import express, { Application, Request, Response } from 'express';
import routes from './routes';
import dotenvFlow from 'dotenv-flow';
import { testConnection } from './repository/database';
import cors from 'cors';

dotenvFlow.config();

// Creating express application
const app: Application = express();

export function setupCors() {
   app.use(
      cors({
         origin: "*", // Allow requests from any origin
         methods: 'GET,HEAD,PUT,OPTIONS,PATCH,POST,DELETE',
         allowedHeaders: ['auth-token', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept'], // Allow specific headers
         credentials: true,
      })
   );
   // set the Access-Control-Allow-Origin header for preflight requests
   /* app.options('*', (req: Request, res: Response) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,OPTIONS,PATCH,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'auth-token, Origin, X-Requested-With, Content-Type, Accept');
      // test for credentials
      res.header('Access-Control-Allow-Credentials', 'true');
      res.sendStatus(200);
   }); */
}

export function startServer() {
   // Setting up CORS
   setupCors();

   // JSON body parser
   app.use(express.json());

   // Binding routes to the app
   app.use('/api', routes);

   // Testing connection to the database
   testConnection();

   // Starting the server
   const PORT: number = parseInt(process.env.PORT as string) || 4000;
   app.listen(PORT, function () {
      console.log('Server is running on port: ', PORT);
   })
}