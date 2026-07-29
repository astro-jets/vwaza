import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiMusic } from "react-icons/fi";
import { Link } from "react-router";
import { useAuth } from "~/context/AuthContext";

interface Playlist {
    id: string;
    title: string;
    description?: string;
    cover_url?: string;
    is_public: boolean;
    created_at: string;
    track_count: number;
}

const PlayListsGrid: React.FC = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            fetchPlaylists();
        }
    }, [token]);

    const fetchPlaylists = async () => {
        try {
            setLoading(true);
            const res = await axios.get<Playlist[]>("http://localhost:3001/playlist", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlaylists(res.data);
            setFilteredPlaylists(res.data);
        } catch (err) {
            console.error("Error fetching playlists:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = playlists.filter(playlist =>
            playlist.title.toLowerCase().includes(query.toLowerCase()) ||
            playlist.description?.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredPlaylists(filtered);
    };

    const baseClasses = "min-h-screen text-neutral-950";

    return (
        <div className="p-4">
            {/* Header */}
            <div className="w-full flex justify-center items-center mb-8">
                <div>
                    <h1 className="text-xl md:text-4xl font-black text-white mb-2 tracking-tight">
                        YOUR <span className="text-red-600">PLAYLISTS</span>
                    </h1>
                </div>
            </div>

            {/* Search and New Playlist Action */}
            <div className="w-full flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 bg-black rounded-xl px-4 py-3 border border-neutral-800 w-sm">
                    <FiSearch className="text-neutral-500" />
                    <input
                        placeholder="Search Playlist..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="bg-transparent outline-none text-white text-sm w-full"
                    />
                </div>

                <Link
                    to="/artists/newplaylist"
                    className="bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-xl font-medium h-10 text-white flex items-center justify-center"
                >
                    + New Playlist
                </Link>
            </div>

            {/* Grid View */}
            <div className={baseClasses}>
                {loading ? (
                    <div className="flex justify-center items-center h-64 text-neutral-400">
                        Loading playlists...
                    </div>
                ) : playlists.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
                        <p className="mb-4">You haven’t created any playlists yet.</p>
                        <Link
                            to="/artists/newplaylist"
                            className="underline text-red-400"
                        >
                            Create your first playlist
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {filteredPlaylists?.map((playlist) => {
                            return (
                                <Link
                                    to={`/artists/playlists/${playlist.id}`}
                                    key={playlist.id}
                                    className="bg-neutral-900/50 border border-neutral-700 p-3 rounded-2xl shadow-lg hover:border-red-600/50 transition group"
                                >
                                    <div className="flex flex-col">
                                        <div className="w-full rounded-2xl h-48 overflow-hidden bg-neutral-800 flex items-center justify-center relative">
                                            {playlist.cover_url ? (
                                                <img
                                                    src={`/uploads/images/${playlist.cover_url}`}
                                                    alt={playlist.title}
                                                    className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                                                />
                                            ) : (
                                                <FiMusic className="text-neutral-600 w-12 h-12" />
                                            )}
                                        </div>
                                        <div className="mt-3">
                                            <h3 className="text-xl font-bold text-white truncate">{playlist.title}</h3>
                                            {playlist.description && (
                                                <p className="text-neutral-400 text-xs line-clamp-1 mt-1">
                                                    {playlist.description}
                                                </p>
                                            )}
                                            <p className="text-neutral-500 text-xs font-medium uppercase tracking-wider mt-2">
                                                {playlist.track_count || 0} Tracks
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayListsGrid;