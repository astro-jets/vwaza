import React, { useState, useRef, useEffect, type ReactNode } from 'react';
import { FaSpinner, FaUser, FaCog, FaHistory } from 'react-icons/fa';
import { BsList } from 'react-icons/bs';
import { AuthProvider, useAuth } from '~/context/AuthContext';
import ArtistSidebar from './ArtistSidebar';
import { IoNotifications } from 'react-icons/io5';

interface ArtistLayoutProps {
    children: ReactNode;
}

const BG_DARK = "bg-neutral-800";
const HEADER_BG = "bg-neutral-900"; // Slightly darker for contrast

const ArtistLayoutContent: React.FC<ArtistLayoutProps> = ({ children }) => {
    const { user, loading, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // State for Dropdowns
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Refs for outside click detection
    const notificationRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) {
        return <div className="bg-[#222] min-h-screen flex items-center justify-center text-white"> <FaSpinner size={60} className="animate-spin fill-red-500" /> </div>;
    }

    if (!user) {
        if (typeof window !== "undefined") window.location.href = "/login";
        return null;
    }

    return (
        <div className={`flex min-h-screen ${BG_DARK}`}>
            <ArtistSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}>
                <header className={`p-4 ${HEADER_BG} shadow-md hidden md:flex items-center justify-between border-b border-red-500 relative z-40`}>
                    <BsList
                        className='fill-white cursor-pointer hover:scale-110 transition-transform text-2xl'
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    />

                    <div className="flex items-center space-x-6">

                        {/* Notification Dropdown */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 text-gray-400 hover:text-white transition-colors hover:bg-neutral-800 rounded-full"
                            >
                                <IoNotifications className="w-6 h-6" />
                                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-neutral-900"></span>
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-80 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                                    <div className="p-3 border-b border-neutral-800 font-bold text-white flex justify-between">
                                        <span>Notifications</span>
                                        <span className="text-red-500 text-xs cursor-pointer">Mark all as read</span>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                        <NotificationItem title="New Stream Milestone" desc="Your latest track hit 1,000 streams!" time="2h ago" />
                                        <NotificationItem title="Release Approved" desc="'Summer Vibes' is now live on all platforms." time="5h ago" />
                                        <NotificationItem title="Payment Received" desc="Royalties for November have been processed." time="1d ago" />
                                        <NotificationItem title="Payment Received" desc="Royalties for November have been processed." time="1d ago" />
                                        <NotificationItem title="Paymen▬t Received" desc="Royalties for November have been processed." time="1d ago" />
                                    </div>
                                    <div className="p-2 text-center border-t border-neutral-800 text-sm text-neutral-400 hover:text-white cursor-pointer">
                                        View All Activity
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-3 p-1 pr-3 hover:bg-neutral-800 rounded-full transition-colors border border-transparent hover:border-neutral-700"
                            >
                                <div className="h-9 w-9 bg-neutral-700 rounded-full border border-red-500 overflow-hidden">
                                    <img src={'/img.png'} className='w-full h-full object-cover' alt="profile" />
                                </div>
                                <span className="text-white font-medium text-sm hidden lg:block">{user.username || "Artist"}</span>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-3 w-56 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-2 border-b border-neutral-800 mb-2">
                                        <p className="text-xs text-neutral-500 uppercase font-bold tracking-tighter">Account</p>
                                        <p className="text-white text-sm truncate">{user.email}</p>
                                    </div>
                                    <UserMenuItem icon={<FaUser />} label="My Profile" />
                                    <UserMenuItem icon={<FaHistory />} label="Payout History" />
                                    <UserMenuItem icon={<FaCog />} label="Settings" />
                                    <hr className="my-2 border-neutral-800" />
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className={`flex-1 overflow-y-auto ${BG_DARK}`}>
                    {children}
                </main>
            </div>
        </div>
    );
};

// --- Helper Components for Dropdown Items ---

const NotificationItem = ({ title, desc, time }: { title: string, desc: string, time: string }) => (
    <div className="p-4 border-b border-neutral-800 hover:bg-neutral-800/50 cursor-pointer transition-colors">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-neutral-400 mt-1">{desc}</p>
        <p className="text-[10px] text-neutral-500 mt-2">{time}</p>
    </div>
);

const UserMenuItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <div className="px-4 py-2 flex items-center space-x-3 text-neutral-300 hover:text-white hover:bg-neutral-800 cursor-pointer transition-colors text-sm">
        <span className="text-neutral-500 group-hover:text-red-500">{icon}</span>
        <span>{label}</span>
    </div>
);

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