import { useLocation, Link } from "react-router";
import { FaHome, FaMusic, FaCloudUploadAlt, FaChartBar, FaSignOutAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAuth } from "~/context/AuthContext";

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (val: boolean) => void;
}

const ArtistSidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();
    const { logout } = useAuth();

    return (
        <aside
            className={`hidden md:flex flex-col justify-between border-r border-red-500 shadow-2xl fixed left-0 top-0 h-screen bg-neutral-900 transition-all duration-300 z-50 
            ${isCollapsed ? "w-20 p-2" : "w-64 p-4"}`}
        >
            <div>

                <div className={`text-3xl font-extrabold mb-10 text-white tracking-widest text-center transition-all ${isCollapsed ? "scale-75" : ""}`}>
                    <span className="text-red-600">VW</span>{!isCollapsed && "AZA"}
                </div>

                <nav className="space-y-2">
                    <NavLink icon={FaHome} label="Dashboard" href="/artists" isActive={location.pathname === "/artists"} isCollapsed={isCollapsed} />
                    <NavLink icon={FaMusic} label="My Releases" href="/artists/releases" isActive={location.pathname === "/artists/releases"} isCollapsed={isCollapsed} />
                    <NavLink icon={FaCloudUploadAlt} label="New Upload" href="/artists/upload" isActive={location.pathname === "/artists/upload"} isCollapsed={isCollapsed} />
                    <NavLink icon={FaChartBar} label="Analytics" href="/artists/analytics" isActive={location.pathname === "/artists/analytics"} isCollapsed={isCollapsed} />
                </nav>
            </div>

            <div className="pt-4 border-t border-neutral-800">
                <button
                    onClick={logout}
                    className={`flex cursor-pointer items-center p-3 rounded-xl bg-red-600/10 text-red-500 shadow-[inset_0_0_20px_rgba(220,38,38,0.1)] group transition-all duration-300 ${isCollapsed ? "justify-center" : "w-full"}`}
                    title={isCollapsed ? "Logout" : ""}
                >
                    <FaSignOutAlt className={`w-5 h-5 transition-transform ${!isCollapsed ? "mr-3 group-hover:translate-x-1" : ""}`} />
                    {!isCollapsed && <span className="font-semibold">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

const NavLink: React.FC<{ icon: any, label: string, isActive: boolean, href: string, isCollapsed: boolean }> = ({ icon: Icon, label, isActive, href, isCollapsed }) => {
    return (
        <Link
            to={href}
            title={isCollapsed ? label : ""}
            className={`flex items-center p-3 rounded-lg transition-all duration-300 group ${isActive ? "bg-red-600/10 text-red-500 shadow-[inset_0_0_20px_rgba(220,38,38,0.1)]" : "text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200"} ${isCollapsed ? "justify-center" : ""}`}
        >
            <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? "text-red-500" : "group-hover:text-white"} ${!isCollapsed ? "mr-3" : ""}`} />
            {!isCollapsed && <span className="font-bold tracking-tight whitespace-nowrap">{label}</span>}
        </Link>
    );
};

export default ArtistSidebar;