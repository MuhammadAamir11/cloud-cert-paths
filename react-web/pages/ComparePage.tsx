import React, { useState, useMemo } from 'react';
import { Certification, CloudProvider, Difficulty } from '../types';
import { AwsIcon, AzureIcon, GcpIcon } from '../components/ProviderIcons';

interface ComparePageProps {
    allCertifications: Certification[];
}

const providerColors: Record<CloudProvider, { bg: string; text: string; border: string; accent: string; }> = {
    [CloudProvider.AWS]: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200', accent: 'bg-orange-500' },
    [CloudProvider.Azure]: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', accent: 'bg-blue-500' },
    [CloudProvider.GCP]: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200', accent: 'bg-green-500' },
};

const DetailItem: React.FC<{ icon: React.ReactElement; label: string; value: string | number; }> = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 bg-white/50 p-3 rounded-lg">
        <div className="w-10 h-10 flex items-center justify-center">
            {icon}
        </div>
        <div>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="font-semibold text-slate-800">{value}</p>
        </div>
    </div>
);


const ComparisonColumn: React.FC<{ cert: Certification | null }> = ({ cert }) => {
    if (!cert) {
        return (
            <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl h-full flex items-center justify-center min-h-[300px] lg:min-h-0">
                <p className="text-slate-500">Select a certification</p>
            </div>
        );
    }
    const colors = providerColors[cert.provider];
    const ProviderIcon = { AWS: AwsIcon, Azure: AzureIcon, GCP: GcpIcon }[cert.provider];

    return (
        <div className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden shadow-sm h-full flex flex-col`}>
             <div className={`h-2 ${colors.accent}`}></div>
             <div className="p-5 flex-grow">
                 <div className="flex items-start justify-between mb-4">
                    <div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${colors.bg} ${colors.text} ring-1 ring-inset ring-current`}>{cert.level}</span>
                        <h3 className="text-lg font-bold text-slate-900 mt-2">{cert.name}</h3>
                        <p className="text-sm text-slate-500">{cert.examCode}</p>
                    </div>
                    <ProviderIcon className="w-10 h-10" />
                 </div>
                 <p className="text-sm text-slate-600 mb-6">{cert.description}</p>
                 <div className="space-y-3">
                    <DetailItem icon={<CostIcon />} label="Exam Cost" value={`$${cert.cost}`} />
                    <DetailItem icon={<TimeIcon />} label="Study Time" value={`${cert.duration} hours`} />
                    <DetailItem icon={<DifficultyIcon />} label="Difficulty" value={cert.difficulty} />
                    <DetailItem icon={<PassIcon />} label="Pass Score" value={`${cert.passScore}%`} />
                    <DetailItem icon={<ValidityIcon />} label="Validity" value={`${cert.validity} years`} />
                 </div>
                 <div className="mt-6">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Key Topics</h4>
                    <div className="flex flex-wrap gap-2">
                        {cert.focusAreas.slice(0, 5).map(area => (
                            <span key={area} className="bg-white text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-200">{area}</span>
                        ))}
                    </div>
                 </div>
             </div>
        </div>
    );
}


export const ComparePage: React.FC<ComparePageProps> = ({ allCertifications }) => {
    const [selectedIds, setSelectedIds] = useState<(string | null)[]>([null, null, null]);
    
    const certMap = useMemo(() => new Map(allCertifications.map(c => [c.id, c])), [allCertifications]);

    const groupedAndSortedCerts = useMemo(() => {
        const difficultyOrder: Record<Difficulty, number> = {
            [Difficulty.Beginner]: 1,
            [Difficulty.Intermediate]: 2,
            [Difficulty.Advanced]: 3,
        };
        const grouped: Partial<Record<CloudProvider, Certification[]>> = {};
        for(const cert of allCertifications) {
            if(!grouped[cert.provider]) grouped[cert.provider] = [];
            grouped[cert.provider]!.push(cert);
        }
        for(const provider in grouped) {
            grouped[provider as CloudProvider]!.sort((a,b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
        }
        return grouped;
    }, [allCertifications]);


    const handleSelect = (index: number, id: string | null) => {
        const newSelection = [...selectedIds];
        newSelection[index] = id;
        setSelectedIds(newSelection);
    }

    return (
         <div className="p-4 md:p-8 h-full flex flex-col">
            <header className="mb-6 flex-shrink-0">
                <h1 className="text-3xl font-bold text-slate-900">Compare Certifications</h1>
                <p className="text-slate-500 mt-1">Select up to 3 certifications to compare side-by-side.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 flex-shrink-0">
                {[0, 1, 2].map(i => (
                    <div key={i}>
                        <label htmlFor={`cert-select-${i}`} className="block text-sm font-medium text-slate-700 mb-1">
                            Certification {i + 1}
                        </label>
                        <select
                            id={`cert-select-${i}`}
                            value={selectedIds[i] || ''}
                            onChange={(e) => handleSelect(i, e.target.value || null)}
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2.5 bg-white"
                        >
                            <option value="">-- Select a certification --</option>
                            {Object.entries(groupedAndSortedCerts).map(([provider, certs]) => (
                                <optgroup key={provider} label={provider}>
                                    {certs.map(c => (
                                        <option 
                                            key={c.id} 
                                            value={c.id} 
                                            disabled={selectedIds.includes(c.id) && selectedIds[i] !== c.id}
                                            className="disabled:text-gray-400"
                                        >
                                            {c.name} ({c.examCode})
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-0">
                <ComparisonColumn cert={selectedIds[0] ? certMap.get(selectedIds[0]!)! : null} />
                <ComparisonColumn cert={selectedIds[1] ? certMap.get(selectedIds[1]!)! : null} />
                <ComparisonColumn cert={selectedIds[2] ? certMap.get(selectedIds[2]!)! : null} />
            </div>
        </div>
    );
};

// Colorful Icons
const CostIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
        </svg>
    </div>
);
const TimeIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    </div>
);
const DifficultyIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6a2 2 0 100-4 2 2 0 000 4zm0 14a2 2 0 100-4 2 2 0 000 4zm6-8a2 2 0 100-4 2 2 0 000 4zm-12 0a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
    </div>
);
const PassIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    </div>
);
const ValidityIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    </div>
);