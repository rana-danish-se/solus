import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const token = req.cookies?.auth_token;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { email: decoded.email };
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized, token invalid');
  }
};
