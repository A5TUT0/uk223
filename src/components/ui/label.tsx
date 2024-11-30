import React from 'react'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    htmlFor?: string
}

export const Label: React.FC<LabelProps> = ({ children, htmlFor, ...props }) => {
    return (
        <label
            htmlFor={htmlFor}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            {...props}
        >
            {children}
        </label>
    )
}