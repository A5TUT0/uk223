import { Request, Response, Express } from 'express';
import { UserController } from './user';

export class API {
  private app: Express;
  private userController: UserController;

  constructor(app: Express, userController: UserController) {
    this.app = app;
    this.userController = userController;
    this.setupRoutes();
  }

  private setupRoutes() {
    this.app.post('/register', (req: Request, res: Response) => {
      this.userController.register(req, res);
    });
    this.app.post('/login', (req: Request, res: Response) => {
      this.userController.login(req, res);
    });

    this.app.get('/test', (req: Request, res: Response) => {
      res.json({ status: 'API is running' });
    });
  }
}
