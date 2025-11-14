import React, { useState, useMemo, useEffect } from 'react';
import { Certification, CloudProvider, Level } from '../types';
import { CertificationCard } from '../components/CertificationCard';

interface PathExplorerPageProps {
    allCertifications: Certification[];
    initialProvider: CloudProvider | null;
    onCertSelect: (certId: string) => void;
}

const levelsOrder: Level[] = [Level.Fundamental, Level.Associate, Level.Professional, Level.Expert, Level.Specialty];

export const PathExplorerPage: React.FC<PathExplorerPageProps> = ({ allCertifications, initialProvider, onCertSelect }) => {
    const [activeProviders, setActiveProviders] = useState<Set<CloudProvider>>(new Set());
    const [hoveredCert, setHoveredCert] = useState<{ id: string, prereqs: string[], leadsTo: string[], provider: CloudProvider } | null>(null);
    const [examCodeSearch, setExamCodeSearch] = useState('');

    useEffect(() => {
        if (initialProvider) {
            setActiveProviders(new Set([initialProvider]));
        }
    }, [initialProvider]);

    const toggleProvider = (provider: CloudProvider) => {
        const newSet = new Set(activeProviders);
        if (newSet.has(provider)) {
            newSet.delete(provider);
        } else {
            newSet.add(provider);
        }
        setActiveProviders(newSet);
    };

    const filteredCertifications = useMemo(() => {
        return allCertifications.filter(cert => {
            const providerMatch = activeProviders.size === 0 || activeProviders.has(cert.provider);
            // Normalize search term and exam code for flexible matching
            const normalizedSearch = examCodeSearch.replace(/-/g, '').toLowerCase();
            const normalizedExamCode = cert.examCode.replace(/-/g, '').toLowerCase();
            const examCodeMatch = normalizedSearch.trim() === '' || normalizedExamCode.includes(normalizedSearch.trim());
            return providerMatch && examCodeMatch;
        });
    }, [allCertifications, activeProviders, examCodeSearch]);

    const groupedCerts = useMemo(() => {
        const groups: Partial<Record<Level, Certification[]>> = {};
        for (const cert of filteredCertifications) {
            if (!groups[cert.level]) {
                groups[cert.level] = [];
            }
            groups[cert.level]!.push(cert);
        }
        return groups;
    }, [filteredCertifications]);
    
    const handleMouseEnter = (cert: Certification) => {
        setHoveredCert({ id: cert.id, prereqs: cert.prerequisites, leadsTo: cert.leadsTo, provider: cert.provider });
    };

    const handleMouseLeave = () => {
        setHoveredCert(null);
    };

    return (
        <div className="p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Interactive Learning Paths</h1>
                <p className="text-slate-500 mt-1">Hover over any certification to see your next possible steps with animated pathways.</p>
            </header>

            <div className="bg-white/80 p-4 rounded-lg border border-slate-200 shadow-sm sticky top-[73px] md:top-0 z-10 backdrop-blur-lg flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-600">Providers:</span>
                    <div className="flex gap-2">
                        {Object.values(CloudProvider).map(p => (
                            <button
                                key={p}
                                onClick={() => toggleProvider(p)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${activeProviders.has(p) ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
                 <div className="relative flex-grow w-full md:w-auto">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                    <input
                        type="text"
                        placeholder="Search by exam code (e.g. AZ104)"
                        value={examCodeSearch}
                        onChange={(e) => setExamCodeSearch(e.target.value)}
                        className="w-full bg-slate-100 border border-slate-300 rounded-full py-1.5 pl-9 pr-4 text-slate-900 placeholder-slate-500 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>
            </div>

            <div className="mt-8 space-y-12">
                {levelsOrder.map(level => {
                    const certsInLevel = groupedCerts[level];
                    // FIX: Corrected typo from 'certsInlevel' to 'certsInLevel'.
                    if (!certsInLevel || certsInLevel.length === 0) return null;

                    return (
                        <section key={level}>
                            <div className="flex items-center mb-4">
                                <h2 className="text-xl font-bold text-slate-800">{level}</h2>
                                <hr className="flex-grow ml-4 border-slate-200" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {certsInLevel.map(cert => {
                                    const isPartOfPath = hoveredCert && (hoveredCert.id === cert.id || hoveredCert.prereqs.includes(cert.id) || hoveredCert.leadsTo.includes(cert.id));
                                    const isDimmed = hoveredCert && (hoveredCert.provider !== cert.provider || !isPartOfPath);
                                    
                                    const isPrereq = hoveredCert?.prereqs.includes(cert.id) && hoveredCert.provider === cert.provider;
                                    const isLeadsTo = hoveredCert?.leadsTo.includes(cert.id) && hoveredCert.provider === cert.provider;

                                    return (
                                        <CertificationCard 
                                            key={cert.id} 
                                            certification={cert}
                                            isDimmed={isDimmed}
                                            isPrerequisite={isPrereq}
                                            isLeadsTo={isLeadsTo}
                                            onMouseEnter={() => handleMouseEnter(cert)}
                                            onMouseLeave={handleMouseLeave}
                                            onClick={onCertSelect}
                                        />
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
};
