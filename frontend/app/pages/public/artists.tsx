import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router';
import { BiSearch, BiUser, BiMusic, BiCheckCircle } from 'react-icons/bi';

export interface ArtistSummary {
    id: string;
    username: string;
    artist_name?: string;
    email?: string;
    cover_url?: string;
    track_count?: number;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function ArtistsPage() {
    const [artists, setArtists] = useState<ArtistSummary[]>([]);
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch initial artists or search results
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchArtists(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const fetchArtists = async (query: string) => {
        setLoading(true);
        try {
            const endpoint = query.trim().length >= 2
                ? `/artists/search?query=${encodeURIComponent(query)}`
                : '/artists';

            const res = await fetch(endpoint);
            if (res.ok) {
                const data = await res.json();
                setArtists(data);
            }
        } catch (err) {
            console.error('Failed to fetch artists:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d12] text-slate-100 p-6 md:p-10 pb-32">
            {/* Header */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                        Explore Artists
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Discover underground creators, producers, and lyricists.
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search artists..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#161622] border border-slate-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-sm placeholder:text-slate-500"
                    />
                </div>
            </div>

            {/* Grid Content */}
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="h-64 rounded-2xl bg-slate-800/40 animate-pulse border border-slate-800/40" />
                        ))}
                    </div>
                ) : artists.length === 0 ? (
                    <div className="text-center py-20 bg-[#161622] rounded-3xl border border-slate-800/80 p-8">
                        <h3 className="text-lg font-semibold text-slate-300">No artists found</h3>
                        <p className="text-slate-500 text-sm mt-1">Try searching for another username or artist name.</p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                    >
                        {artists.map((artist) => {
                            const displayName = artist.artist_name || artist.username;

                            return (
                                <motion.div key={artist.id} variants={itemVariants}>
                                    <Link
                                        to={`/artists/${artist.id}`}
                                        className="group relative flex flex-col items-center text-center bg-[#161622] p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 hover:bg-[#1c1c2b] transition-all duration-300 shadow-lg"
                                    >
                                        {/* Avatar */}
                                        <div className="relative aspect-square w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-slate-900 mb-4 border-2 border-slate-800 group-hover:border-red-500/50 transition-colors">
                                            <img
                                                src={
                                                    artist.cover_url
                                                        ? `/uploads/images/${artist.cover_url}`
                                                        : `https://api.dicebear.com/7.x/bottts/svg?seed=${artist.username}`
                                                }
                                                alt={displayName}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex items-center gap-1 max-w-full">
                                            <h3 className="text-base font-bold text-slate-100 group-hover:text-red-500 transition-colors truncate">
                                                {displayName}
                                            </h3>
                                        </div>

                                        <p className="text-xs text-slate-500 truncate mt-0.5">
                                            @{artist.username}
                                        </p>

                                        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-950/40 border border-red-900/40 px-3 py-1 rounded-full">
                                            Artist
                                        </span>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
}