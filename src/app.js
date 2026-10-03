import express from "express";
import helmet from 'helmet';
import cors from "cors";
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';

import { env } from "./config/env.js";

import logger from "./lib/logger.js";

import authRouter from './routes/auth.routes.js';
import hubRouter from './routes/hub.routes.js';
import membershipRouter from './routes/hubMembership.routes.js';
import assignmentRouter from "./routes/assignment.routes.js";
import courseRouter from "./routes/course.routes.js";

import notFound from "./middleware/not-found.js";
import errorHandler from "./middleware/error-handler.js";

const app = express();

app.disable('x-powered-by');

app.set('trust proxy', 1);

app.use(
  pinoHttp({ 
    logger
  })
);

app.use(helmet());

//TODO: Verify use of commas after params and fields in objects.
app.use(
  cors({ 
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  express.json({ 
    limit: '100kb',
  })
);

app.use(
  express.urlencoded({ 
    extended: false,
    limit: '100kb',
  })
);

app.use(
  cookieParser()
);

app.get('/health', (_req, _res) => { 
  _res.status(200).json({ 
    status: 'ok',
  });
});

app.use('/auth', authRouter);
app.use('/hubs', hubRouter);
app.use('/memberships', membershipRouter);
app.use('/courses', courseRouter)
app.use('/assignments', assignmentRouter);


app.use(notFound);

app.use(errorHandler);

export default app;
