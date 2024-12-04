import mysql from 'mysql2/promise';
import {
  USER_TABLE,
  POSTS_TABLE,
  COMMENTS_TABLE,
  VOTES_TABLE,
  ROLES_TABLE,
  PERMISSIONS_TABLE,
  ROLE_PERMISSIONS_TABLE,
  DEFAULT_ROLE,
  INSERT_USERS,
  DEFAULT_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
} from '../types/schema.js';

export class Database {
  // Properties
  private _pool: mysql.Pool;

  // Constructor
  constructor() {
    this._pool = mysql.createPool({
      database: process.env.DB_NAME || 'minitwitter',
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'minitwitter',
      password: process.env.DB_PASSWORD || 'supersecret123',
      connectionLimit: 5,
    });
    this.initializeDBSchema();
  }

  // Methods
  private initializeDBSchema = async () => {
    console.log('Initializing DB schema...');
    await this.executeSQL(ROLES_TABLE);
    await this.executeSQL(USER_TABLE);
    await this.executeSQL(PERMISSIONS_TABLE);
    await this.executeSQL(ROLE_PERMISSIONS_TABLE);
    await this.executeSQL(POSTS_TABLE);
    await this.executeSQL(COMMENTS_TABLE);
    await this.executeSQL(VOTES_TABLE);
    await this.executeSQL(DEFAULT_ROLE);
    await this.executeSQL(INSERT_USERS);
    await this.executeSQL(DEFAULT_PERMISSIONS);
    await this.executeSQL(DEFAULT_ROLE_PERMISSIONS);
  };

  public executeSQL = async (query: string, values?: any[]) => {
    try {
      const conn = await this._pool.getConnection();
      try {
        const [results] = await conn.query(query, values);
        return results;
      } finally {
        conn.release();
      }
    } catch (err) {
      console.error('Error executing query:', err);
    }
  };
}
