import React from 'react';
import { Page } from '../App';
import { CloudProvider } from '../types';
import { AwsIcon, AzureIcon, GcpIcon } from './ProviderIcons';

interface SidebarProps {
    activePage: Page;
    onNavigate: (page: Page) => void;
    onProviderSelect: (provider: CloudProvider) => void;
    isOpen: boolean;
    onClose: () => void;
}

// FIX: Explicitly type the 'icon' prop to allow passing a 'className' via React.cloneElement.
const NavItem: React.FC<{ icon: React.ReactElement<{ className?: string }>; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
        }`}
    >
        {React.cloneElement(icon, { className: "w-5 h-5 mr-3" })}
        {label}
    </button>
);

// FIX: Explicitly type the 'icon' prop to allow passing a 'className' via React.cloneElement.
const ProviderItem: React.FC<{ icon: React.ReactElement<{ className?: string }>; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
     <button
        onClick={onClick}
        className="flex items-center w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
    >
        {React.cloneElement(icon, { className: "w-5 h-5 mr-3" })}
        {label}
    </button>
);


export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, onProviderSelect, isOpen, onClose }) => {
    return (
        <>
            {/* Overlay for mobile */}
            <div 
                className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            ></div>

            <aside className={`w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col p-4 fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center gap-2 px-2 py-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06l7.5 7.5a.75.75 0 0 0 1.06-1.06l-7.5-7.5Z" />
                          <path d="M12.78 5.22a.75.75 0 0 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-slate-800">CloudPath</h1>
                        <p className="text-xs text-slate-500">Certification Navigator</p>
                    </div>
                </div>

                <nav className="mt-6 space-y-2">
                    <h2 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation</h2>
                    <NavItem icon={<HomeIcon />} label="Home" isActive={activePage === 'Home'} onClick={() => onNavigate('Home')} />
                    <NavItem icon={<PathExplorerIcon />} label="Path Explorer" isActive={activePage === 'Path Explorer'} onClick={() => onNavigate('Path Explorer')} />
                    <NavItem icon={<CompareIcon />} label="Compare" isActive={activePage === 'Compare'} onClick={() => onNavigate('Compare')} />
                </nav>

                <div className="mt-8 space-y-2">
                     <h2 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cloud Providers</h2>
                     <ProviderItem icon={<AwsIcon />} label="Amazon Web Services" onClick={() => onProviderSelect(CloudProvider.AWS)} />
                     <ProviderItem icon={<AzureIcon />} label="Microsoft Azure" onClick={() => onProviderSelect(CloudProvider.Azure)} />
                     <ProviderItem icon={<GcpIcon />} label="Google Cloud Platform" onClick={() => onProviderSelect(CloudProvider.GCP)} />
                </div>

                <div className="mt-auto">
                     <nav className="space-y-2 mb-4">
                        <NavItem icon={<AboutIcon />} label="About" isActive={activePage === 'About'} onClick={() => onNavigate('About')} />
                        <NavItem icon={<ContactIcon />} label="Contact Us" isActive={activePage === 'Contact'} onClick={() => onNavigate('Contact')} />
                    </nav>
                    <div className="p-4 bg-gradient-to-br from-violet-100 to-blue-100 rounded-lg text-center">
                        <div className="w-10 h-10 bg-white rounded-full mx-auto flex items-center justify-center shadow-md mb-2">
                            <SparklesIcon className="w-6 h-6 text-violet-500" />
                        </div>
                        <h3 className="font-bold text-sm text-slate-800">Find Your Path</h3>
                        <p className="text-xs text-slate-600 mt-1">Interactive learning paths</p>
                    </div>
                </div>
            </aside>
        </>
    );
};


// Icons
const HomeIcon: React.FC<{className?: string}> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

const PathExplorerIcon: React.FC<{className?: string}> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
    </svg>
);

const CompareIcon: React.FC<{className?: string}> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
);

const AboutIcon: React.FC<{className?: string}> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
);

const ContactIcon: React.FC<{className?: string}> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
);


const SparklesIcon: React.FC<{className?: string}> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);
