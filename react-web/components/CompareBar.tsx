
import React from 'react';

interface CompareBarProps {
    count: number;
    onCompare: () => void;
    onClear: () => void;
}

export const CompareBar: React.FC<CompareBarProps> = ({ count, onCompare, onClear }) => {
    if (count === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-4 transition-transform duration-300 ease-in-out" style={{ transform: count > 0 ? 'translateY(0)' : 'translateY(100%)' }}>
             <div className="container mx-auto">
                <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-lg shadow-2xl p-4 flex items-center justify-between max-w-2xl mx-auto">
                    <p className="font-semibold text-gray-900">
                        <span className="bg-cyan-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center font-bold text-sm mr-3">{count}</span>
                        {count === 1 ? 'certification selected' : 'certifications selected'}
                    </p>
                    <div className="flex items-center gap-3">
                        <button onClick={onClear} className="text-gray-500 hover:text-gray-900 text-sm font-semibold transition">Clear</button>
                        <button 
                            onClick={onCompare} 
                            disabled={count < 2}
                            className="bg-cyan-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-cyan-500 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {`Compare (${count})`}
                        </button>
                    </div>
                </div>
             </div>
        </div>
    );
};