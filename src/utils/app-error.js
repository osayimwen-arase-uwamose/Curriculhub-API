class AppError extends Error { 
  constructor(
    statusCode,
    message,
    code,
  ) { 
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;

    Error.captureStackTrace(
      this,
      this.constructor,
    );
  };
};

export default AppError;
