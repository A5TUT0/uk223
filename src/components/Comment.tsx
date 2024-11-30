'use client'

import { useState } from 'react'
// import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface CommentProps {
    username: string
    content: string
    avatar: string
}

export function Comment({ username, content }: CommentProps) {
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)
    const [showReplies, setShowReplies] = useState(false)
    const [newReply, setNewReply] = useState('')

    const handleNewReply = () => {
        if (newReply.trim()) {
            // In a real app, you'd add this to a database
            setShowReplies(true)
            setNewReply('')
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="mb-2">
                <CardContent className="pt-4">
                    <div className="flex items-center space-x-4 mb-2">
                        {/* <Avatar>
                            <AvatarImage src={avatar} alt={username} />
                            <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
                        </Avatar> */}
                        <span className="font-bold">{username}</span>
                    </div>
                    <p>{content}</p>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <div className="flex justify-between w-full">
                        <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => setLikes(likes + 1)}>
                                <ThumbsUp className="mr-2 h-4 w-4" />
                                <span>{likes}</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setDislikes(dislikes + 1)}>
                                <ThumbsDown className="mr-2 h-4 w-4" />
                                <span>{dislikes}</span>
                            </Button>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setShowReplies(!showReplies)}>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Replies
                        </Button>
                    </div>
                    <div className="w-full mt-4">
                        <div className="flex space-x-2">
                            <Input
                                placeholder="Add a reply..."
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                            />
                            <Button onClick={handleNewReply}>Post</Button>
                        </div>
                    </div>
                    {showReplies && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="w-full mt-4"
                        >
                            <Comment username="user3" content="Good point" avatar="/placeholder.svg?height=40&width=40" />
                        </motion.div>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    )
}

