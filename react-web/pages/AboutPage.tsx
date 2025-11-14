import React from 'react';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 mb-3">
            {icon}
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">{children}</p>
    </div>
);

const AudienceCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="text-center">
        <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-md mb-4">
            {icon}
        </div>
        <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{children}</p>
    </div>
);

export const AboutPage: React.FC = () => {
    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">About CloudPath</h1>
                <p className="text-slate-500 mt-3 text-lg max-w-2xl mx-auto">Your AI-Powered Guide to Cloud Certification Success</p>
            </header>
            
            <div className="bg-white p-6 md:p-8 rounded-lg border border-slate-200 shadow-sm mb-12">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
                <p className="text-slate-600 leading-relaxed">
                    CloudPath was created to simplify the complex world of cloud certifications. We understand that choosing the right certification path can be overwhelming with so many options across different cloud providers. Our mission is to provide an intuitive, visual, and comprehensive platform that helps IT professionals, students, and cloud enthusiasts make informed decisions about their certification journey.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <FeatureCard icon={<InteractiveVisIcon />} title="Interactive Visualization">
                    Explore certification paths to see animated connections showing your next possible steps in your learning journey.
                </FeatureCard>
                <FeatureCard icon={<ComprehensiveDataIcon />} title="Comprehensive Data">
                    Access detailed information about every certification including exam codes, costs, difficulty levels, study hours, topics covered, prerequisites, and next steps - all verified against official sources.
                </FeatureCard>
                <FeatureCard icon={<MultiProviderIcon />} title="Multi-Provider Support">
                    Compare certifications across the three major cloud providers - AWS, Microsoft Azure, and Google Cloud Platform - all in one place with consistent, easy-to-understand metrics.
                </FeatureCard>
                <FeatureCard icon={<CareerPlanningIcon />} title="Career Planning">
                    Plan your certification roadmap strategically. See prerequisites, understand difficulty progression, and visualize how certifications build upon each other to advance your cloud career.
                </FeatureCard>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-lg border border-slate-200 shadow-sm mb-12">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">What We Offer</h2>
                <ul className="space-y-3 text-slate-600">
                    <li className="flex items-start"><span className="w-2 h-2 rounded-full bg-indigo-500 mt-2 mr-3 flex-shrink-0"></span><span><strong>Interactive Path Explorer:</strong> Visualize your certification journey with animated pathways that show connections between certifications.</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 rounded-full bg-sky-500 mt-2 mr-3 flex-shrink-0"></span><span><strong>Side-by-Side Comparison:</strong> Compare up to 3 certifications simultaneously to make informed decisions about your next step.</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 mr-3 flex-shrink-0"></span><span><strong>Detailed Certification Pages:</strong> Deep dive into each certification with comprehensive details, official links, and learning resources.</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 rounded-full bg-rose-500 mt-2 mr-3 flex-shrink-0"></span><span><strong>Official Resources:</strong> Direct links to official certification pages, exam guides, and training resources from AWS, Azure, and GCP.</span></li>
                </ul>
            </div>
            
            <section className="bg-gradient-to-br from-violet-50 to-fuchsia-50 p-6 md:p-8 rounded-lg border border-slate-200 shadow-sm mb-12">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <WhoWeServeIcon />
                    <h2 className="text-2xl font-bold text-slate-800">Who We Serve</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AudienceCard icon={<ITProfessionalsIcon />} title="IT Professionals">
                        Level up your skills and advance your career with strategic certification planning.
                    </AudienceCard>
                    <AudienceCard icon={<StudentsIcon />} title="Students">
                        Begin your Cloud journey with a clear understanding of certification paths.
                    </AudienceCard>
                    <AudienceCard icon={<CareerChangersIcon />} title="Career Changers">
                        Transition into cloud computing with a structured certification roadmap.
                    </AudienceCard>
                </div>
            </section>

             <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-blue-800 text-sm">
                    <strong>Disclaimer:</strong> CloudPath is a technology demonstrator application. While we strive for accuracy, all certification data is generated by an AI model and should be verified via the official links provided before making any financial or career decisions.
                </p>
            </div>
        </div>
    );
};

// Colorful Feature Icons
const InteractiveVisIcon: React.FC = () => (
    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
    </div>
);
const ComprehensiveDataIcon: React.FC = () => (
    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
    </div>
);
const MultiProviderIcon: React.FC = () => (
    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
    </div>
);
const CareerPlanningIcon: React.FC = () => (
    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
    </div>
);
// "Who We Serve" Icons
const WhoWeServeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);
const ITProfessionalsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v1.5M15.75 18.75V16.5m-7.5 2.25V16.5m-3.375 2.25V13.5m14.25 5.25V13.5M3 13.5h18M3 10.5h18M3 7.5h18M4.5 21h15a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0019.5 3h-15A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5z" />
    </svg>
);
const StudentsIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
);
const CareerChangersIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.953 14.953 0 00-2.582-2.582m2.582 2.582a14.923 14.923 0 01-5.841 2.582m5.841-2.582a14.923 14.923 0 00-5.841-2.582m0 0a14.953 14.953 0 00-2.582 2.582m2.582-2.582a6 6 0 015.84-7.38V5.13m0 4.82a14.936 14.936 0 00-5.841-2.582a14.936 14.936 0 00-5.841 2.582m5.841 2.582a14.923 14.923 0 01-5.841 2.582M9.16 8.41a5.996 5.996 0 01-5.841-7.38V1.03" />
    </svg>
);
