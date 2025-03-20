import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { Application } from 'express';

// Setup Swagger documentation
export function setupDocs(app: Application) {
   // Swagger definition
   const swaggerDefinition = {
      openapi: '3.0.0',
      info: {
         title: 'Games REST API',
         version: '1.0.0',
         description: 'MongoDb, Express, Node.js, TypeScript REST API for games',
      },
      servers: [
         {
            url: 'http://localhost:4000/api/',
            description: 'Local development server'
         },
         {
            url: 'https://api-project-4z46.onrender.com/api/',
            description: 'Production server'
         }
      ],
      components: {
         securitySchemes: {
            ApiKeyAuth: {
               type: 'apiKey',
               in: 'header',
               name: 'auth-token'
            }
         },
         schemas: {
            Game: {
               type: 'object',
               properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  imageURL: { type: 'string' },
                  price: { type: 'number' },
                  rating: { type: 'number' },
                  platform: { type: 'string' },
                  genre: { type: 'string' },
                  releaseDate: { type: 'string' },
                  _createdBy: { type: 'string' }
               }
            },
            User: {
               type: 'object',
               properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                  registerDate: { type: 'string' }
               }
            }
         }
      }
   }

   // Swagger options
   const options = {
      swaggerDefinition,
      apis: ['**/*.ts'] // Path to the files containing OpenAPI definitions
   }

   // Swagger specification
   const swaggerSpec = swaggerJSDoc(options);

   // Docs route
   app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}