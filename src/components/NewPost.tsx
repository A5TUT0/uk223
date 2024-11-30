'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from 'framer-motion'

interface NewPostProps {
    onSubmit: (content: string) => void
}

export function NewPost({ onSubmit }: NewPostProps) {
    const [content, setContent] = useState('')

    const handleSubmit = () => {
        if (content.trim()) {
            onSubmit(content)
            setContent('')
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="mb-4">
                <CardContent className="pt-4">
                    <Textarea
                        placeholder="What's happening?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={3}
                    />
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleSubmit}>Post</Button>
                </CardFooter>
            </Card>
        </motion.div>
    )
}

