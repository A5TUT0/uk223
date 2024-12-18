import express, { Express, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateToken, authorizeRole } from './authMiddleware.js';
import { UserController } from './user.js';
import { PostController } from './PostController.js';
import { CommentController } from './CommentController.js';

export class API {
  private app: Express;
  private userController: UserController;
  private postController: PostController;
  private commentController: CommentController;

  constructor(
    app: Express,
    userController: UserController,
    postController: PostController,
    commentController: CommentController
  ) {
    this.app = app;
    this.userController = userController;
    this.postController = postController;
    this.commentController = commentController;

    this.setupRoutes();
  }

  private setupRoutes() {
    this.app.post('/register', (req: Request, res: Response) =>
      this.userController.register(req, res)
    );

    this.app.post('/login', (req: Request, res: Response) =>
      this.userController.login(req, res)
    );

    this.app.post('/change-username', authenticateToken, (req, res) =>
      this.userController.changeUsername(req, res)
    );
    this.app.post('/logout', authenticateToken, (req, res) =>
      this.userController.logout(req, res)
    );

    this.app.post('/change-password', authenticateToken, (req, res) =>
      this.userController.changePassword(req, res)
    );

    this.app.delete('/delete-account', authenticateToken, (req, res) =>
      this.userController.deleteAccount(req, res)
    );

    this.app.get('/profile/activity', authenticateToken, (req, res) =>
      this.userController.getUserActivity(req, res)
    );

    this.app.get(
      '/users',
      authenticateToken,
      authorizeRole(['admin']),
      (req, res) => this.userController.getAllUsers(req, res)
    );

    this.app.put(
      '/users/block',
      authenticateToken,
      authorizeRole(['admin']),
      (req, res) => this.userController.blockUser(req, res)
    );

    this.app.put(
      '/users/assign-role',
      authenticateToken,
      authorizeRole(['admin']),
      (req, res) => this.userController.assignRole(req, res)
    );

    this.app.post('/posts', authenticateToken, (req, res) =>
      this.postController.createPost(req, res)
    );

    this.app.get('/posts', (req, res) =>
      this.postController.getPosts(req, res)
    );

    this.app.put('/posts/:id', authenticateToken, (req, res) =>
      this.postController.updatePost(req, res)
    );

    this.app.delete('/posts/:id', authenticateToken, (req, res) =>
      this.postController.deletePost(req, res)
    );

    this.app.post('/posts/:id/vote', authenticateToken, (req, res) =>
      this.postController.votePost(req, res)
    );

    this.app.get('/posts/:id/votes', (req, res) =>
      this.postController.getVotes(req, res)
    );

    this.app.post('/comments', authenticateToken, (req, res) =>
      this.commentController.createComment(req, res)
    );

    this.app.put('/comments/:id', authenticateToken, (req, res) =>
      this.commentController.editComment(req, res)
    );

    this.app.delete('/comments/:id', authenticateToken, (req, res) =>
      this.commentController.deleteComment(req, res)
    );

    this.app.get('/comments/:postId', (req, res) =>
      this.commentController.getComments(req, res)
    );
  }
}
