import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOption: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Express TypeORM starter',
      version: '1.0.0',
      description: 'A simple Express and TypeORM starter with Authentication',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },

      contact: {
        name: 'Express-TypeORM-Starter',
        url: 'https://github.com/RafadanaM/Express-TypeORM-starter',
        email: 'email@email.com',
      },
    },
    components: {
      securitySchemes: {
        Authorization: {
          type: 'http',
          in: 'header',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          value: 'Bearer <JWT token here>',
        },
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Localhost server',
      },
    ],
  },
  apis: ['./docs/api/**/*.doc.ts', './src/modules/**/*.ts'],
};
const options = swaggerJsdoc(swaggerOption);

export default options;
