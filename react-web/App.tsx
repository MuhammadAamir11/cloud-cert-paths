import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { fetchCertificationData } from './services/geminiService';
import { Certification, CloudProvider } from './types';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { HomePage } from './pages/HomePage';
import { PathExplorerPage } from './pages/PathExplorerPage';
import { ComparePage } from './pages/ComparePage';
import { DetailPage } from './pages/DetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

export type Page = 'Home' | 'Path Explorer' | 'Compare' | 'About' | 'Contact';

const App: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  
  const [activePage, setActivePage] = useState<Page>('Home');
  const [initialProviderFilter, setInitialProviderFilter] = useState<CloudProvider | null>(null);
  const [detailCertId, setDetailCertId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const loadData = useCallback(async () => {
    setStatus('loading');
    setError(null);
    setDetailCertId(null);
    try {
      const data = await fetchCertificationData();
      setCertifications(data);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch certification data from Gemini. Please ensure your API key is configured correctly and try again.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleProviderSelect = (provider: CloudProvider) => {
    setDetailCertId(null);
    setActivePage('Path Explorer');
    setInitialProviderFilter(provider);
    setSidebarOpen(false);
  }

  const handleNavigate = (page: Page) => {
    setDetailCertId(null);
    setActivePage(page);
    setSidebarOpen(false);
    // Reset initial filter when navigating away from explorer via sidebar
    if (page !== 'Path Explorer') {
        setInitialProviderFilter(null);
    }
  }

  const handleCertSelect = (certId: string) => {
    setDetailCertId(certId);
  }

  const handleDetailBack = () => {
    setDetailCertId(null);
    // After viewing a detail, we are always in the context of the path explorer
    setActivePage('Path Explorer');
  }

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <LoadingSpinner />
          <p className="mt-4 text-lg text-slate-500">Gemini is building your certification guide...</p>
          <p className="text-sm text-slate-400">This may take a moment.</p>
        </div>
      );
    }

    if (status === 'error') {
      return <div className="p-4 md:p-8"><ErrorDisplay message={error} onRetry={loadData} /></div>;
    }
    
    if (detailCertId) {
        const cert = certifications.find(c => c.id === detailCertId);
        if (cert) {
            return <DetailPage 
                        certification={cert} 
                        allCertifications={certifications} 
                        onBack={handleDetailBack}
                        onSelectCert={handleCertSelect}
                    />
        }
    }

    switch (activePage) {
        case 'Home':
            return <HomePage onNavigate={handleNavigate} allCertifications={certifications} onProviderSelect={handleProviderSelect} />;
        case 'Path Explorer':
            return <PathExplorerPage allCertifications={certifications} initialProvider={initialProviderFilter} onCertSelect={handleCertSelect} />;
        case 'Compare':
            return <ComparePage allCertifications={certifications} />;
        case 'About':
            return <AboutPage />;
        case 'Contact':
            return <ContactPage />;
        default:
            return <HomePage onNavigate={handleNavigate} allCertifications={certifications} onProviderSelect={handleProviderSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage={activePage} 
        onNavigate={handleNavigate} 
        onProviderSelect={handleProviderSelect}
      />
      <main className="flex-1 h-screen overflow-y-auto w-full">
        {/* Mobile Header */}
        <div className="md:hidden bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4 flex items-center sticky top-0 z-20">
            <button onClick={() => setSidebarOpen(true)} className="text-slate-600 mr-4 p-1" aria-label="Open menu">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06l7.5 7.5a.75.75 0 0 0 1.06-1.06l-7.5-7.5Z" />
                      <path d="M12.78 5.22a.75.75 0 0 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" />
                    </svg>
                </div>
                <h1 className="text-base font-bold text-slate-800">CloudPath</h1>
            </div>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
