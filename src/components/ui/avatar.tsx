import React from 'react'

interface AvatarProps {
    src?: string
    alt?: string
    fallback?: string
    children?: React.ReactNode
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, children }) => {
    return (
        <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            {children}
        </div>
    )
}

export const AvatarImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ src, alt, ...props }) => {
    return <img src={src} alt={alt} className="w-full h-full object-cover" {...props} />
}

export const AvatarFallback: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
    return (
        <div className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-600" {...props}>
            {children}
        </div>
    )
}