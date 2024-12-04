/* eslint-disable @typescript-eslint/no-explicit-any */
//import { TUser } from '../types';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Database } from './db';
import { Request, Response } from 'express';
dotenv.config();
type Email = `${string}@${string}.${string}`;

export class User {
  private username: string;
  private password: string;
  private email: Email;
  private creationDate: string;
  private status: boolean;

  constructor(
    username: string,
    password: string,
    email: Email,
    creationDate: string,
    status: boolean
  ) {
    this.username = username;
    this.creationDate = creationDate;
    this.email = email;
    this.status = status;
    this.password = password;
  }
}

export class UserController {
  private db: Database;
  constructor(db: Database) {
    this.db = db;
  }
  generateAccessToken(userId: number, username: string, role: string) {
    return jwt.sign(
      { id: userId, username, role },
      process.env.TOKEN_SECRET || '123',
      { expiresIn: '10d' }
    );
  }

  register = async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      const defaultRoleId = 1;

      if (!username || !email || !password) {
        return res.status(400).json({
          type: 'error',
          message: 'All fields are required.',
        });
      }

      const checkQuery = `
        SELECT 1 FROM Users WHERE email = ? OR username = ? LIMIT 1;
      `;
      const existingUser = await this.db.executeSQL(checkQuery, [
        email,
        username,
      ]);

      if (Array.isArray(existingUser) && existingUser.length > 0) {
        return res.status(409).json({
          type: 'error',
          message: 'Username or email already exists.',
        });
      }

      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])(?=.{8,40}$)/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          type: 'warning',
          message:
            'Password must be between 8 and 40 characters long and contain at least one number.',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const query = `
        INSERT INTO Users (username, email, password, role_id)
        VALUES (?, ?, ?, ?);
      `;
      const result: any = await this.db.executeSQL(query, [
        username,
        email,
        hashedPassword,
        defaultRoleId,
      ]);

      const userId = result.insertId;

      const roleQuery = `SELECT name FROM Roles WHERE id = ? LIMIT 1`;
      const roleResult: any = await this.db.executeSQL(roleQuery, [
        defaultRoleId,
      ]);
      const role = roleResult[0]?.name || 'user';

      const token = this.generateAccessToken(userId, username, role);

      return res.status(201).json({
        type: 'success',
        message: 'User registered successfully.',
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        type: 'error',
        message: 'Internal server error.',
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          type: 'error',
          message: 'Username and password are required.',
        });
      }

      const query = `
        SELECT u.id, u.username, u.password, r.name AS role
        FROM Users u
        JOIN Roles r ON u.role_id = r.id
        WHERE u.username = ? LIMIT 1;
      `;
      const results = await this.db.executeSQL(query, [username]);

      if (!Array.isArray(results) || results.length === 0) {
        return res.status(404).json({
          type: 'error',
          message: 'Invalid username or password.',
        });
      }

      const user = results[0];

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          type: 'error',
          message: 'Invalid credentials.',
        });
      }

      const token = this.generateAccessToken(user.id, user.username, user.role);

      return res.status(200).json({
        type: 'success',
        message: 'Login successful.',
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        type: 'error',
        message: 'Internal server error.',
      });
    }
  };

  changeUsername = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        console.log('[CHANGE USERNAME] Token missing');
        return res
          .status(401)
          .json({ type: 'error', message: 'Unauthorized. Token missing.' });
      }

      const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET || '123');
      const currentUsername = decoded.username;
      console.log(
        '[CHANGE USERNAME] Current username from token:',
        currentUsername
      );

      const { newUsername } = req.body;
      if (!newUsername) {
        console.log(
          '[CHANGE USERNAME] New username is missing in request body'
        );
        return res
          .status(400)
          .json({ type: 'error', message: 'New username is required.' });
      }

      const checkQuery = 'SELECT 1 FROM Users WHERE username = ? LIMIT 1;';
      const existingUser = await this.db.executeSQL(checkQuery, [newUsername]);
      console.log(
        '[CHANGE USERNAME] Check if new username exists:',
        existingUser
      );

      if (Array.isArray(existingUser) && existingUser.length > 0) {
        console.log(
          '[CHANGE USERNAME] New username already exists:',
          newUsername
        );
        return res.status(409).json({
          type: 'error',
          message: 'New username already exists.',
        });
      }

      const updateQuery = 'UPDATE Users SET username = ? WHERE username = ?;';
      const updateResult = await this.db.executeSQL(updateQuery, [
        newUsername,
        currentUsername,
      ]);
      console.log('[CHANGE USERNAME] Update result:', updateResult);

      const newToken = this.generateAccessToken(
        decoded.id,
        newUsername,
        decoded.role
      );
      console.log('[CHANGE USERNAME] New token generated:', newToken);

      return res.status(200).json({
        type: 'success',
        message: 'Username updated successfully.',
        token: newToken,
      });
    } catch (error) {
      console.error('[CHANGE USERNAME] Error:', error);
      return res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };

  changePassword = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        console.log('[CHANGE PASSWORD] Token missing');
        return res
          .status(401)
          .json({ message: 'Unauthorized. Token missing.' });
      }

      const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET || '123');
      const username = decoded.username;
      console.log('[CHANGE PASSWORD] Username from token:', username);

      const { currentPassword, newPassword } = req.body;
      console.log('[CHANGE PASSWORD] Received body:', {
        currentPassword,
        newPassword,
      });

      const query = 'SELECT password FROM Users WHERE username = ? LIMIT 1;';
      const results = await this.db.executeSQL(query, [username]);
      console.log('[CHANGE PASSWORD] User fetched from DB:', results);

      if (!Array.isArray(results) || results.length === 0) {
        console.log('[CHANGE PASSWORD] User not found in DB:', username);
        return res.status(404).json({ message: 'User not found.' });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      console.log(
        '[CHANGE PASSWORD] Is current password valid:',
        isPasswordValid
      );

      if (!isPasswordValid) {
        console.log(
          '[CHANGE PASSWORD] Invalid current password for user:',
          username
        );
        return res.status(401).json({ message: 'Invalid current password.' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updateQuery = 'UPDATE Users SET password = ? WHERE username = ?;';
      const updateResult = await this.db.executeSQL(updateQuery, [
        hashedPassword,
        username,
      ]);
      console.log('[CHANGE PASSWORD] Password update result:', updateResult);

      console.log('[CHANGE PASSWORD] Password updated for username:', username);
      res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
      console.error('[CHANGE PASSWORD] Error:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

  logout = (req: Request, res: Response) => {
    try {
      return res
        .status(200)
        .json({ type: 'success', message: 'Logged out successfully.' });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };

  deleteAccount = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res
          .status(401)
          .json({ type: 'error', message: 'Unauthorized. Token missing.' });
      }

      const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET || '123');
      const username = decoded.username;

      const deleteQuery = 'DELETE FROM Users WHERE username = ?;';
      await this.db.executeSQL(deleteQuery, [username]);

      return res
        .status(200)
        .json({ type: 'success', message: 'Account deleted successfully.' });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };
  getUserActivity = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      console.log('[GET USER ACTIVITY] Fetching activity for User ID:', userId);

      if (!userId) {
        return res.status(400).json({
          type: 'error',
          message: 'User ID is required.',
        });
      }

      const postsQuery = `
            SELECT p.ID as postId, p.Content as postContent, p.Creation_Date as postDate 
            FROM Posts p 
            WHERE p.User_ID = ?
            ORDER BY p.Creation_Date DESC
        `;

      const commentsQuery = `
            SELECT c.ID as commentId, c.Content as commentContent, c.Creation_Date as commentDate, 
                   p.ID as postId, p.Content as postContent
            FROM Comments c
            JOIN Posts p ON c.Post_ID = p.ID
            WHERE c.User_ID = ?
            ORDER BY c.Creation_Date DESC
        `;

      const posts = await this.db.executeSQL(postsQuery, [userId]);
      const comments = await this.db.executeSQL(commentsQuery, [userId]);

      if (!Array.isArray(posts) || !Array.isArray(comments)) {
        return res.status(500).json({
          type: 'error',
          message: 'Failed to fetch user activity.',
        });
      }

      res.status(200).json({
        type: 'success',
        activity: { posts, comments },
      });
      console.log('[GET USER ACTIVITY] Posts:', posts);
      console.log('[GET USER ACTIVITY] Comments:', comments);
    } catch (error) {
      console.error('[GET USER ACTIVITY] Error fetching user activity:', error);
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };
  assignRole = async (req: Request, res: Response) => {
    try {
      const { userId, role_id } = req.body;

      if (!userId || !role_id) {
        return res.status(400).json({
          type: 'error',
          message: 'User ID and role ID are required.',
        });
      }

      const query = `UPDATE Users SET role_id = ? WHERE id = ?;`;
      const result: any = await this.db.executeSQL(query, [role_id, userId]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          type: 'error',
          message: 'User not found.',
        });
      }

      res.status(200).json({
        type: 'success',
        message: 'Role assigned successfully.',
      });
    } catch (error) {
      console.error('[ASSIGN ROLE] Error:', error);
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };

  blockUser = async (req: Request, res: Response) => {
    try {
      const { userId, isBlocked } = req.body;

      if (!userId || isBlocked === undefined) {
        return res.status(400).json({
          type: 'error',
          message: 'User ID and block status are required.',
        });
      }

      const blockQuery = `UPDATE Users SET is_blocked = ? WHERE id = ?;`;
      await this.db.executeSQL(blockQuery, [isBlocked, userId]);

      if (isBlocked) {
        const deleteCommentsQuery = `DELETE FROM Comments WHERE User_ID = ?;`;
        const deletePostsQuery = `DELETE FROM Posts WHERE User_ID = ?;`;

        await this.db.executeSQL(deleteCommentsQuery, [userId]);
        await this.db.executeSQL(deletePostsQuery, [userId]);
      }

      res.status(200).json({
        type: 'success',
        message: isBlocked
          ? 'User blocked and content removed.'
          : 'User unblocked.',
      });
    } catch (error) {
      console.error('[BLOCK USER] Error:', error);
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };

  getRole = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res
          .status(400)
          .json({ type: 'error', message: 'User ID is required.' });
      }

      const query = `
        SELECT r.name AS role FROM Users u
        JOIN Roles r ON u.role_id = r.id
        WHERE u.id = ?;
      `;
      const role = await this.db.executeSQL(query, [userId]);

      res.status(200).json({
        type: 'success',
        role: role[0]?.role || 'user',
      });
    } catch (error) {
      console.error('[GET ROLE] Error:', error);
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };
  getAllUsers = async (_req: Request, res: Response) => {
    try {
      const query = `
        SELECT u.id, u.username, u.email, u.status, u.is_blocked, r.name AS role
        FROM Users u
        JOIN Roles r ON u.role_id = r.id;
      `;
      const users = await this.db.executeSQL(query);
      res.status(200).json({ type: 'success', users });
    } catch (error) {
      console.error('[GET ALL USERS] Error:', error);
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };
}
