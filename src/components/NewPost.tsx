'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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

    return (
        <div className="mb-4">
            <Textarea
                placeholder="What's happening?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
            />
            <Button onClick={handleSubmit} className="mt-2">
                Post
            </Button>
        </div>
    );
}
