const notFound = (_req, _res) => { 
  _res.status(404).json({ 
    error: { 
      code: 'NOT_FOUND',
      message: `Route ${_req.method} ${_req.originalUrl} not found`,
    },
  });
};

export default notFound;
