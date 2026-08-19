import app from "./app.js";

import { env } from "./config/env.js";

import logger from "./lib/logger.js";

import { 
  connectDatabase,
  disconnectDatabase,
} from "./lib/mongoose.js";

let server;

const start = async () => { 
  try { 
    await connectDatabase();

    server = app.listen(
      env.PORT,
      () => { 
        logger.info(
          { 
            port: env.PORT,
            environment: env.NODE_ENV,
          },

          'Curriculhub API started'
        );
      },
    );
  } catch (_err) { 
    logger.fatal(
      { 
        error: _err
      },

      'Failed to start server'
    )

    process.exit(1);
  };
};

//TODO: Add shutdown function and criterias

start();