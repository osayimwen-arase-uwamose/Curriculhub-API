import AppError from "../utils/app-error.js";

import { verifyAccessToken } from "../services/token.service.js";

const authenticate = (_req, _res, _next) => { 
  const authorization = _req.get('authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) { 
    return _next(
      new AppError(
        401,
        'Authentication required.',
        'AUTH_REQUIRED',
      )
    );
  };

  const token = authorization.slice(7);

  try { 
    const payload = verifyAccessToken(token);

    _req.user = { 
      id: payload.sub,
      role: payload.role,
    };

    _next()
  } catch { 
    _next(
      new AppError(
        401,
        'Invalid or expired access token.',
        'INVALID_ACCESS_TOKEN',
      )
    );
  };
};

export default authenticate;
