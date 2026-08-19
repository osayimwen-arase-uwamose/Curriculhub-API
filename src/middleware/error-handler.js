import { ZodError } from 'zod';

import AppError from '../utils/app-error.js';

import logger from '../lib/logger.js';

const errorHandler = (
  error,
  req,
  res,
  next,
) => { 
  console.error("UNHANDLED ERROR");
  console.error("message:", error?.message);
  console.error("stack:", error?.stack);
  console.error("name:", error?.name);
  console.error("cause:", error?.cause);

  if (error instanceof ZodError) { 
    return res.status(400).json({ 
      error: { 
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data.',
        details: error.flatten(),
      },
    });
  };

  if (error instanceof AppError) { 
    return res.status(error.statusCode).json({ 
      error: { 
        code: error.code,
        message: error.message,
      },
    });
  };

  logger.error(
    {
      error,
      method: req.method,
      path: req.originalUrl,
      requestId: req.id
    },
    'Unhandled application error',
  );

  return res.status(500).json({ 
    error: { 
      code: 'INTERNAL_ERROR',
      message: 'An internal error occured',
    },
  });
};

export default errorHandler;
