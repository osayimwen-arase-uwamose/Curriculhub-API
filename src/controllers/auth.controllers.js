import { REFRESH_COOKIE_NAME } from '../config/consts.js';

import { 
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/cookies.js';

import * as authService from '../services/auth.service.js';

import { 
  registerSchema,
  loginSchema,
} from '../validators/auth.validator.js';

const register = async (_req, _res) => { 
  const data = registerSchema.parse(_req.body);

  const user = await authService.register({ 
    _req,
    _firstName: data.firstName,
    _middleName: data.middleName,
    _lastName: data.lastName,
    _email: data.email,
    _password: data.password,
  });

  _res.status(201).json({ 
    data: { user, },
  });
};

const login = async (_req, _res) => { 
  const data = loginSchema.parse(_req.body);

  const result = await authService.login({ 
    _req,
    _email: data.email,
    _password: data.password,
  });

  setRefreshTokenCookie(
    _res,
    result.refreshToken,
  );

  _res.status(200).json({ 
    data: { 
      accessToken: result.accessToken,
      user: result.user,
    },
  });
};

const refresh = async (_req, _res) => { 
  const refreshToken = _req.cookies[REFRESH_COOKIE_NAME];

  if (!refreshToken) { 
    return  _res.status(401).json({ 
      error: { 
        code: 'REFRESH_TOKEN_REQUIRED',
        message: 'Refresh token required',
      },
    });
  };

  const result = await authService.refresh({ 
    _req,
    _refreshToken: refreshToken,
  });

  setRefreshTokenCookie(
    _res,
    result.refreshToken,
  );

  _res.status(200).json({ 
    data: { 
      accessToken: result.accessToken,
    },
  });
};

const logout = async (_req, _res) => { 
  
}

const logoutAll = async (_req, _res) => { 

}

export { 
  register,
  login,
  refresh,
  logout,
  logoutAll,
};