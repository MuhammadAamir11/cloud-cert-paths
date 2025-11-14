
import React from 'react';
import { CloudProvider, Level } from '../types';
import { AwsIcon, AzureIcon, GcpIcon } from './ProviderIcons';

interface FilterControlsProps {
    activeProviders: Set<CloudProvider>;
    setActiveProviders: React.Dispatch<React.SetStateAction<Set<CloudProvider>>>;
    activeLevels: Set<Level>;
    setActiveLevels: React.Dispatch<React.SetStateAction<Set<Level>>>;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const providers = Object.values(CloudProvider);
const levels = Object.values(Level);

const providerIcons: Record<CloudProvider, React.FC<{ className?: string }>> = {
    [CloudProvider.AWS]: AwsIcon,
    [CloudProvider.Azure]: AzureIcon,
    [CloudProvider.GCP]: GcpIcon,
};

export const FilterControls: React.FC<FilterControlsProps> = ({
    activeProviders, setActiveProviders, activeLevels, setActiveLevels, searchTerm, setSearchTerm
}) => {

    const toggleProvider = (provider: CloudProvider) => {
        const newSet = new Set(activeProviders);
        if (newSet.has(provider)) {
            newSet.delete(provider);
        } else {
            newSet.add(provider);
        }
        setActiveProviders(newSet);
    };

    const toggleLevel = (level: Level) => {
        const newSet = new Set(activeLevels);
        if (newSet.has(level)) {
            newSet.delete(level);
        } else {
            newSet.add(level);
        }
        setActiveLevels(newSet);
    };
    
    const baseButtonClass = "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white";
    const inactiveButtonClass = "bg-gray-200 text-gray-700 hover:bg-gray-300";
    
    const providerActiveClasses: Record<CloudProvider, string> = {
        [CloudProvider.AWS]: 'bg-orange-500 text-white ring-orange-400',
        [CloudProvider.Azure]: 'bg-blue-500 text-white ring-blue-400',
        [CloudProvider.GCP]: 'bg-green-500 text-white ring-green-400',
    };

    const levelActiveClasses: Record<Level, string> = {
        [Level.Fundamental]: 'bg-sky-500 text-white ring-sky-400',
        [Level.Associate]: 'bg-indigo-500 text-white ring-indigo-400',
        [Level.Professional]: 'bg-purple-500 text-white ring-purple-400',
        [Level.Specialty]: 'bg-pink-500 text-white ring-pink-400',
        // FIX: Add missing style for 'Expert' level to satisfy the Record type.
        [Level.Expert]: 'bg-red-500 text-white ring-red-400',
    }

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                 <div className="relative flex-grow w-full">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search certifications by name, skill, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-100 border border-gray-300 rounded-full py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    />
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Cloud Provider</h3>
                    <div className="flex flex-wrap gap-2">
                        {providers.map(provider => {
                            const Icon = providerIcons[provider];
                            return (
                                <button
                                    key={provider}
                                    onClick={() => toggleProvider(provider)}
                                    className={`${baseButtonClass} flex items-center gap-2 ${activeProviders.has(provider) ? providerActiveClasses[provider] : inactiveButtonClass}`}
                                >
                                    <Icon className="w-5 h-5"/>
                                    {provider}
                                </button>
                            )
                        })}
                    </div>
                </div>
                 <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Certification Level</h3>
                    <div className="flex flex-wrap gap-2">
                        {levels.map(level => (
                            <button
                                key={level}
                                onClick={() => toggleLevel(level)}
                                className={`${baseButtonClass} ${activeLevels.has(level) ? levelActiveClasses[level] : inactiveButtonClass}`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
