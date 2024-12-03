import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ type: 'error', message: 'Unauthorized. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.TOKEN_SECRET || 'secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ type: 'error', message: 'Invalid token.' });
    }

    req.user = decoded; // Incluye id y username en req.user
    next();
  });
};
