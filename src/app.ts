import express, { Application, Request, Response } from 'express';
import routes from './routes';
import dotenvFlow from 'dotenv-flow';

/* dotenvFlow.config(); */

// Creating express application
const app: Application = express();

app.use('/api', routes);

export function startServer() {
   app.listen(4000, function () {
      console.log('Server is running on port 4000');
   })
}