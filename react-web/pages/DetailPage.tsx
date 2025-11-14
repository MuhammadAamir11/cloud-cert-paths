import React from 'react';
import { Certification, CloudProvider, Difficulty, Level, Resources } from '../types';
import { CertificationBadge } from '../components/CertificationBadge';

interface DetailPageProps {
    certification: Certification;
    allCertifications: Certification[];
    onBack: () => void;
    onSelectCert: (certId: string) => void;
}

const providerColors: Record<CloudProvider, { bg: string; text: string; }> = {
    [CloudProvider.AWS]: { bg: 'bg-orange-50', text: 'text-orange-800' },
    [CloudProvider.Azure]: { bg: 'bg-blue-50', text: 'text-blue-800' },
    [CloudProvider.GCP]: { bg: 'bg-green-50', text: 'text-green-800' },
};

const levelColors: Record<Level, string> = {
    [Level.Fundamental]: 'bg-pink-100 text-pink-800',
    [Level.Associate]: 'bg-indigo-100 text-indigo-800',
    [Level.Professional]: 'bg-purple-100 text-purple-800',
    [Level.Expert]: 'bg-red-100 text-red-800',
    [Level.Specialty]: 'bg-teal-100 text-teal-800',
}

const PathCard: React.FC<{cert?: Certification; onClick: (id: string) => void}> = ({ cert, onClick }) => {
    if (!cert) return <div className="p-4 text-center text-sm bg-slate-100 rounded-lg text-slate-500">None</div>;
    
    return (
        <button onClick={() => onClick(cert.id)} className="w-full text-left p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all">
            <p className="font-bold text-sm text-slate-800">{cert.name}</p>
            <p className="text-xs text-slate-500">{cert.provider} - {cert.level}</p>
        </button>
    )
}

const MetricCard: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; }> = ({ icon, label, value }) => (
    <div className="bg-slate-100/60 p-4 rounded-xl flex items-center gap-4">
        <div className="flex-shrink-0">{icon}</div>
        <div>
            <p className="text-sm text-slate-600">{label}</p>
            <div className="text-lg font-bold text-slate-900">{value}</div>
        </div>
    </div>
);

const ResourceLink: React.FC<{href: string, icon: React.ReactNode, text: string}> = ({ href, icon, text }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">{icon}</div>
        <span className="text-sm font-medium text-slate-700 truncate">{text}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-400 ml-auto flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
    </a>
)

const ResourceSection: React.FC<{resources: Resources}> = ({ resources }) => {
    const hasUdemy = resources.udemy && resources.udemy.length > 0;
    const hasCoursera = resources.coursera && resources.coursera.length > 0;
    const hasYoutube = resources.youtube && resources.youtube.length > 0;

    if (!hasUdemy && !hasCoursera && !hasYoutube) return null;

    return (
        <section>
            <div className="flex items-center gap-2 mb-4">
                <ResourcesIcon />
                <h2 className="text-xl font-semibold text-slate-800">Learning Resources</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hasUdemy && (
                    <div className="space-y-2">
                        {resources.udemy?.map((link, i) => <ResourceLink key={i} href={link} icon={<UdemyIcon />} text="Udemy Course"/>)}
                    </div>
                )}
                {hasCoursera && (
                    <div className="space-y-2">
                        {resources.coursera?.map((link, i) => <ResourceLink key={i} href={link} icon={<CourseraIcon />} text="Coursera Course"/>)}
                    </div>
                )}
                {hasYoutube && (
                    <div className="space-y-2">
                        {resources.youtube?.map((link, i) => <ResourceLink key={i} href={link} icon={<YouTubeIcon />} text="YouTube Resource"/>)}
                    </div>
                )}
            </div>
        </section>
    );
};

export const DetailPage: React.FC<DetailPageProps> = ({ certification, allCertifications, onBack, onSelectCert }) => {
    const { name, examCode, provider, level, description, focusAreas, prerequisites, leadsTo, cost, duration, difficulty, passScore, validity, officialLink, resources } = certification;
    const colors = providerColors[provider];
    const certMap = new Map(allCertifications.map(c => [c.id, c]));

    const difficultyBadgeColor: Record<Difficulty, string> = {
        [Difficulty.Beginner]: 'bg-green-200 text-green-800',
        [Difficulty.Intermediate]: 'bg-yellow-200 text-yellow-800',
        [Difficulty.Advanced]: 'bg-red-200 text-red-800',
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <header className="mb-8">
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                    Back to Path Explorer
                </button>
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${colors.bg} ${colors.text} ring-1 ring-inset ring-current`}>{provider}</span>
                             <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${levelColors[level]}`}>{level}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">{name}</h1>
                        <p className="text-slate-500 mt-1">{examCode}</p>
                    </div>
                     <CertificationBadge certification={certification} />
                </div>
            </header>
            
            <a href={officialLink} target="_blank" rel="noopener noreferrer" className="mb-8 w-full bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-blue-500 transition-colors duration-200 flex items-center justify-center gap-2">
                Visit Official Page
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            </a>

            <div className="space-y-10">
                <section>
                    <p className="text-slate-600 leading-relaxed text-lg">{description}</p>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetricCard icon={<CostIcon />} label="Exam Cost" value={`$${cost}`} />
                    <MetricCard icon={<TimeIcon />} label="Study Time" value={`${duration} hours`} />
                    <MetricCard 
                        icon={<DifficultyIcon />} 
                        label="Difficulty" 
                        value={<span className={`px-2 py-0.5 text-sm font-semibold rounded-md ${difficultyBadgeColor[difficulty]}`}>{difficulty}</span>}
                    />
                    <MetricCard icon={<PassIcon />} label="Pass Score" value={`${passScore}%`} />
                    <MetricCard icon={<ValidityIcon />} label="Validity" value={`${validity} years`} />
                </section>
                
                 <section>
                    <div className="flex items-center gap-2 mb-4">
                        <KeyTopicsIcon/>
                        <h2 className="text-xl font-semibold text-slate-800">Key Topics</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {focusAreas.map(area => (
                            <span key={area} className="bg-slate-200 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-lg">{area}</span>
                        ))}
                    </div>
                </section>
                
                 <ResourceSection resources={resources} />

                 <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                       <h2 className="text-lg font-semibold text-slate-800 mb-3">Prerequisites</h2>
                       <div className="space-y-3">
                        {prerequisites.length > 0 ? (
                            prerequisites.map(id => <PathCard key={id} cert={certMap.get(id)} onClick={onSelectCert} />)
                        ) : <PathCard onClick={() => {}} />}
                       </div>
                    </div>
                     <div>
                       <h2 className="text-lg font-semibold text-slate-800 mb-3">Leads To</h2>
                       <div className="space-y-3">
                         {leadsTo.length > 0 ? (
                            leadsTo.map(id => <PathCard key={id} cert={certMap.get(id)} onClick={onSelectCert} />)
                        ) : <PathCard onClick={() => {}} />}
                       </div>
                    </div>
                </section>
            </div>
        </div>
    );
};


// Colorful Icons
const CostIcon: React.FC = () => (
    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
        </svg>
    </div>
);
const TimeIcon: React.FC = () => (
    <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    </div>
);
const DifficultyIcon: React.FC = () => (
    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6a2 2 0 100-4 2 2 0 000 4zm0 14a2 2 0 100-4 2 2 0 000 4zm6-8a2 2 0 100-4 2 2 0 000 4zm-12 0a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
    </div>
);
const PassIcon: React.FC = () => (
    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    </div>
);
const ValidityIcon: React.FC = () => (
    <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    </div>
);
const KeyTopicsIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
    </div>
);
const ResourcesIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
    </div>
);

// Resource Icons
const UdemyIcon: React.FC = () => <img src="https://www.udemy.com/staticx/udemy/images/v-6/favicon-96x96.png" alt="Udemy" className="w-5 h-5"/>;
const CourseraIcon: React.FC = () => <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Coursera-Logo_600x600.svg/2048px-Coursera-Logo_600x600.svg.png" alt="Coursera" className="w-5 h-5"/>;
const YouTubeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);