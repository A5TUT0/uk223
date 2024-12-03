'use client';

import { useState, useEffect } from 'react';

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
        setCurrentVote(userVote); // Sync with parent state if userVote changes
    }, [userVote]);

    const handleVote = (vote: 'like' | 'dislike') => {
        console.log('[HANDLE VOTE] Received postId:', postId);
        console.log('[HANDLE VOTE] Vote type:', vote);

        if (currentVote === vote) {
            // Undo vote
            setCurrentVote(null);
            onVote(null);
        } else {
            // Set new vote
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
                👍 {initialLikes}
            </button>
            <button
                className={`text-gray-500 hover:text-red-500 ${currentVote === 'dislike' ? 'text-red-500' : ''}`}
                onClick={() => handleVote('dislike')}
            >
                👎 {initialDislikes}
            </button>
        </div>
    );
}
