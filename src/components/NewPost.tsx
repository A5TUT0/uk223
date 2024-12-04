'use client';

import { useState } from 'react';

interface NewPostProps {
    onSubmit: (content: string) => void;
}

export function NewPost({ onSubmit }: NewPostProps) {
    const [content, setContent] = useState('');

    const handleSubmit = () => {
        if (content.trim()) {
            onSubmit(content);
            setContent('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="mb-6 max-w-xl mx-auto">
            <div className="relative">
                <textarea
                    placeholder="What's happening?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={3}
                    className="w-full max-w-3xl  bg-black border border-gray-700 text-white rounded-lg resize-none placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <button
                    onClick={handleSubmit}
                    disabled={!content.trim()}
                    className="absolute bottom-4 right-4 px-5 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Post
                </button>
            </div>
        </div>
    );
}
