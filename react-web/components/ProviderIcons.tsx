import React from 'react';
import { CloudProvider } from '../types';

// FIX: Replaced the official AWS logo SVG with a simple, reliable placeholder to fix rendering issues.
export const AwsIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="3" fill="#232F3E"/>
        <text x="12" y="16" 
            fontFamily="'Inter', sans-serif" 
            fontSize="9" 
            fontWeight="bold" 
            fill="white" 
            textAnchor="middle">
            AWS
        </text>
    </svg>
);


export const AzureIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.0996 11.025L0 13.25L10.05 24L14.95 13.25L9.9 11.025L5.0996 11.025Z" fill="#0072C6"/>
        <path d="M5.1 11.025L9.9 11.025L14.95 0L6.75 6.125L5.1 11.025Z" fill="#0072C6"/>
        <path d="M15.4 13.5L10.05 24L24 16.5L15.4 13.5Z" fill="#0072C6"/>
        <path d="M15.4 13.5L24 10.5L14.95 0L15.4 13.5Z" fill="#0072C6"/>
    </svg>
);


export const GcpIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.9 12.05C9.9 13.29 10.91 14.3 12.15 14.3C13.39 14.3 14.4 13.29 14.4 12.05C14.4 10.81 13.39 9.8 12.15 9.8C10.91 9.8 9.9 10.81 9.9 12.05Z" fill="#4285F4"/>
        <path d="M18 12.05C18 9.27 15.39 7 12.15 7C10.59 7 9.17 7.72 8.23 8.8L10.22 10.45C10.82 9.91 11.47 9.6 12.15 9.6C13.79 9.6 15.11 10.74 15.28 12.23L18 12.05Z" fill="#EA4335"/>
        <path d="M8.23 15.3L10.22 13.65C10.82 14.19 11.47 14.5 12.15 14.5C13.79 14.5 15.11 13.36 15.28 11.87L18 12.05C18 14.83 15.39 17.1 12.15 17.1C10.59 17.1 9.17 16.38 8.23 15.3Z" fill="#FBBC05"/>
        <path d="M3 12.05C3 9.27 5.25 7 8 7V9.6C6.55 9.6 5.39 10.71 5.39 12.05C5.39 13.39 6.55 14.5 8 14.5V17.1C5.25 17.1 3 14.83 3 12.05Z" fill="#34A853"/>
    </svg>
);

export const providerIcons: Record<CloudProvider, React.FC<{ className?: string }>> = {
    [CloudProvider.AWS]: AwsIcon,
    [CloudProvider.Azure]: AzureIcon,
    [CloudProvider.GCP]: GcpIcon,
};