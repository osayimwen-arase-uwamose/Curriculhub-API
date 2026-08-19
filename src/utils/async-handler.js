const asyncHandler = (handler) => { 
  const wrappedHandler = (req, res, next) => { 
    Promise
      .resolve(
        handler(req, res, next)
      )
      .catch(next)
  };

  return wrappedHandler;
};

export default asyncHandler;
