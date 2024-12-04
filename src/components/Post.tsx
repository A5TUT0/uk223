'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
const API_URL = process.env.VITE_API_URL || 3000;

interface CommentType {
    id: number;
    username: string;
    content: string;
    creationDate: string;
    userId: number;
}

interface PostProps {
    id: number;
    username: string;
    content: string;
    creationDate: string;
    isOwner: boolean;
    userRole: string;
    currentUserId: number | null;
    onDelete: (id: number) => void;
    onEdit: (id: number, newContent: string) => void;
}

export function Post({
    id,
    username,
    content,
    creationDate,
    isOwner,
    userRole,
    currentUserId,
    onDelete,
    onEdit,
}: PostProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [newComment, setNewComment] = useState('');
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        fetchComments();
        fetchVotes();
    }, []);

    const fetchComments = async () => {
        try {
            const response = await fetch(`${API_URL}/comments/${id}`);
            const data = await response.json();
            if (data.type === 'success') {
                setComments(data.comments);
            } else {
                console.error('[FETCH COMMENTS] Error:', data.message);
            }
        } catch (error) {
            console.error('[FETCH COMMENTS] Network error:', error);
        }
    };

    const fetchVotes = async () => {
        try {
            const response = await fetch(`${API_URL}/posts/${id}/votes`);
            const data = await response.json();
            if (data.type === 'success') {
                setLikes(data.likes);
                setDislikes(data.dislikes);
                setUserVote(data.userVote);
            } else {
                console.error('[FETCH VOTES] Error:', data.message);
            }
        } catch (error) {
            console.error('[FETCH VOTES] Network error:', error);
        }
    };

    const handleVote = async (vote: 'like' | 'dislike' | null) => {
        try {
            const response = await fetch(`${API_URL}/posts/${id}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ Is_Positive: vote === 'like' }),
            });

            if (response.ok) {
                fetchVotes();
            } else {
                console.error('[VOTE] Failed to vote.');
            }
        } catch (error) {
            console.error('[VOTE] Network error:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await fetch(`${API_URL}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ postId: id, content: newComment }),
            });
            const data = await response.json();
            if (data.type === 'success') {
                setComments([...comments, data.comment]);
                setNewComment('');
            } else {
                console.error('[ADD COMMENT] Error:', data.message);
            }
        } catch (error) {
            console.error('[ADD COMMENT] Network error:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-black text-white rounded-lg border border-gray-700 shadow-md">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xl font-semibold">{username}</p>
                    <small className="text-gray-500">
                        {new Date(creationDate).toLocaleString()}
                    </small>
                </div>
                {(isOwner || userRole === 'admin' || userRole === 'moderator') && (
                    <motion.div
                        className="flex space-x-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 focus:ring-2 focus:ring-blue-300 transition"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            Edit
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-500 focus:ring-2 focus:ring-red-300 transition"
                            onClick={() => onDelete(id)}
                        >
                            Delete
                        </motion.button>
                    </motion.div>
                )}
            </div>


            {/* Content */}
            <div className="mb-4">
                {isEditing ? (
                    <div className="space-y-3">
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-gray-500"
                        />
                        <div className="flex space-x-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
                                onClick={() => {
                                    onEdit(id, editedContent);
                                    setIsEditing(false);
                                }}
                            >
                                Save
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </motion.button>
                        </div>
                    </div>
                ) : (
                    <p className="text-lg font-medium">{content}</p>
                )}
            </div>

            {/* Likes/Dislikes and Comments */}
            <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition ${userVote === 'like' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'
                                } hover:bg-blue-500 focus:ring-2 focus:ring-blue-300`}
                            onClick={() => {
                                handleVote('like');
                                setUserVote('like');
                            }}
                        >
                            <ThumbsUp className="h-5 w-5" />
                            <span>{likes}</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition ${userVote === 'dislike' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'
                                } hover:bg-red-500 focus:ring-2 focus:ring-red-300`}
                            onClick={() => {
                                handleVote('dislike');
                                setUserVote('dislike');
                            }}
                        >
                            <ThumbsDown className="h-5 w-5" />
                            <span>{dislikes}</span>
                        </motion.button>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-600 transition"
                        onClick={() => setShowComments(!showComments)}
                    >
                        {showComments ? (
                            <>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
                                    />
                                </svg>
                                <span>Hide Comments</span>
                            </>
                        ) : (
                            <>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 15l7-7 7 7"
                                    />
                                </svg>
                                <span>Show Comments</span>
                            </>
                        )}
                    </motion.button>

                </div>

                {/* Comments Section */}
                {showComments && (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="p-3 bg-black rounded-md border border-gray-800"
                            >
                                <p className="font-semibold text-sm text-white">{comment.username}</p>
                                <p className="text-gray-300">{comment.content}</p>
                            </div>
                        ))}
                        <div className="flex space-x-2">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 p-3 bg-black border border-gray-800 rounded-md text-white focus:ring-2 focus:ring-white"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="px-4 py-2 bg-black text-white border border-gray-800 rounded-md hover:bg-gray-900 transition"
                                onClick={handleAddComment}
                            >
                                Add
                            </motion.button>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
}
