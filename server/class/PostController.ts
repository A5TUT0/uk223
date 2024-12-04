import { Request, Response } from 'express';
import { Database } from './db';

export class PostController {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  createPost = async (req: Request, res: Response) => {
    try {
      const { content } = req.body;
      const userId = req.user?.id;

      if (!content || !userId) {
        return res
          .status(400)
          .json({ type: 'error', message: 'Content and user are required.' });
      }

      const userQuery = `SELECT is_blocked FROM Users WHERE id = ? LIMIT 1;`;
      const [user]: any = await this.db.executeSQL(userQuery, [userId]);

      if (user.is_blocked) {
        return res.status(403).json({
          type: 'error',
          message: 'User is blocked and cannot create posts.',
        });
      }

      const query = `INSERT INTO Posts (User_ID, Content) VALUES (?, ?)`;
      const result: any = await this.db.executeSQL(query, [userId, content]);

      res.status(201).json({
        type: 'success',
        post: {
          id: result.insertId,
          userId,
          content,
          creationDate: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('[CREATE POST] Error:', error);
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };

  getPosts = async (_req: Request, res: Response) => {
    try {
      const query = `
          SELECT p.ID as id, u.username, p.Content as content, p.Creation_Date as creationDate, p.User_ID as userId,
                 COUNT(CASE WHEN v.Is_Positive = true THEN 1 END) as likes,
                 COUNT(CASE WHEN v.Is_Positive = false THEN 1 END) as dislikes
          FROM Posts p
          LEFT JOIN Votes v ON p.ID = v.Post_ID
          JOIN Users u ON p.User_ID = u.id
          GROUP BY p.ID
          ORDER BY p.Creation_Date DESC;
      `;
      const posts = await this.db.executeSQL(query);
      res.status(200).json({ type: 'success', posts });
    } catch (error) {
      console.error('[GET POSTS] Error fetching posts:', error);
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };

  updatePost = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user?.id;

      if (!content || !id) {
        return res.status(400).json({
          type: 'error',
          message: 'Content and post ID are required.',
        });
      }

      const query =
        req.user?.role === 'user'
          ? `UPDATE Posts SET Content = ? WHERE ID = ? AND User_ID = ?`
          : `UPDATE Posts SET Content = ? WHERE ID = ?`;

      const result: any =
        req.user?.role === 'user'
          ? await this.db.executeSQL(query, [content, id, userId])
          : await this.db.executeSQL(query, [content, id]);

      if (result.affectedRows === 0) {
        return res.status(403).json({
          type: 'error',
          message: 'Not authorized to edit this post.',
        });
      }

      res.status(200).json({
        type: 'success',
        message: 'Post updated successfully.',
      });
    } catch (error) {
      console.error('[UPDATE POST] Error:', error);
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };

  deletePost = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      let query: string;
      let params: any[];

      if (userRole === 'moderator' || userRole === 'admin') {
        query = `DELETE FROM Posts WHERE ID = ?`;
        params = [id];
      } else {
        query = `DELETE FROM Posts WHERE ID = ? AND User_ID = ?`;
        params = [id, userId];
      }

      const result: any = await this.db.executeSQL(query, params);

      if (result.affectedRows === 0) {
        return res.status(403).json({
          type: 'error',
          message: 'Not authorized to delete this post.',
        });
      }

      res.status(200).json({
        type: 'success',
        message: 'Post deleted successfully.',
      });
    } catch (error) {
      console.error('[DELETE POST] Error:', error);
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };

  votePost = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { Is_Positive } = req.body;
      const userId = req.user?.id;

      if (!id || Is_Positive === undefined) {
        return res.status(400).json({
          type: 'error',
          message: 'Post ID and vote type are required.',
        });
      }

      const query = `
            INSERT INTO Votes (Post_ID, User_ID, Is_Positive)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE Is_Positive = VALUES(Is_Positive)
        `;
      await this.db.executeSQL(query, [id, userId, Is_Positive]);

      res.status(200).json({
        type: 'success',
        message: Is_Positive ? 'Liked the post.' : 'Disliked the post.',
      });
    } catch (error) {
      console.error('[VOTE POST] Error:', error);
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };

  getVotes = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const query = `
          SELECT 
              COUNT(CASE WHEN Is_Positive = true THEN 1 END) as likes,
              COUNT(CASE WHEN Is_Positive = false THEN 1 END) as dislikes
          FROM Votes
          WHERE Post_ID = ?
      `;
      const [votes]: any = await this.db.executeSQL(query, [id]);

      res.status(200).json({
        type: 'success',
        likes: votes.likes || 0,
        dislikes: votes.dislikes || 0,
      });
    } catch (error) {
      console.error('[GET VOTES] Error:', error);
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };
}
