import { Request, Response } from 'express';
import { Database } from './db';

export class CommentController {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  createComment = async (req: Request, res: Response) => {
    try {
      const { postId, content } = req.body;
      const userId = req.user?.id;

      if (!postId || !content) {
        return res.status(400).json({
          type: 'error',
          message: 'Post ID and content are required.',
        });
      }

      const userQuery = `SELECT is_blocked FROM Users WHERE id = ? LIMIT 1;`;
      const [user]: any = await this.db.executeSQL(userQuery, [userId]);

      if (user.is_blocked) {
        return res.status(403).json({
          type: 'error',
          message: 'User is blocked and cannot create comments.',
        });
      }

      const query = `INSERT INTO Comments (User_ID, Post_ID, Content) VALUES (?, ?, ?)`;
      const result: any = await this.db.executeSQL(query, [
        userId,
        postId,
        content,
      ]);

      res.status(201).json({
        type: 'success',
        comment: {
          id: result.insertId,
          userId,
          postId,
          content,
          creationDate: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('[CREATE COMMENT] Error:', error);
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };

  editComment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!content) {
        return res
          .status(400)
          .json({ type: 'error', message: 'Content is required.' });
      }

      let query: string;
      let params: any[];

      if (userRole === 'moderator' || userRole === 'admin') {
        query = `UPDATE Comments SET Content = ? WHERE ID = ?`;
        params = [content, id];
      } else {
        query = `UPDATE Comments SET Content = ? WHERE ID = ? AND User_ID = ?`;
        params = [content, id, userId];
      }

      const result: any = await this.db.executeSQL(query, params);

      if (result.affectedRows === 0) {
        return res.status(403).json({
          type: 'error',
          message: 'Not authorized to edit this comment.',
        });
      }

      res
        .status(200)
        .json({ type: 'success', message: 'Comment updated successfully.' });
    } catch (error) {
      console.error('[EDIT COMMENT] Error:', error);
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };

  deleteComment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      let query: string;
      let params: any[];

      if (userRole === 'moderator' || userRole === 'admin') {
        query = `DELETE FROM Comments WHERE ID = ?`;
        params = [id];
      } else {
        query = `DELETE FROM Comments WHERE ID = ? AND User_ID = ?`;
        params = [id, userId];
      }

      const result: any = await this.db.executeSQL(query, params);

      if (result.affectedRows === 0) {
        return res.status(403).json({
          type: 'error',
          message: 'Not authorized to delete this comment.',
        });
      }

      res.status(200).json({
        type: 'success',
        message: 'Comment deleted successfully.',
      });
    } catch (error) {
      console.error('[DELETE COMMENT] Error:', error);
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };

  getComments = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;

      const query = `
        SELECT c.ID as id, c.Content as content, c.Creation_Date as creationDate,
               u.username as username, c.User_ID as userId
        FROM Comments c
        JOIN Users u ON c.User_ID = u.ID
        WHERE c.Post_ID = ?
        ORDER BY c.Creation_Date ASC
      `;
      const comments = await this.db.executeSQL(query, [postId]);

      res.status(200).json({ type: 'success', comments });
    } catch (error) {
      console.error('[GET COMMENTS] Error:', error);
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };
}
