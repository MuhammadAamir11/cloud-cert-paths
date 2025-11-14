import React, { useState, useEffect, useMemo } from 'react';
import { Certification, ComparisonData, Difficulty } from '../types';
import { fetchComparisonData } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';
import { providerIcons } from './ProviderIcons';


interface ComparisonModalProps {
    certificationsToCompare: Certification[];
    allCertifications: Certification[];
    onClose: () => void;
}

type CombinedData = Certification & Partial<Omit<ComparisonData, 'id'>>;

const difficultyColors: Record<Difficulty, string> = {
    [Difficulty.Beginner]: 'bg-green-100 text-green-800',
    [Difficulty.Intermediate]: 'bg-yellow-100 text-yellow-800',
    [Difficulty.Advanced]: 'bg-red-100 text-red-800',
};

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ certificationsToCompare, allCertifications, onClose }) => {
    const [comparisonDetails, setComparisonDetails] = useState<ComparisonData[]>([]);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);
    const certMap = useMemo(() => new Map(allCertifications.map(c => [c.id, c])), [allCertifications]);


    const loadComparisonData = async () => {
        setStatus('loading');
        setError(null);
        try {
            const data = await fetchComparisonData(certificationsToCompare);
            setComparisonDetails(data);
            setStatus('success');
        } catch (err) {
            console.error(err);
            setError('Gemini could not generate the comparison data. Please try again.');
            setStatus('error');
        }
    };

    useEffect(() => {
        if (certificationsToCompare.length > 0) {
            loadComparisonData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [certificationsToCompare]);

    const combinedData: CombinedData[] = useMemo(() => {
        return certificationsToCompare.map(cert => {
            const details = comparisonDetails.find(d => d.id === cert.id);
            return {
                ...cert,
                ...details
            };
        });
    }, [certificationsToCompare, comparisonDetails]);

    const comparisonRows = [
        { label: 'Provider', render: (c: CombinedData) => <div className="font-medium lg:text-center">{c.provider}</div> },
        { label: 'Level', render: (c: CombinedData) => <div className="font-medium lg:text-center">{c.level}</div> },
        { 
            label: 'Difficulty', 
            render: (c: CombinedData) => (
                <div className="lg:text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${difficultyColors[c.difficulty]}`}>
                        {c.difficulty}
                    </span>
                </div>
            ) 
        },
        { label: 'Target Audience', render: (c: CombinedData) => c.targetAudience },
        { label: 'Career Benefit', render: (c: CombinedData) => c.careerBenefit },
        { label: 'Job Market Value', render: (c: CombinedData) => c.jobMarketBenefit },
        { label: 'Estimated Cost', render: (c: CombinedData) => <div className="font-semibold text-gray-800 lg:text-center">{c.estimatedCost}</div> },
        {
            label: 'Focus Areas',
            render: (c: CombinedData) => (
                <div className="flex flex-wrap gap-1.5">
                    {c.focusAreas.map(area => <span key={area} className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">{area}</span>)}
                </div>
            )
        },
        { label: 'Prerequisites', render: (c: CombinedData) => c.prerequisites.length > 0 ? c.prerequisites.map(id => certMap.get(id)?.name || 'N/A').join(', ') : 'None' },
        { label: 'Leads To', render: (c: CombinedData) => c.leadsTo.length > 0 ? c.leadsTo.map(id => certMap.get(id)?.name || 'N/A').join(', ') : 'N/A' },
        { label: 'Official Link', render: (c: CombinedData) => <a href={c.officialLink} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline break-all">{c.officialLink}</a> },
    ];


    const renderContent = () => {
        if (status === 'loading') {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-500">Gemini is preparing your comparison...</p>
                </div>
            );
        }
        if (status === 'error') {
            return <div className="p-6"><ErrorDisplay message={error} onRetry={loadComparisonData} /></div>;
        }

        return (
            <div className="overflow-auto flex-grow">
                {/* Desktop Table View */}
                <div className="hidden lg:block">
                    <table className="w-full min-w-[1200px] border-collapse text-sm">
                        <thead className="sticky top-0 z-10 bg-gray-100/95 backdrop-blur-sm">
                            <tr>
                                <th className="sticky left-0 bg-gray-100/95 p-3 font-semibold text-left w-[180px] border-b border-gray-300">Feature</th>
                                 {combinedData.map(cert => {
                                    const Icon = providerIcons[cert.provider];
                                    return (
                                        <th key={cert.id} className="p-3 border-b border-gray-300 text-center font-semibold text-gray-800 w-[280px]">
                                            <Icon className="w-8 h-8 mx-auto mb-2" />
                                            <h4>{cert.name}</h4>
                                        </th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonRows.map(({label, render}) => (
                                 <tr key={label} className="border-b border-gray-200 last:border-b-0 odd:bg-white even:bg-gray-50">
                                    <th className="sticky left-0 p-3 font-semibold text-left text-gray-600 bg-inherit w-[180px]">{label}</th>
                                    {combinedData.map(cert => (
                                        <td key={cert.id} className="p-3 align-top text-gray-700 w-[280px]">
                                            {render(cert)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Stacked View */}
                <div className="lg:hidden p-4 space-y-6">
                    {combinedData.map(cert => {
                         const Icon = providerIcons[cert.provider];
                         return (
                            <div key={cert.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <Icon className="w-8 h-8" />
                                        <h3 className="font-bold text-gray-900">{cert.name}</h3>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4">
                                     {comparisonRows.map(({label, render}) => (
                                        <div key={label}>
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</h4>
                                            <div className="mt-1 text-sm text-gray-800">{render(cert)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-gray-50 border border-gray-200 rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex-shrink-0 p-5 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Certification Comparison</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition" aria-label="Close modal">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {renderContent()}
            </div>
        </div>
    );
};
