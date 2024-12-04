'use client';

import { useState, useEffect } from 'react';
import { NewPost } from './NewPost';
import { Post } from './Post';
import axios from 'axios';
const API_URL = process.env.VITE_API_URL || "http://backend:3000";

interface PostType {
    id: number;
    username: string;
    content: string;
    creationDate: string;
    userId: number;
}

export default function CentralContent() {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

    useEffect(() => {
        fetchUserInfo();
        fetchPosts();
    }, []);

    const fetchUserInfo = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in localStorage');
            return;
        }

        try {
            const decoded: any = JSON.parse(atob(token.split('.')[1]));
            console.log('Decoded token:', decoded);
            setCurrentUserId(decoded.id);
            setCurrentUserRole(decoded.role);
        } catch (error) {
            console.error('[FETCH USER INFO] Error decoding token:', error);
        }
    };



    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${API_URL}/posts`);
            setPosts(response.data.posts);
        } catch (error) {
            console.error('[FETCH POSTS] Error:', error);
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
            console.error('[CREATE POST] Error:', error);
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
            console.error('[DELETE POST] Error:', error);
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
            console.error('[EDIT POST] Error:', error);
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
                    userRole={currentUserRole || ''}
                    currentUserId={currentUserId}
                    onDelete={handleDeletePost}
                    onEdit={handleEditPost}
                />

            ))}
        </div>
    );
}
