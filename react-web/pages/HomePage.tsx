import React from 'react';
import { Page } from '../App';
import { Certification, CloudProvider } from '../types';
import { AwsIcon, AzureIcon, GcpIcon } from '../components/ProviderIcons';

interface HomePageProps {
    onNavigate: (page: Page) => void;
    allCertifications: Certification[];
    onProviderSelect: (provider: CloudProvider) => void;
}

const ProviderStatCard: React.FC<{ provider: CloudProvider, count: number, bgColor: string, textColor: string, Icon: React.FC<{className?: string}>, onClick: () => void }> = ({ provider, count, bgColor, textColor, Icon, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-4 rounded-xl shadow-md ${bgColor} hover:shadow-lg hover:-translate-y-1 transition-all`}>
        <div className="flex items-center">
            <div className={`w-16 h-16 rounded-lg bg-white shadow-sm flex items-center justify-center`}>
                <Icon className="w-9 h-9" />
            </div>
            <div className="ml-4 text-left">
                <p className={`text-4xl font-extrabold ${textColor}`}>{count}</p>
                <p className={`font-semibold ${textColor}`}>{provider === 'GCP' ? 'Google Cloud' : provider === 'Azure' ? 'Microsoft Azure' : 'Amazon Web Services'}</p>
            </div>
        </div>
    </button>
);

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, allCertifications, onProviderSelect }) => {
    const providerCounts = allCertifications.reduce((acc, cert) => {
        acc[cert.provider] = (acc[cert.provider] || 0) + 1;
        return acc;
    }, {} as Record<CloudProvider, number>);
    
    return (
        <div className="w-full h-full flex flex-col">
            <div className="w-full main-gradient flex-grow flex items-center justify-center p-4 md:p-8">
                <div className="text-center text-white max-w-4xl">
                    <div className="inline-block bg-white/20 backdrop-blur-sm text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                        ✨ Your Cloud Career Journey Starts Here
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        Navigate Your Path to
                        <span className="block mt-2 md:mt-4 bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white">Cloud Certification Success</span>
                    </h1>
                    <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-white/80">
                        Explore certification paths, compare options, and discover your next career milestone across AWS, Azure, and Google Cloud Platform.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => onNavigate('Path Explorer')}
                            className="bg-white text-blue-700 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-slate-100 transition-all duration-200 flex items-center gap-2"
                        >
                            <PathExplorerIcon className="w-5 h-5" />
                            Explore Learning Paths
                        </button>
                        <button
                            onClick={() => onNavigate('Path Explorer')}
                            className="bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
                        >
                             <DetailsIcon className="w-5 h-5" />
                             Certification Details
                        </button>
                        <button
                            onClick={() => onNavigate('Compare')}
                            className="bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
                        >
                             <CompareIcon className="w-5 h-5" />
                             Compare Certifications
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-slate-100 p-4 md:p-8">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                   <ProviderStatCard provider={CloudProvider.AWS} count={providerCounts.AWS || 0} bgColor="bg-gradient-to-br from-orange-50 to-amber-100" textColor="text-orange-900" Icon={AwsIcon} onClick={() => onProviderSelect(CloudProvider.AWS)} />
                   <ProviderStatCard provider={CloudProvider.Azure} count={providerCounts.Azure || 0} bgColor="bg-gradient-to-br from-blue-50 to-sky-100" textColor="text-blue-900" Icon={AzureIcon} onClick={() => onProviderSelect(CloudProvider.Azure)} />
                   <ProviderStatCard provider={CloudProvider.GCP} count={providerCounts.GCP || 0} bgColor="bg-gradient-to-br from-green-50 to-emerald-100" textColor="text-green-900" Icon={GcpIcon} onClick={() => onProviderSelect(CloudProvider.GCP)} />
                </div>
            </div>
        </div>
    );
};


// Icons
const PathExplorerIcon: React.FC<{className?: string}> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
    </svg>
);

const CompareIcon: React.FC<{className?: string}> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
);

const DetailsIcon: React.FC<{className?: string}> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);
