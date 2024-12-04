'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { LeftSidebar } from './LeftSidebar';
const API_URL = process.env.VITE_API_URL || "http://backend:3000";

interface Post {
    postId: number;
    postContent: string;
    postDate: string;
}

interface Comment {
    commentId: number;
    commentContent: string;
    commentDate: string;
    postId: number;
    postContent: string;
}

interface UserActivity {
    posts: Post[];
    comments: Comment[];
}

export default function ProfileActivity() {
    const [activity, setActivity] = useState<UserActivity>({ posts: [], comments: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserActivity();
    }, []);

    const fetchUserActivity = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/profile/activity`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.type === 'success') {
                setActivity(response.data.activity);
            }
        } catch (error) {
            console.error('Error fetching user activity:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex min-h-screen"
            style={{ color: '#FFFFFF' }}
        >
            {/* Sidebar */}
            <div
                className="pr-10 min-w-[250px]"
            >
                <div className="p-4">
                    <LeftSidebar />
                </div>
            </div>

            {/* Main Content */}
            <div className="pl-12 w-full p-6">
                <h2
                    className="text-2xl font-bold mb-6 pb-2"
                    style={{ borderBottom: `1px solid #4B5563` }}
                >
                    Your Activity
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div
                            className="animate-spin rounded-full h-10 w-10"
                            style={{
                                borderTop: '2px solid #FFFFFF',
                                borderRight: '2px solid transparent',
                            }}
                        ></div>
                    </div>
                ) : (
                    <>
                        {/* Posts Section */}
                        <section className="mb-8">
                            <h3 className="text-xl font-semibold mb-4">Posts</h3>
                            {activity.posts.length > 0 ? (
                                activity.posts.map((post) => (
                                    <div
                                        key={post.postId}
                                        className="p-4 rounded-lg shadow-md mb-4"
                                        style={{
                                            backgroundColor: '#000000',
                                            border: `1px solid #4B5563`,
                                        }}
                                    >
                                        <p className="font-semibold">{post.postContent}</p>
                                        <small style={{ color: '#4B5563' }}>
                                            {new Date(post.postDate).toLocaleString()}
                                        </small>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#4B5563' }}>No posts available.</p>
                            )}
                        </section>

                        {/* Comments Section */}
                        <section>
                            <h3 className="text-xl font-semibold mb-4">Comments</h3>
                            {activity.comments.length > 0 ? (
                                activity.comments.map((comment) => (
                                    <div
                                        key={comment.commentId}
                                        className="p-4 rounded-lg shadow-md mb-4"
                                        style={{
                                            backgroundColor: '#000000',
                                            border: `1px solid #4B5563`,
                                        }}
                                    >
                                        <p className="font-semibold">{comment.commentContent}</p>
                                        <p className="text-sm" style={{ color: '#4B5563' }}>
                                            On post: <span className="italic">{comment.postContent}</span>
                                        </p>
                                        <small style={{ color: '#4B5563' }}>
                                            {new Date(comment.commentDate).toLocaleString()}
                                        </small>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#4B5563' }}>No comments available.</p>
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}
