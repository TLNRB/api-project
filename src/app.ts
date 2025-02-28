import express, { Application } from 'express';
import dotenvFlow from 'dotenv-flow';
import { testConnection } from './repository/database';
import { setupDocs } from './util/documentation';
import routes from './routes';
import cors from 'cors';

dotenvFlow.config();

// Creating express application
const app: Application = express();

// Setting up CORS
function setupCors() {
   app.use(cors({
      origin: '*',
      methods: 'GET, POST, PUT, DELETE',
      allowedHeaders: ['auth-token', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
      credentials: true
   }))
}

export function startServer() {
   setupCors();

   // JSON body parser
   app.use(express.json());

   // Binding routes to the app
   app.use('/api', routes);

   // Setting up swagger documentation
   setupDocs(app);

   // Testing connection to the database
   testConnection();

   // Starting the server
   const PORT: number = parseInt(process.env.PORT as string) || 4000;
   app.listen(PORT, function () {
      console.log('Server is running on port: ', PORT);
   })
}