import React, { useEffect } from 'react';

type AlertProps = {
  type: 'success' | 'error' | 'warning';
  message: string;
  onClose: () => void;
};

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const colors = {
    success: {
      bg: 'bg-green-100 dark:bg-green-900',
      border: 'border-green-500 dark:border-green-700',
      text: 'text-green-900 dark:text-green-100',
      hover: 'hover:bg-green-200 dark:hover:bg-green-800',
      icon: 'text-green-600',
    },
    error: {
      bg: 'bg-red-100 dark:bg-red-900',
      border: 'border-red-500 dark:border-red-700',
      text: 'text-red-900 dark:text-red-100',
      hover: 'hover:bg-red-200 dark:hover:bg-red-800',
      icon: 'text-red-600',
    },
    warning: {
      bg: 'bg-yellow-100 dark:bg-yellow-900',
      border: 'border-yellow-500 dark:border-yellow-700',
      text: 'text-yellow-900 dark:text-yellow-100',
      hover: 'hover:bg-yellow-200 dark:hover:bg-yellow-800',
      icon: 'text-yellow-600',
    },
  };

  const styles = colors[type] || {
    bg: 'bg-gray-100',
    border: 'border-gray-500',
    text: 'text-gray-900',
    hover: 'hover:bg-gray-200',
    icon: 'text-gray-600',
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="alert"
      className={`${styles.bg} ${styles.border} ${styles.text} p-2 rounded-lg flex items-center transition duration-300 ease-in-out ${styles.hover} transform hover:scale-105`}
    >
      <svg
        stroke="currentColor"
        viewBox="0 0 24 24"
        fill="none"
        className={`h-5 w-5 flex-shrink-0 mr-2 ${styles.icon}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        ></path>
      </svg>
      <p className="text-xs font-semibold">{message}</p>
    </div>
  );
};

export default Alert;
