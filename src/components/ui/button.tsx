import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'ghost';
    size?: 'default' | 'sm';
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'default',
    size = 'default',
    className = '',
    ...props
}) => {
    const baseStyles =
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
    const variantStyles = {
        default: 'bg-white text-black hover:bg-gray-100',
        ghost: 'hover:bg-gray-200 hover:text-black',
    };
    const sizeStyles = {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};
