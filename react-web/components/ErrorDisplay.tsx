
import React from 'react';

interface ErrorDisplayProps {
    message: string | null;
    onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
    return (
        <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg relative text-center" role="alert">
            <strong className="font-bold">An error occurred.</strong>
            <p className="block sm:inline ml-2">{message || "Something went wrong."}</p>
            <div className="mt-4">
                <button 
                    onClick={onRetry}
                    className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-500 transition-colors duration-200"
                >
                    Retry
                </button>
            </div>
        </div>
    );
};