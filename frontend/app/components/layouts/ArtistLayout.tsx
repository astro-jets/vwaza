import React, { type ReactNode, useState } from 'react';
import { FaMusic, FaChartBar, FaCloudUploadAlt, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import { AuthProvider, useAuth } from '~/context/AuthContext';

interface ArtistLayoutProps {
    children: ReactNode;
}

const BG_DARK = "bg-neutral-800";
const SIDEBAR_BG = "bg-neutral-800";
const HEADER_BG = "bg-neutral-800";

// --- Inner Component that actually uses Auth ---
const ArtistLayoutContent: React.FC<ArtistLayoutProps> = ({ children }) => {
    // Now useAuth is safely inside the AuthProvider
    const { user, loading, logout } = useAuth();
    const [activeRoute] = useState<string>("/artist/");

    // Handle Loading State
    if (loading) {
        return <div className="bg-black min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    // Handle Protected Route Logic
    if (!user) {
        if (typeof window !== "undefined") window.location.href = "/login";
        return null;
    }

    return (
        <div className={`flex min-h-screen ${BG_DARK}`}>
            {/* Sidebar */}
            <aside className={`w-64 ${SIDEBAR_BG} p-4 flex flex-col justify-between border-r border-gray-700 shadow-lg`}>
                <div>
                    <div className="text-3xl font-extrabold mb-8 text-white tracking-widest text-center">
                        <span className="text-white">VW</span>AZA
                    </div>
                    <nav>
                        <NavLink icon={FaHome} label="Dashboard" href="/artists/" isActive={activeRoute === "/artists/"} />
                        <NavLink icon={FaMusic} label="My Releases" href="/artists/releases" isActive={activeRoute === "/artists/releases"} />
                        <NavLink icon={FaCloudUploadAlt} label="New Upload" href="/artists/upload" isActive={activeRoute === "/artists/upload"} />
                        <NavLink icon={FaChartBar} label="Analytics" href="/artists/analytics" isActive={activeRoute === "/artists/analytics"} />
                    </nav>
                </div>

                <div className="pb-4">
                    <button
                        onClick={logout}
                        className="w-full flex items-center p-3 rounded-lg text-gray-400 bg-gray-700 hover:bg-red-700 hover:text-white transition-all duration-200"
                    >
                        <FaSignOutAlt className="w-5 h-5 mr-3" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col">
                <header className={`p-4 ${HEADER_BG} shadow-md flex items-center justify-between border-b border-gray-700`}>
                    <div className="text-xl font-semibold text-white">
                        Welcome, {user?.username}!
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-700 rounded-full">
                            <IoMdMail className="w-6 h-6" />
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 border-2 border-gray-800"></span>
                        </button>
                        <div className="h-10 w-10 bg-white rounded-full border-2 border-gray-500"></div>
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

// --- Helper Component ---
const NavLink: React.FC<{ icon: any, label: string, isActive: boolean, href: string }> = ({ icon: Icon, label, isActive, href }) => {
    const activeClasses = "bg-gray-900 text-white border-l-4 border-white shadow-inner shadow-gray-900/30";
    const defaultClasses = "hover:bg-gray-700/50 text-gray-400";

    return (
        <a href={href} className={`flex items-center p-3 my-2 rounded-lg transition-all duration-200 ${isActive ? activeClasses : defaultClasses}`}>
            <Icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{label}</span>
        </a>
    );
};