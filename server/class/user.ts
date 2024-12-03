//import { TUser } from '../types';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Database } from './db';
import { Request, Response } from 'express';
dotenv.config();

//const currentDate: Date = new Date();
//const formattedDate: string = format(currentDate, 'dd MMM yyyy');
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
  generateAccessToken(userId: number, username: string) {
    return jwt.sign(
      { id: userId, username }, // Incluye tanto el id como el username
      process.env.TOKEN_SECRET || 'secret',
      { expiresIn: '10d' } // Ajusta el tiempo según tu necesidad
    );
  }

  register = async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          type: 'error',
          message: 'All fields are required.',
        });
      }

      const checkQuery =
        'SELECT 1 FROM Users WHERE email = ? OR username = ? LIMIT 1;';
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
        INSERT INTO Users (username, email, password)
        VALUES (?, ?, ?);
      `;
      const result: any = await this.db.executeSQL(query, [
        username,
        email,
        hashedPassword,
      ]);

      const userId = result.insertId; // Recupera el id del usuario recién creado

      const token = this.generateAccessToken(userId, username);

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
        SELECT id, username, password
        FROM Users
        WHERE username = ? LIMIT 1;
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

      const token = this.generateAccessToken(user.id, user.username);

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
        return res
          .status(401)
          .json({ type: 'error', message: 'Unauthorized. Token missing.' });
      }

      const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET || '123');
      const currentUsername = decoded.username;

      const { newUsername } = req.body;
      if (!newUsername) {
        return res
          .status(400)
          .json({ type: 'error', message: 'New username is required.' });
      }

      const checkQuery = 'SELECT 1 FROM Users WHERE username = ? LIMIT 1;';
      const existingUser = await this.db.executeSQL(checkQuery, [newUsername]);
      if (Array.isArray(existingUser) && existingUser.length > 0) {
        return res.status(409).json({
          type: 'error',
          message: 'New username already exists.',
        });
      }

      const updateQuery = 'UPDATE Users SET username = ? WHERE username = ?;';
      await this.db.executeSQL(updateQuery, [newUsername, currentUsername]);

      // Generar nuevo token
      const newToken = this.generateAccessToken(newUsername);

      return res.status(200).json({
        type: 'success',
        message: 'Username updated successfully.',
        token: newToken,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };

  // Cambiar Contraseña
  changePassword = async (req: Request, res: Response) => {
    try {
      // Extrae el token del encabezado de autorización
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res
          .status(401)
          .json({ type: 'error', message: 'Unauthorized. Token missing.' });
      }

      // Verifica y decodifica el token
      const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET || '123');
      const username = decoded.username; // Extrae el username del token

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          type: 'error',
          message: 'Current and new passwords are required.',
        });
      }

      // Verifica si el usuario existe
      const query = 'SELECT password FROM Users WHERE username = ? LIMIT 1;';
      const results = await this.db.executeSQL(query, [username]);

      if (!Array.isArray(results) || results.length === 0) {
        return res
          .status(404)
          .json({ type: 'error', message: 'User not found.' });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ type: 'error', message: 'Invalid current password.' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updateQuery = 'UPDATE Users SET password = ? WHERE username = ?;';
      await this.db.executeSQL(updateQuery, [hashedPassword, username]);

      return res
        .status(200)
        .json({ type: 'success', message: 'Password updated successfully.' });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };

  // Cerrar Sesión
  logout = (req: Request, res: Response) => {
    try {
      // Invalida el token en el cliente (se maneja en el frontend)
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

  // Borrar Cuenta
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
      const userId = req.user?.id; // ID del usuario autenticado

      console.log('[GET USER ACTIVITY] Fetching activity for User ID:', userId);

      if (!userId) {
        return res.status(400).json({
          type: 'error',
          message: 'User ID is required.',
        });
      }

      // Consulta para obtener publicaciones del usuario
      const postsQuery = `
            SELECT p.ID as postId, p.Content as postContent, p.Creation_Date as postDate 
            FROM Posts p 
            WHERE p.User_ID = ?
            ORDER BY p.Creation_Date DESC
        `;

      // Consulta para obtener comentarios del usuario
      const commentsQuery = `
            SELECT c.ID as commentId, c.Content as commentContent, c.Creation_Date as commentDate, 
                   p.ID as postId, p.Content as postContent
            FROM Comments c
            JOIN Posts p ON c.Post_ID = p.ID
            WHERE c.User_ID = ?
            ORDER BY c.Creation_Date DESC
        `;

      // Ejecuta las consultas y asegúrate de que devuelven arrays
      const posts = await this.db.executeSQL(postsQuery, [userId]);
      const comments = await this.db.executeSQL(commentsQuery, [userId]);

      // Valida que sean arrays
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
}
