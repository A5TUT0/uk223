import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Database } from './db';

const db = new Database();

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

    req.user = decoded;
    next();
  });
};

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        type: 'error',
        message: 'Access denied. Insufficient role.',
      });
    }

    next();
  };
};

export const authorizePermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(403)
        .json({ type: 'error', message: 'User ID is missing in the token.' });
    }

    try {
      const query = `
        SELECT p.action
        FROM Role_Permissions rp
        JOIN Permissions p ON rp.permission_id = p.id
        JOIN Roles r ON rp.role_id = r.id
        WHERE r.id = (SELECT role_id FROM Users WHERE id = ?)
      `;
      const permissions: any = await db.executeSQL(query, [userId]);

      const userPermissions = permissions.map((perm: any) => perm.action);

      if (!userPermissions.includes(requiredPermission)) {
        return res.status(403).json({
          type: 'error',
          message: 'Access denied. Missing required permission.',
        });
      }

      next();
    } catch (error) {
      console.error(
        '[AUTHORIZE PERMISSION] Error verifying permissions:',
        error
      );
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };
};

export const checkUserBlocked = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({
      type: 'error',
      message: 'Unauthorized. User ID is missing.',
    });
  }

  try {
    const query = `SELECT is_blocked FROM Users WHERE id = ? LIMIT 1;`;
    const [user]: any = await db.executeSQL(query, [userId]);

    if (user.is_blocked) {
      return res.status(403).json({
        type: 'error',
        message: 'User is blocked and cannot perform this action.',
      });
    }

    next();
  } catch (error) {
    console.error('[CHECK USER BLOCKED] Error:', error);
    res.status(500).json({ type: 'error', message: 'Internal server error.' });
  }
};
