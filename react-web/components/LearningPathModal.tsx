
import React from 'react';
import { Certification } from '../types';

interface LearningPathModalProps {
    certification: Certification;
    allCertifications: Certification[];
    onClose: () => void;
}

const PathCard: React.FC<{ cert?: Certification; isCurrent?: boolean }> = ({ cert, isCurrent }) => {
    if (!cert) {
        return <div className="p-3 text-center text-sm bg-gray-100 rounded-lg text-gray-500 w-full max-w-sm">None</div>;
    }

    const baseClass = "p-3 bg-white rounded-lg border text-center transition-all w-full max-w-sm";
    const currentClass = isCurrent ? "border-cyan-500 shadow-lg shadow-cyan-500/20" : "border-gray-200";
    
    return (
        <div className={`${baseClass} ${currentClass}`}>
            <p className="font-bold text-sm text-gray-900">{cert.name}</p>
            <p className="text-xs text-gray-500">{cert.level}</p>
        </div>
    );
};


export const LearningPathModal: React.FC<LearningPathModalProps> = ({ certification, allCertifications, onClose }) => {
    const certMap = new Map(allCertifications.map(c => [c.id, c]));

    const prerequisites = certification.prerequisites.map(id => certMap.get(id));
    const leadsTo = certification.leadsTo.map(id => certMap.get(id));

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-gray-50 border border-gray-200 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-gray-50/80 backdrop-blur-sm z-10 p-5 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Learning Path for {certification.name}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="p-6 space-y-8">
                    {/* Prerequisites Section */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-cyan-600">Prerequisites</h3>
                        <div className="flex flex-col items-center gap-2">
                             {prerequisites.length > 0 ? (
                                prerequisites.map(p => p && <PathCard key={p.id} cert={p} />)
                            ) : <PathCard />}
                        </div>
                    </div>
                    
                    {/* Arrow Down */}
                    <div className="flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 9-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>

                    {/* Current Certification */}
                    <div className="space-y-3">
                         <h3 className="font-semibold text-green-600 text-center">Current Certification</h3>
                        <PathCard cert={certification} isCurrent />
                    </div>

                    {/* Arrow Down */}
                     <div className="flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                           <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 9-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>

                    {/* Leads To Section */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-purple-600 text-right">Leads To</h3>
                        <div className="flex flex-col items-center gap-2">
                             {leadsTo.length > 0 ? (
                                leadsTo.map(p => p && <PathCard key={p.id} cert={p} />)
                            ) : <PathCard />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};