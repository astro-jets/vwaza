import React, { type ReactNode, useState } from 'react'; // <-- Import useState
import { FaUsers, FaChartLine, FaCog, FaSignOutAlt, FaFolderOpen } from 'react-icons/fa';
import { IoNotificationsSharp } from 'react-icons/io5';

interface AdminLayoutProps {
    children: ReactNode;
}

// --- Shared Color Variables ---
const ACCENT_COLOR = "red";
const BG_DARK = "bg-gray-900";
const SIDEBAR_BG = "bg-gray-800";
const TEXT_COLOR = "text-gray-100";
const HEADER_BG = "bg-gray-800"; // Slightly lighter than the page background

// --- Navigation Link Component ---
interface NavLinkProps {
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    href: string;
}

const NavLink: React.FC<NavLinkProps> = ({ icon: Icon, label, isActive, href }) => {
    const activeClasses = `bg-${ACCENT_COLOR}-800 text-white shadow-lg shadow-${ACCENT_COLOR}-900/40 border-l-4 border-${ACCENT_COLOR}-500`;
    const defaultClasses = "hover:bg-gray-700 text-gray-400";

    return (
        <a
            href={href}
            className={`flex items-center p-3 my-2 rounded-lg transition-all duration-200 ${isActive ? activeClasses : defaultClasses}`}
        >
            <Icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{label}</span>
        </a>
    );
};

// --- Layout Component ---
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    // FIX: Use useState<string> to allow comparison with other route strings.
    // In a real app, replace this with a hook like useLocation().pathname from your router.
    const [activeRoute] = useState<string>("/admin/dashboard");

    return (
        <div className={`flex min-h-screen ${BG_DARK}`}>
            {/* -------------------- Sidebar -------------------- */}
            <aside className={`w-64 ${SIDEBAR_BG} p-4 flex flex-col justify-between border-r border-gray-800 shadow-2xl`}>
                <div>
                    <div className="text-3xl font-extrabold mb-8 text-white tracking-widest text-center">
                        <span className={`text-${ACCENT_COLOR}-500`}>A</span>dmin
                    </div>

                    <nav>
                        <NavLink icon={FaChartLine} label="Dashboard" href="/admin/dashboard" isActive={activeRoute === "/admin/dashboard"} />
                        <NavLink icon={FaUsers} label="User Management" href="/admin/users" isActive={activeRoute === "/admin/users"} />
                        <NavLink icon={FaFolderOpen} label="All Releases" href="/admin/releases" isActive={activeRoute === "/admin/releases"} />
                        <NavLink icon={FaCog} label="Settings" href="/admin/settings" isActive={activeRoute === "/admin/settings"} />
                    </nav>
                </div>

                {/* Logout Button */}
                <div className="pb-4">
                    <button className={`w-full flex items-center p-3 rounded-lg text-gray-400 bg-gray-700 hover:bg-${ACCENT_COLOR}-600 hover:text-white transition-all duration-200`}>
                        <FaSignOutAlt className="w-5 h-5 mr-3" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* -------------------- Main Content Area -------------------- */}
            <div className="flex-1 flex flex-col">

                {/* -------------------- Navbar -------------------- */}
                <header className={`p-4 ${HEADER_BG} shadow-md flex items-center justify-between border-b border-gray-700`}>
                    <div className="text-xl font-semibold text-white">
                        Welcome, Admin User
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-700 rounded-full">
                            <IoNotificationsSharp className="w-6 h-6" />
                            <span className={`absolute top-0 right-0 h-2 w-2 rounded-full bg-${ACCENT_COLOR}-500 border-2 border-gray-800`}></span>
                        </button>
                        <div className="h-10 w-10 bg-gray-600 rounded-full border-2 border-white"></div> {/* Profile Avatar */}
                    </div>
                </header>

                {/* -------------------- Page Content -------------------- */}
                <main className={`flex-1 p-8 overflow-y-auto ${BG_DARK}`}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;