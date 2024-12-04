import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    htmlFor?: string;
}

export const Label: React.FC<LabelProps> = ({ children, htmlFor, ...props }) => (
    <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-white"
        {...props}
    >
        {children}
    </label>
);
