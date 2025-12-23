import { useLocation, Link } from "react-router"; // Use Link to prevent full page reloads
import { FaHome, FaMusic, FaCloudUploadAlt, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "~/context/AuthContext";

const ArtistSidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    return (
        <aside className="w-64 bg-neutral-900 p-4 flex flex-col justify-between border-r border-red-500 shadow-2xl mb-30 fixed left-0 top-0 h-screen">
            <div>
                <div className="text-3xl font-extrabold mb-10 text-white tracking-widest text-center">
                    <span className="text-red-600">VW</span>AZA
                </div>

                <nav className="space-y-1">
                    <NavLink
                        icon={FaHome}
                        label="Dashboard"
                        href="/artists"
                        isActive={location.pathname === "/artists"}
                    />
                    <NavLink
                        icon={FaMusic}
                        label="My Releases"
                        href="/artists/releases"
                        isActive={location.pathname === "/artists/releases"}
                    />
                    <NavLink
                        icon={FaCloudUploadAlt}
                        label="New Upload"
                        href="/artists/upload"
                        isActive={location.pathname === "/artists/upload"}
                    />
                    <NavLink
                        icon={FaChartBar}
                        label="Analytics"
                        href="/artists/analytics"
                        isActive={location.pathname === "/artists/analytics"}
                    />
                </nav>
            </div>

            <div className="pt-4 border-t border-neutral-800">
                <button
                    onClick={logout}
                    className="w-full flex cursor-pointer items-center p-3 rounded-xl bg-red-600/10 text-red-500 shadow-[inset_0_0_20px_rgba(220,38,38,0.1)] group"
                >
                    <FaSignOutAlt className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                    <span className={`font-semibold `}>Logout</span>
                </button>
            </div>
        </aside>
    );
};

// --- Improved NavLink Component ---
const NavLink: React.FC<{ icon: any, label: string, isActive: boolean, href: string }> = ({ icon: Icon, label, isActive, href }) => {

    // Distinct "Senior" UI Styles: Glass effect + Left Border + Red Glow
    const activeClasses = "bg-red-600/10 text-red-500 shadow-[inset_0_0_20px_rgba(220,38,38,0.1)]";
    const defaultClasses = "text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200";

    return (
        <Link
            to={href}
            className={`flex items-center p-3 rounded-lg transition-all duration-300 group ${isActive ? activeClasses : defaultClasses}`}
        >
            <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-red-500" : "group-hover:text-white"}`} />
            <span className="font-bold tracking-tight">{label}</span>
        </Link>
    );
};

export default ArtistSidebar;