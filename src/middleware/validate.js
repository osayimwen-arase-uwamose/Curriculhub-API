import AppError from "../utils/app-error.js";

const validate = (schema) => { 
  return async (req, res, next) => { 
    const result = await schema.safeParseAsync({ 
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) { 
      return next(
        new AppError(
          400,
          'validation failed',
          result.error.flatten(),
        )
      );
    };

    req.validated = result.data;

    next();
  };
};

export default validate;
