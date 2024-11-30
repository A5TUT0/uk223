'use client'

import { useState } from 'react'
import { NewPost } from './NewPost'
import { Post } from './Post'
import { motion } from 'framer-motion'

export default function Content() {
    const [posts, setPosts] = useState([
        { id: 1, username: 'JohnDoe', content: 'Just had an amazing coffee! ☕️ #MorningBoost', avatar: '/placeholder.svg?height=40&width=40' },
        { id: 2, username: 'TechEnthusiast', content: 'Excited about the new AI developments! 🤖 What do you think about the future of AI?', avatar: '/placeholder.svg?height=40&width=40' },
        { id: 3, username: 'NatureLover', content: 'Beautiful sunset at the beach today! 🌅 #NaturePhotography', avatar: '/placeholder.svg?height=40&width=40' },
    ])

    const handleNewPost = (content: string) => {
        const newPost = {
            id: posts.length + 1,
            username: 'CurrentUser',
            content,
            avatar: '/placeholder.svg?height=40&width=40',
        }
        setPosts([newPost, ...posts])
    }

    return (
        <div className="min-h-screen bg-background">
            <motion.div
                className="max-w-2xl mx-auto px-4 py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <NewPost onSubmit={handleNewPost} />
                {posts.map((post) => (
                    <Post key={post.id} {...post} />
                ))}
            </motion.div>
        </div>
    )
}

