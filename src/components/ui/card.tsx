import React from 'react';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    ...props
}) => (
    <div
        className={`rounded-lg border border-gray-600 bg-black text-white shadow-md overflow-hidden ${className}`}
        {...props}
    />
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    ...props
}) => (
    <div className={`p-6 border-b border-gray-700 ${className}`} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
    className,
    ...props
}) => (
    <h2 className={`text-lg font-semibold ${className}`} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    ...props
}) => (
    <div className={`p-6 ${className}`} {...props} />
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    ...props
}) => (
    <div className={`p-6 border-t border-gray-700 ${className}`} {...props} />
);
