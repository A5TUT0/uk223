import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => (
        <input
            className={`w-full h-10 px-4 py-2 border rounded-lg bg-black text-white placeholder-gray-500 border-gray-600 focus:ring-2 focus:ring-white focus:border-white ${className}`}
            ref={ref}
            {...props}
        />
    )
);
Input.displayName = 'Input';
