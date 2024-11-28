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
  generateAccessToken(username: string) {
    return jwt.sign({ username }, process.env.TOKEN_SECRET || '123', {
      expiresIn: '10000d',
    });
  }
  register = async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          error: 'ValidationError',
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
          error: 'ConflictError',
          message: 'Username or email already exists.',
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = `
      INSERT INTO Users (username, email, password)
      VALUES (?, ?, ?);
    `;
      const value = [username, email, hashedPassword];
      this.db.executeSQL(query, value);
      const token = this.generateAccessToken(username);
      return res.status(201).json({
        message: 'User registered successfully.',
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'ServerError',
        message: 'Internal server error.',
      });
    }
  };
  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          error: 'ValidationError',
          message: 'Username and password are required.',
        });
      }

      const query = `
        SELECT username, email, password
        FROM Users
        WHERE username = ? LIMIT 1;
      `;
      const results = await this.db.executeSQL(query, username);

      if (!Array.isArray(results) || results.length === 0) {
        return res.status(404).json({
          error: 'NotFoundError',
          message: 'Invalid User or Password.',
        });
      }

      const user = results[0];

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'UnauthorizedError',
          message: 'Invalid credentials.',
        });
      }
      const token = this.generateAccessToken(user.username);

      return res.status(200).json({
        message: 'Login successful.',
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'ServerError',
        message: 'Internal server error.',
      });
    }
  };
}
