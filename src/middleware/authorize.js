import AppError from "../utils/app-error";

const authorize = (...allowedRoles) => { 
  return (
    _req,
    _res,
    _next,
  ) => { 
    if (!_req.user) { 
      return _next(
        new AppError(
          401,
          'Authentication required.',
          'AUTH_REQUIRED',
        )
      );
    };

    if (!allowedRoles.includes(_req.user.role)) { 
      return _next(
        new AppError(
          403,
          'You do not have permission to perform this action',
          'FORBIDDEN',
        )
      );
    };

    _next();
  };
};

export default authorize;
