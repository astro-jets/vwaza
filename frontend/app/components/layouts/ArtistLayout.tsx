import React, { type ReactNode } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import { AuthProvider, useAuth } from '~/context/AuthContext';
import ArtistSidebar from './ArtistSidebar';

interface ArtistLayoutProps {
    children: ReactNode;
}

const BG_DARK = "bg-neutral-800";
const HEADER_BG = "bg-neutral-800";

// --- Inner Component that actually uses Auth ---
const ArtistLayoutContent: React.FC<ArtistLayoutProps> = ({ children }) => {
    // Now useAuth is safely inside the AuthProvider
    const { user, loading } = useAuth();


    // Handle Loading State
    if (loading) {
        return <div className="bg-[#222] backdrop-blur-2xl min-h-screen flex items-center justify-center text-white"> <FaSpinner size={60} className="animate-spin fill-red-500" /> </div>;
    }

    // Handle Protected Route Logic
    if (!user) {
        if (typeof window !== "undefined") window.location.href = "/login";
        return null;
    }

    return (
        <div className={`flex justify-between min-h-screen ${BG_DARK}`}>
            <ArtistSidebar />

            {/* Main Area */}
            <div className="ml-64 flex-1 flex flex-col">
                <header className={`p-4 ${HEADER_BG} shadow-md flex items-center justify-between border-b border-red-500`}>
                    <div className="text-xl font-semibold text-white">
                        {user?.username}
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-700 rounded-full">
                            <IoMdMail className="w-6 h-6" />
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 border-2 border-red-800"></span>
                        </button>
                        <div className="h-10 w-10 bg-white rounded-full border-2 border-red-500"></div>
                    </div>
                </header>

                <main className={`flex-1 overflow-y-auto ${BG_DARK}`}>
                    {children}
                </main>
            </div>
        </div>
    );
};

// --- Main Export: Wraps everything in the Provider ---
const ArtistLayout: React.FC<ArtistLayoutProps> = ({ children }) => {
    return (
        <AuthProvider>
            <ArtistLayoutContent>
                {children}
            </ArtistLayoutContent>
        </AuthProvider>
    );
};

export default ArtistLayout;

