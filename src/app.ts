import express, { Application } from 'express';
import dotenvFlow from 'dotenv-flow';
import { connect, disconnect, testConnection } from './repository/database';
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

export async function startServer() {
   try {
      await connect(); // Connect to the database

      setupCors();

      // JSON body parser
      app.use(express.json());

      // Binding routes to the app
      app.use('/api', routes);

      // Setting up swagger documentation
      setupDocs(app);

      // Testing connection to the database
      /* testConnection(); */

      // Starting the server
      const PORT: number = parseInt(process.env.PORT as string) || 4000;
      app.listen(PORT, function () {
         console.log('Server is running on port: ', PORT);
      })
   }
   catch (err) {
      console.error('Error starting server: ', err);
      process.exit(1); // Exit the process with failure
   }
}

// CTRL + C to stop the server
process.on('SIGINT', async () => {
   console.log('SIGINT received: closing database connection...');
   await disconnect(); // Disconnect from the database
   process.exit(0); // Exit the process with success
});

// When the server is stopped in production
process.on('SIGTERM', async () => {
   console.log('SIGTERM received: closing database connection...');
   await disconnect();
   process.exit(0);
});