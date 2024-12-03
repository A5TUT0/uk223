'use client';

import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Comment } from './Comment';
import { LikeDislikeButtons } from './LikeDislikeButtons';

interface PostProps {
    id: number;
    username: string;
    content: string;
    creationDate: string;
    isOwner: boolean;
    onDelete: (id: number) => void;
    onEdit: (id: number, newContent: string) => void;
}

interface DecodedToken {
    id: number;
    username: string;
    exp: number;
}

export function Post({ id, username, content, creationDate, isOwner, onDelete, onEdit }: PostProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded: DecodedToken = jwtDecode(token);
                    setCurrentUserId(decoded.id);
                } catch (error) {
                    console.error('[DECODE TOKEN] Failed to decode token:', error);
                }
            }
            await fetchComments();
            await fetchVotes();
        };

        fetchInitialData();
    }, []);

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:3000/comments/${id}`);
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
            const response = await fetch(`http://localhost:3000/posts/${id}/votes`);
            if (!response.ok) {
                console.error('[FETCH VOTES] Failed to fetch votes:', response.status);
                return;
            }
            const data = await response.json();
            if (data.type === 'success') {
                setLikes(data.likes);
                setDislikes(data.dislikes);
                setUserVote(data.userVote);
            }
        } catch (error) {
            console.error('[FETCH VOTES] Network error:', error);
        }
    };

    const handleVote = async (vote: 'like' | 'dislike' | null) => {
        try {
            const response = await fetch(`http://localhost:3000/posts/${id}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ Is_Positive: vote === 'like' }),
            });

            if (response.ok) {
                await fetchVotes(); // Refresh votes after successful operation
            } else {
                console.error('[VOTE] Failed to vote on post.');
            }
        } catch (error) {
            console.error('[VOTE] Network error:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const response = await fetch('http://localhost:3000/comments', {
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

    const handleEditComment = async (commentId: number, newContent: string) => {
        try {
            const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ content: newContent }),
            });
            if (response.ok) {
                setComments(
                    comments.map((comment) =>
                        comment.id === commentId ? { ...comment, content: newContent } : comment
                    )
                );
            } else {
                console.error('[EDIT COMMENT] Failed to edit comment.');
            }
        } catch (error) {
            console.error('[EDIT COMMENT] Network error:', error);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                setComments(comments.filter((comment) => comment.id !== commentId));
            } else {
                console.error('[DELETE COMMENT] Failed to delete comment.');
            }
        } catch (error) {
            console.error('[DELETE COMMENT] Network error:', error);
        }
    };

    return (
        <Card className="mb-4 bg-black text-white border border-gray-800 shadow-lg">
            <CardHeader className="border-b border-gray-700 pb-2">
                <p className="font-semibold text-lg text-white">{username}</p>
                <small className="text-gray-400 text-sm">
                    {new Date(creationDate).toLocaleString()}
                </small>
            </CardHeader>
            <CardContent className="p-4">
                {isEditing ? (
                    <div className="space-y-3">
                        <Input
                            className="bg-gray-900 text-white border-gray-700 focus:ring-2 focus:ring-gray-500"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <div className="flex space-x-2">
                            <Button
                                className="bg-gray-700 hover:bg-gray-600 text-white"
                                onClick={() => {
                                    onEdit(id, editedContent);
                                    setIsEditing(false);
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                className="bg-gray-900 text-gray-400 hover:text-white"
                                variant="ghost"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-300">{content}</p>
                )}
                {isOwner && (
                    <div className="mt-4 flex space-x-3">
                        <Button
                            className="bg-gray-800 hover:bg-gray-700 text-white"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </Button>
                        <Button
                            className="bg-red-600 hover:bg-red-500 text-white"
                            variant="destructive"
                            onClick={() => onDelete(id)}
                        >
                            Delete
                        </Button>
                    </div>
                )}
                <div className="mt-4">
                    <LikeDislikeButtons
                        postId={id}
                        initialLikes={likes}
                        initialDislikes={dislikes}
                        userVote={userVote}
                        onVote={handleVote}
                    />
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Comments</h3>
                    <div className="mt-4">
                        {comments.map((comment) => (
                            <Comment
                                key={comment.id}
                                {...comment}
                                isOwner={currentUserId === comment.userId}
                                onEdit={(commentId, newContent) => handleEditComment(commentId, newContent)}
                                onDelete={handleDeleteComment}
                            />
                        ))}
                    </div>
                    <div className="mt-4 flex space-x-2">
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="bg-gray-900 text-white border-gray-700 focus:ring-2 focus:ring-gray-500 flex-1"
                        />
                        <Button
                            onClick={handleAddComment}
                            className="bg-blue-600 hover:bg-blue-500 text-white"
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
