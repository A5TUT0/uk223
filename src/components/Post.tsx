'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react'
import { Comment } from './Comment'
import { motion, AnimatePresence } from 'framer-motion'

interface PostProps {
    username: string
    content: string
    avatar: string
}

export function Post({ username, content, avatar }: PostProps) {
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)
    const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null)
    const [showComments, setShowComments] = useState(false)
    const [newComment, setNewComment] = useState('')

    const handleLike = () => {
        if (userReaction === 'like') {
            setLikes(likes - 1)
            setUserReaction(null)
        } else {
            if (userReaction === 'dislike') {
                setDislikes(dislikes - 1)
            }
            setLikes(likes + 1)
            setUserReaction('like')
        }
    }

    const handleDislike = () => {
        if (userReaction === 'dislike') {
            setDislikes(dislikes - 1)
            setUserReaction(null)
        } else {
            if (userReaction === 'like') {
                setLikes(likes - 1)
            }
            setDislikes(dislikes + 1)
            setUserReaction('dislike')
        }
    }

    const handleNewComment = () => {
        if (newComment.trim()) {
            setShowComments(true)
            setNewComment('')
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="mb-4">
                {/* CardHeader con Avatar y Nombre alineados a la derecha */}
                <CardHeader className="flex items-center justify-end space-x-4 p-6">
                    <div className="flex items-center space-x-3">
                        <div>
                            <span className="font-semibold text-lg">{username}</span>
                        </div>
                        <Avatar>
                            <AvatarImage src={avatar} alt={username} />
                            <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                </CardHeader>

                {/* Contenido del Post */}
                <CardContent className="p-6 pt-0">
                    <p>{content}</p>
                </CardContent>

                {/* CardFooter con interacciones */}
                <CardFooter className="flex flex-col p-6 pt-0">
                    <div className="flex justify-between w-full items-center">
                        <div className="flex space-x-2">
                            {/* Botón Like */}
                            <motion.div whileTap={{ scale: 0.9 }}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLike}
                                    className={userReaction === 'like' ? 'text-blue-500' : ''}
                                    aria-label="Like"
                                >
                                    <motion.div
                                        animate={userReaction === 'like' ? { scale: [1, 1.2, 1] } : {}}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ThumbsUp className="mr-2 h-4 w-4" />
                                    </motion.div>
                                    <span>{likes}</span>
                                </Button>
                            </motion.div>

                            {/* Botón Dislike */}
                            <motion.div whileTap={{ scale: 0.9 }}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDislike}
                                    className={userReaction === 'dislike' ? 'text-red-500' : ''}
                                    aria-label="Dislike"
                                >
                                    <motion.div
                                        animate={userReaction === 'dislike' ? { scale: [1, 1.2, 1] } : {}}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ThumbsDown className="mr-2 h-4 w-4" />
                                    </motion.div>
                                    <span>{dislikes}</span>
                                </Button>
                            </motion.div>
                        </div>

                        {/* Botón para mostrar los comentarios */}
                        <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} aria-label="Show Comments">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Comments
                        </Button>
                    </div>

                    {/* Mostrar comentarios cuando se activa el botón */}
                    <AnimatePresence>
                        {showComments && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full mt-4"
                            >
                                <div className="flex space-x-2 mb-4">
                                    <Input
                                        placeholder="Add a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <Button onClick={handleNewComment}>Post</Button>
                                </div>
                                <Comment username="user1" content="Great post!" avatar="/placeholder.svg?height=40&width=40" />
                                <Comment username="user2" content="I agree" avatar="/placeholder.svg?height=40&width=40" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
