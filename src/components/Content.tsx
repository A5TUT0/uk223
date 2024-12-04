'use client';

import { useEffect, useState } from 'react';
import { NewPost } from './NewPost';
import { Post } from './Post';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface PostType {
    id: number;
    username: string;
    content: string;
    creationDate: string;
    userId: number;
}

export default function Content() {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        fetchUserId();
        fetchPosts();
    }, []);

    const fetchUserId = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded: any = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(decoded.id);
    };

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${API_URL}/posts`);
            const sortedPosts = response.data.posts.sort(
                (a: PostType, b: PostType) =>
                    new Date(b.creationDate).getTime() -
                    new Date(a.creationDate).getTime()
            );
            setPosts(sortedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };


    const handleNewPost = async (content: string) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.post(
                `${API_URL}/posts`,
                { content },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.type === 'success') {
                setPosts([response.data.post, ...posts]);
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleDeletePost = async (id: number) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await axios.delete(`${API_URL}/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts(posts.filter((post) => post.id !== id));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleEditPost = async (id: number, newContent: string) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.put(
                `${API_URL}/posts/${id}`,
                { content: newContent },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.type === 'success') {
                setPosts(
                    posts.map((post) =>
                        post.id === id ? { ...post, content: newContent } : post
                    )
                );
            }
        } catch (error) {
            console.error('Error editing post:', error);
        }
    };

    return (
        <div>
            <NewPost onSubmit={handleNewPost} />
            {posts.map((post) => (
                <Post
                    key={post.id}
                    {...post}
                    isOwner={currentUserId === post.userId}
                    canModerate={currentUserRole === 'admin' || currentUserRole === 'moderator'}
                    onDelete={handleDeletePost}
                    onEdit={handleEditPost}
                />

            ))}
        </div>
    );
}
