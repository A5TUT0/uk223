'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { LeftSidebar } from './LeftSidebar';

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
    const [activity, setActivity] = useState<UserActivity>({
        posts: [],
        comments: [],
    });

    const [loading, setLoading] = useState(true); // Para mostrar un indicador de carga

    useEffect(() => {
        fetchUserActivity();
    }, []);

    const fetchUserActivity = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/profile/activity', {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('[FETCH USER ACTIVITY] Response data:', response.data);

            if (response.data.type === 'success') {
                const activityData = response.data.activity;
                if (!Array.isArray(activityData.posts) || !Array.isArray(activityData.comments)) {
                    throw new Error('Invalid activity structure');
                }
                setActivity(activityData);
            }
        } catch (error) {
            console.error('Error fetching user activity:', error);
        } finally {
            setLoading(false); // Finaliza la carga
        }
    };

    return (
        <div className="flex">
            <div className="pr-10">
                <LeftSidebar />
            </div>

            <div className="pl-44 w-full">
                <h2 className="text-xl font-bold mb-4">Your Activity</h2>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <section>
                            <h3 className="text-lg font-semibold">Posts</h3>
                            {activity.posts.length > 0 ? (
                                activity.posts.map((post) => (
                                    <div key={post.postId} className="p-2 border-b border-gray-300">
                                        <p className="font-semibold">{post.postContent}</p>
                                        <small className="text-gray-500">
                                            {new Date(post.postDate).toLocaleString()}
                                        </small>
                                    </div>
                                ))
                            ) : (
                                <p>No posts available</p>
                            )}
                        </section>

                        <section className="mt-4">
                            <h3 className="text-lg font-semibold">Comments</h3>
                            {activity.comments.length > 0 ? (
                                activity.comments.map((comment) => (
                                    <div
                                        key={comment.commentId}
                                        className="p-2 border-b border-gray-300"
                                    >
                                        <p className="font-semibold">{comment.commentContent}</p>
                                        <p className="text-sm text-gray-500">
                                            On post: <span className="italic">{comment.postContent}</span>
                                        </p>
                                        <small className="text-gray-500">
                                            {new Date(comment.commentDate).toLocaleString()}
                                        </small>
                                    </div>
                                ))
                            ) : (
                                <p>No comments available</p>
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}
