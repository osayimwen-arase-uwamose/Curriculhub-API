import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

import { 
  generateRandomToken,
  hashToken,
} from '../utils/crypto.js';


const createAccessToken = (_user) => { 
  return jwt.sign(
    {
      sub: _user._id.toString(),
      role: _user.role,
      type: 'access',
    },
    env.JWT_ACCESS_SECRET,
    { 
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
      algorithm: 'HS256',
    },
  );
};

const verifyAccessToken = (_token) => { 
  const payload = jwt.verify(
    _token,
    env.JWT_ACCESS_SECRET,
    { 
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
      algorithms: ['HS256'],
    },
  );

  if (typeof payload !== 'object' || payload === null) { 
    throw new Error('invalid token');
  };

  if (payload.type !== 'access') { 
    throw new Error('Invalid token type');
  };

  if (typeof payload.sub !== 'string') { 
    throw new Error('Invalid subject');
  };

  if (payload.role !== 'user' && payload.role !== 'admin') { 
    throw new Error('Invalid role');
  };

  return payload;
};

const createRefreshToken = () => { 
  const token = generateRandomToken(64);

  return { 
    token,
    tokenHash: hashToken(token),
  };
};

export { 
  createAccessToken,
  verifyAccessToken,
  createRefreshToken,
};
