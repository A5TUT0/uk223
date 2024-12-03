import { Request, Response } from 'express';
import { Database } from './db';

export class PostController {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  // Crear un nuevo post
  createPost = async (req: Request, res: Response) => {
    try {
      const { content } = req.body;
      const userId = req.user?.id;

      if (!content || !userId) {
        return res
          .status(400)
          .json({ type: 'error', message: 'Content and user are required.' });
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

  // Obtener todos los posts
  // Controlador backend
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
          ORDER BY p.Creation_Date DESC; -- Ordenar cronológicamente
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

  // Actualizar un post
  updatePost = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const { content } = req.body;

      if (!content || content.trim() === '') {
        return res
          .status(400)
          .json({ type: 'error', message: 'Content is required.' });
      }

      const query = `UPDATE Posts SET Content = ? WHERE ID = ? AND User_ID = ?`;
      const result: any = await this.db.executeSQL(query, [
        content,
        id,
        userId,
      ]);

      if (result.affectedRows === 0) {
        return res.status(403).json({
          type: 'error',
          message: 'Not authorized to update this post.',
        });
      }

      res.status(200).json({
        type: 'success',
        message: 'Post updated successfully.',
      });
    } catch (error) {
      console.error('[UPDATE POST] Error updating post:', error);
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };

  // Eliminar un post
  deletePost = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      const deleteCommentsQuery = `DELETE FROM Comments WHERE Post_ID = ?`;
      await this.db.executeSQL(deleteCommentsQuery, [id]);

      const deleteVotesQuery = `DELETE FROM Votes WHERE Post_ID = ?`;
      await this.db.executeSQL(deleteVotesQuery, [id]);

      const deletePostQuery = `DELETE FROM Posts WHERE ID = ? AND User_ID = ?`;
      const result: any = await this.db.executeSQL(deletePostQuery, [
        id,
        userId,
      ]);

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
      console.error('[DELETE POST] Error deleting post:', error);
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };

  // Votar una publicación
  votePost = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const { Is_Positive } = req.body;

      console.log('[VOTE POST] Received postId:', id); // Confirma que el ID está llegando
      console.log('[VOTE POST] Received Is_Positive:', Is_Positive); // Confirma el valor del voto

      if (!id) {
        return res.status(400).json({
          type: 'error',
          message: 'Post ID is required.',
        });
      }

      if (Is_Positive === undefined) {
        return res.status(400).json({
          type: 'error',
          message: 'Vote type is required.',
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
  // Obtener votos de una publicación
  getVotes = async (req: Request, res: Response) => {
    try {
      const { id } = req.params; // ID del post

      console.log('[GET VOTES] Fetching votes for Post ID:', id);

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
      console.error('[GET VOTES] Error fetching votes:', error);
      res
        .status(500)
        .json({ type: 'error', message: 'Internal server error.' });
    }
  };
}
