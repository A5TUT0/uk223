import React from 'react';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Switch: React.FC<SwitchProps> = ({ label, ...props }) => (
    <label className="relative inline-flex items-center cursor-pointer space-x-3">
        <input type="checkbox" className="sr-only peer" {...props} />
        <div className="w-10 h-5 bg-gray-700 rounded-full peer-checked:bg-white peer-focus:ring-2 peer-focus:ring-gray-400 relative">
            <span className="absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
        </div>
        {label && <span className="text-sm text-gray-400">{label}</span>}
    </label>
);
