import 'dotenv/config';

import express from 'express';
import path from 'path';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
import 'express-async-errors';

import sentryConfig from './config/sentry';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files/',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  /**
   * Handle exception and show the error as a json.
   */
  exceptionHandler() {
    this.server.use(async (__error, __request, __response, __next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(__error, __request).toJSON();
        return __response.status(500).json(errors);
      }

      return __response.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
