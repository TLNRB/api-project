import express, { Application, Request, Response } from 'express';
import routes from './routes';
import dotenvFlow from 'dotenv-flow';

dotenvFlow.config();

// Creating express application
const app: Application = express();

app.use('/api', routes);

export function startServer() {
   const PORT: number = parseInt(process.env.PORT as string) || 4000;
   app.listen(PORT, function () {
      console.log('Server is running on port: ', PORT);
   })
}