export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  if (err.name === 'MulterError') {
    res.status(400);
    err.message = `Upload error: ${err.message}`;
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    res.status(400);
    err.message = 'Unexpected file field. Use "image" as the field name.';
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  const response = {
    success: false,
    message: err.message,
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
