import rateLimit from 'express-rate-limit';

const authRateLimit = rateLimit({ 
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { 
    error: { 
      code: 'RATE_LIMITED',
      message: 'Too many authentication requests. Please try again later.',
    },
  },
});

const loginRateLimit = rateLimit({ 
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { 
    error: { 
      code: 'LOGIN_RATE_LIMITED',
      message: 'Too many login attempts. Please try again later.',
    },
  },
});

export { 
  authRateLimit,
  loginRateLimit,
};