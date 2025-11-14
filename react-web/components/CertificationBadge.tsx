import React from 'react';
import { Certification, CloudProvider, Level } from '../types';
import { AwsIcon, AzureIcon, GcpIcon } from './ProviderIcons';

interface CertificationBadgeProps {
    certification: Certification;
}

const providerStyles: Record<CloudProvider, { Icon: React.FC<{className?: string}>; gradient: string; }> = {
    [CloudProvider.AWS]: { Icon: AwsIcon, gradient: 'from-gray-700 to-gray-900' },
    [CloudProvider.Azure]: { Icon: AzureIcon, gradient: 'from-blue-500 to-blue-700' },
    [CloudProvider.GCP]: { Icon: GcpIcon, gradient: 'from-gray-50 to-gray-200' },
};

const levelText: Record<Level, string> = {
    [Level.Fundamental]: 'FUNDAMENTAL',
    [Level.Associate]: 'ASSOCIATE',
    [Level.Professional]: 'PROFESSIONAL',
    [Level.Expert]: 'EXPERT',
    [Level.Specialty]: 'SPECIALTY',
}

export const CertificationBadge: React.FC<CertificationBadgeProps> = ({ certification }) => {
    const styles = providerStyles[certification.provider];
    const textColor = certification.provider === 'GCP' ? 'text-gray-600' : 'text-white/80';
    
    return (
        <div className={`w-40 h-24 rounded-lg bg-gradient-to-br ${styles.gradient} p-2.5 flex flex-col justify-between shadow-lg`}>
            <div className="flex justify-between items-start">
                <styles.Icon className={certification.provider === 'GCP' ? 'w-5 h-5' : 'w-6 h-6'} />
                <span className={`font-black text-xs ${textColor} opacity-50`}>{certification.examCode}</span>
            </div>
            <div>
                 <h3 className={`text-xs font-bold leading-tight ${textColor}`}>{certification.name}</h3>
                 <p className={`text-[8px] font-bold tracking-widest opacity-60 ${textColor}`}>{levelText[certification.level]}</p>
            </div>
        </div>
    );
};
