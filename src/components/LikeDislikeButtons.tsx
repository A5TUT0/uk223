'use client';

import { useState, useEffect } from 'react';
import Like from './ui/likeButton';
import Dislike from './ui/dislikeButton';

interface LikeDislikeButtonsProps {
    postId: number;
    initialLikes: number;
    initialDislikes: number;
    userVote: 'like' | 'dislike' | null;
    onVote: (vote: 'like' | 'dislike' | null) => void;
}

export function LikeDislikeButtons({
    postId,
    initialLikes,
    initialDislikes,
    userVote,
    onVote,
}: LikeDislikeButtonsProps) {
    const [currentVote, setCurrentVote] = useState<'like' | 'dislike' | null>(userVote);

    useEffect(() => {
        setCurrentVote(userVote);
    }, [userVote]);

    const handleVote = (vote: 'like' | 'dislike') => {
        console.log('[HANDLE VOTE] Received postId:', postId);
        console.log('[HANDLE VOTE] Vote type:', vote);

        if (currentVote === vote) {
            setCurrentVote(null);
            onVote(null);
        } else {
            setCurrentVote(vote);
            onVote(vote);
        }
    };

    return (
        <div className="flex space-x-4 items-center">
            <button
                className={`text-gray-500 hover:text-green-500 ${currentVote === 'like' ? 'text-green-500' : ''}`}
                onClick={() => handleVote('like')}
            >
                <Like /> {initialLikes}
            </button>
            <button
                className={`text-gray-500 hover:text-red-500 ${currentVote === 'dislike' ? 'text-red-500' : ''}`}
                onClick={() => handleVote('dislike')}
            >
                <Dislike /> {initialDislikes}
            </button>
        </div>
    );
}
