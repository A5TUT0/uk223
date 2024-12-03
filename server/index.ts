import express from 'express';
import cors from 'cors';
import { API } from './class/api';
import { UserController } from './class/user';
import { PostController } from './class/PostController';
import { CommentController } from './class/CommentController';
import { Database } from './class/db';

const db = new Database();

const userController = new UserController(db);
const postController = new PostController(db);
const commentController = new CommentController(db);

const app = express();
app.use(cors());
app.use(express.json());

new API(app, userController, postController, commentController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
