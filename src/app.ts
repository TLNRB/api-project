import express, { Application, Request, Response } from 'express';
import routes from './routes';
import dotenvFlow from 'dotenv-flow';
import { connect, disconnect, testConnection } from './repository/database';
import test from 'node:test';

dotenvFlow.config();

// Creating express application
const app: Application = express();

export function startServer() {
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