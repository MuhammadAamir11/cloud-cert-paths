
import React, { useState } from 'react';
import { Certification } from '../types';
import { askGeminiAboutCerts } from '../services/geminiService';

interface AskGeminiProps {
    certifications: Certification[];
}

const SparklesIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);


export const AskGemini: React.FC<AskGeminiProps> = ({ certifications }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim() || isLoading) return;

        setIsLoading(true);
        setAnswer('');
        try {
            const result = await askGeminiAboutCerts(question, certifications);
            setAnswer(result);
        } catch (error) {
            setAnswer("Sorry, I couldn't get an answer. Please try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-16 py-12 bg-white rounded-lg border border-gray-200">
            <div className="container mx-auto px-4 text-center">
                <div className="flex justify-center items-center gap-2 mb-4">
                     <SparklesIcon className="w-8 h-8 text-cyan-500" />
                     <h2 className="text-2xl font-bold text-gray-900">Ask Gemini</h2>
                </div>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Have a specific question? Ask Gemini to compare certifications, suggest a path, or explain a concept.</p>
                
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g., Which AWS cert is best for data science?"
                        className="flex-grow bg-gray-100 border border-gray-300 rounded-full py-3 px-5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        className="bg-cyan-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-cyan-500 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={isLoading}
                    >
                         {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Asking...
                            </>
                        ) : 'Get Answer'}
                    </button>
                </form>

                {answer && (
                    <div className="mt-8 max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg border border-gray-200 text-left">
                        <p className="text-gray-700 whitespace-pre-wrap font-mono text-sm leading-relaxed">{answer}</p>
                    </div>
                )}
            </div>
        </div>
    );
};