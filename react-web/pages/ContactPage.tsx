import React from 'react';

export const ContactPage: React.FC = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thank you for your message! This is a demo form and the message was not actually sent.");
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <header className="mb-12 text-center">
                <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl shadow-lg mb-4">
                    <MailIcon className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Get In Touch</h1>
                <p className="text-slate-500 mt-3 text-lg max-w-2xl mx-auto">
                    Have questions, suggestions, or feedback? We'd love to hear from you!
                </p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Column: Form */}
                <div className="lg:col-span-3 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <PencilSquareIcon className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl font-bold text-slate-800">Send Us a Message</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Your Name</label>
                                <input type="text" id="name" name="name" required className="bg-white block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition" placeholder="John Doe" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                                <input type="email" id="email" name="email" required className="bg-white block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition" placeholder="john@example.com" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
                            <input type="text" id="subject" name="subject" required className="bg-white block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition" placeholder="What's this about?" />
                        </div>
                         <div>
                            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                            <textarea id="message" name="message" rows={5} required className="bg-white block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition" placeholder="Tell us more about your inquiry..."></textarea>
                        </div>
                        <div className="text-left">
                            <button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2">
                                <PaperAirplaneIcon className="w-5 h-5" />
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Column: Info Cards */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Contact Information</h3>
                        <div className="space-y-3 text-sm">
                            <p className="text-slate-500">Email</p>
                            <a href="mailto:support@cloudpath.com" className="font-semibold text-indigo-600 hover:underline">support@cloudpath.com</a>
                            <p className="text-slate-500 pt-2">Response Time</p>
                            <p className="font-semibold text-slate-800">Within 24-48 hours</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                         <h3 className="font-bold text-slate-800 mb-4">Follow Us</h3>
                         <div className="space-y-3">
                            <SocialLink icon={<TwitterIcon/>} platform="Twitter" handle="@cloudpath" />
                            <SocialLink icon={<LinkedInIcon/>} platform="LinkedIn" handle="CloudPath" />
                            <SocialLink icon={<GitHubIcon/>} platform="GitHub" handle="cloudpath" />
                         </div>
                    </div>
                     <div className="bg-slate-100 p-4 rounded-lg text-xs text-slate-600">
                        <strong>Note:</strong> CloudPath is an independent resource and is not affiliated with AWS, Microsoft Azure, or Google Cloud Platform. All certification information is sourced from official provider documentation.
                    </div>
                </div>
            </div>
        </div>
    );
};

// Local Components & Icons
const SocialLink: React.FC<{icon: React.ReactNode, platform: string, handle: string}> = ({ icon, platform, handle }) => (
    <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
        <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
        <div>
            <p className="font-semibold text-sm text-slate-800">{platform}</p>
            <p className="text-xs text-slate-500">{handle}</p>
        </div>
    </a>
);

const MailIcon: React.FC<{ className?: string }> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const PencilSquareIcon: React.FC<{ className?: string }> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const PaperAirplaneIcon: React.FC<{ className?: string }> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

const TwitterIcon: React.FC = () => (
    <svg className="w-6 h-6 text-[#1DA1F2]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085c.645 1.936 2.523 3.342 4.743 3.38a9.88 9.88 0 01-6.115 2.107c-.398 0-.79-.023-1.175-.068a13.963 13.963 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
);
const LinkedInIcon: React.FC = () => (
    <svg className="w-6 h-6 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
);
const GitHubIcon: React.FC = () => (
    <svg className="w-6 h-6 text-[#181717]" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.156-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.089 2.91.833.091-.647.35-1.086.636-1.337-2.22-.253-4.555-1.113-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.446-1.27.098-2.642 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.82c.85.004 1.705.115 2.504.336 1.909-1.295 2.747-1.026 2.747-1.026.546 1.372.202 2.389.1 2.642.64.698 1.03 1.591 1.03 2.682 0 3.84-2.337 4.687-4.565 4.935.359.309.679.92.679 1.852 0 1.336-.012 2.415-.012 2.742 0 .268.18.578.688.48A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" />
    </svg>
);
