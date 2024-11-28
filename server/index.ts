import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Database, UserController, API } from './class';
dotenv.config();

class Backend {
  public app: Express;
  private database: Database;
  private userController: UserController;
  private api: API;

  constructor() {
    this.app = express();
    this.database = new Database();
    this.userController = new UserController(this.database);
    this.setupMiddleware();
    this.api = new API(this.app, this.userController);
    this.startServer();
  }

  private setupMiddleware() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private startServer() {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(`Server running on port 3000`);
    });
  }
}

const backend = new Backend();
export const viteNodeApp = backend.app;
