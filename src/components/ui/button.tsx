import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'ghost' | 'outline';
    size?: 'default' | 'sm' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'default',
    size = 'default',
    className = '',
    ...props
}) => {
    const baseStyles =
        'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    const variantStyles = {
        default: 'bg-white text-black hover:bg-gray-200',
        ghost: 'bg-transparent text-gray-400 hover:bg-gray-700',
        outline: 'border border-gray-500 text-gray-400 hover:bg-gray-700',
    };
    const sizeStyles = {
        default: 'h-10 px-6 text-base',
        sm: 'h-8 px-4 text-sm',
        lg: 'h-12 px-8 text-lg',
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
