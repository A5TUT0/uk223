import express from 'express';
import cors from 'cors';
import { API } from './class/api.js';
import { UserController } from './class/user.js';
import { PostController } from './class/PostController.js';
import { CommentController } from './class/CommentController.js';
import { Database } from './class/db.js';

const db = new Database();

const userController = new UserController(db);
const postController = new PostController(db);
const commentController = new CommentController(db);

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

new API(app, userController, postController, commentController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
