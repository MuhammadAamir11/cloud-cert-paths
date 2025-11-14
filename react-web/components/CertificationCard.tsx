import React from 'react';
import { Certification, CloudProvider, Difficulty, Level } from '../types';
import { AwsIcon, AzureIcon, GcpIcon } from './ProviderIcons';

interface CertificationCardProps {
    certification: Certification;
    isDimmed?: boolean;
    isPrerequisite?: boolean;
    isLeadsTo?: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick: (id: string) => void;
}

const providerStyles: Record<CloudProvider, { border: string; icon: React.FC<{className?: string}>; levelBg: string; levelText: string; }> = {
    [CloudProvider.AWS]: { border: 'border-orange-400', icon: AwsIcon, levelBg: 'bg-orange-100', levelText: 'text-orange-800' },
    [CloudProvider.Azure]: { border: 'border-blue-400', icon: AzureIcon, levelBg: 'bg-blue-100', levelText: 'text-blue-800' },
    [CloudProvider.GCP]: { border: 'border-green-500', icon: GcpIcon, levelBg: 'bg-green-100', levelText: 'text-green-800' },
};

const levelColors: Record<Level, string> = {
    [Level.Fundamental]: 'bg-pink-200 text-pink-800',
    [Level.Associate]: 'bg-indigo-200 text-indigo-800',
    [Level.Professional]: 'bg-purple-200 text-purple-800',
    [Level.Expert]: 'bg-red-200 text-red-800',
    [Level.Specialty]: 'bg-teal-200 text-teal-800',
}

const difficultyColors: Record<Difficulty, string> = {
    [Difficulty.Beginner]: 'text-green-600',
    [Difficulty.Intermediate]: 'text-yellow-600',
    [Difficulty.Advanced]: 'text-red-600',
}

// FIX: Explicitly type the 'icon' prop to allow passing a 'className' via React.cloneElement, resolving a TypeScript error.
const DetailItem: React.FC<{ icon: React.ReactElement<{ className?: string }>; value: React.ReactNode; colorClass?: string; }> = ({ icon, value, colorClass = 'text-slate-600' }) => (
    <div className={`flex items-center gap-2 text-sm ${colorClass}`}>
        {React.cloneElement(icon, { className: "w-4 h-4" })}
        <span className="font-medium">{value}</span>
    </div>
);

export const CertificationCard: React.FC<CertificationCardProps> = ({ certification, isDimmed, isPrerequisite, isLeadsTo, onMouseEnter, onMouseLeave, onClick }) => {
    const { id, name, provider, level, examCode, cost, duration, difficulty } = certification;
    const styles = providerStyles[provider];
    const Icon = styles.icon;
    
    let ringClass = '';
    if (isPrerequisite) ringClass = 'ring-4 ring-offset-2 ring-sky-500';
    if (isLeadsTo) ringClass = 'ring-4 ring-offset-2 ring-fuchsia-500';

    return (
        <button 
            onClick={() => onClick(id)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 flex flex-col text-left w-full
                ${isDimmed ? 'opacity-30 scale-95' : 'hover:shadow-xl hover:-translate-y-1'}
                ${ringClass}
            `}>
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <Icon className="w-8 h-8" />
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${styles.levelBg} ${styles.levelText}`}>{provider}</span>
                    </div>
                     <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${levelColors[level]}`}>{level}</span>
                </div>
                <h3 className="text-base font-bold text-slate-800">{name}</h3>
                <p className="text-xs text-slate-500 mb-4">{examCode}</p>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <DetailItem icon={<CostIcon />} value={`$${cost}`} />
                    <DetailItem icon={<TimeIcon />} value={`${duration}h study`} />
                    <DetailItem icon={<DifficultyIcon />} value={difficulty} colorClass={difficultyColors[difficulty]} />
                </div>
            </div>
             <div className={`h-2 w-full ${isPrerequisite ? 'bg-sky-500' : isLeadsTo ? 'bg-fuchsia-500' : 'bg-slate-100'}`}></div>
        </button>
    );
};

// Icons
const CostIcon: React.FC<{className?: string}> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" /></svg>;
const TimeIcon: React.FC<{className?: string}> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const DifficultyIcon: React.FC<{className?: string}> = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" /></svg>;