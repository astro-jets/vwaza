import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router';
import {
    BiPlay,
    BiMusic,
    BiFolderOpen,
    BiSearch
} from 'react-icons/bi';
import { useAudioStore, type Track } from 'stores/MusicStore';
import axios from 'axios';
import { useAuth } from '~/context/AuthContext';

export interface PlaylistSummary {
    id: string;
    title: string;
    description?: string;
    cover_url?: string;
    is_public: boolean;
    created_at: string;
    track_count: number;
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

export default function PlaylistsCatalogueTemplate() {
    const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const { token } = useAuth();
    const { setAudio, setQueue, setPlaying } = useAudioStore();

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:3001/playlist",
                { headers: { Authorization: `Bearer ${token}` } });
            if (res) {
                setPlaylists(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch playlists:', err);
        } finally {
            setLoading(false);
        }
    };

    // Quick Play entire playlist directly from card
    const handleQuickPlay = async (e: React.MouseEvent, playlistId: string) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const res = await fetch(`/artist/playlists/${playlistId}`);
            if (!res.ok) return;
            const data = await res.json();

            if (!data.tracks || data.tracks.length === 0) return;

            const formattedTracks: Track[] = data.tracks.map((t: any, idx: number) => ({
                id: t.id,
                title: t.title,
                genre: t.genre || 'Various',
                cover_url: data.cover_url || '',
                audio_url: t.audio_url,
                track_number: t.position || idx + 1,
                release_title: data.title,
                artist_name: t.artist_name || data.creator_name || 'Various Artists',
            }));

            setQueue(formattedTracks);
            setAudio(formattedTracks[0]);
            setPlaying(true);
        } catch (err) {
            console.error('Error starting quick play:', err);
        }
    };

    const filteredPlaylists = playlists.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#0d0d12] text-slate-100 p-6 md:p-10 pb-32">
            {/* Header */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                        Playlists
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Browse custom curated collections and underground mixes.
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                    <BiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search playlists..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#161622] border border-slate-800 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 text-sm placeholder:text-slate-500"
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
                ) : filteredPlaylists.length === 0 ? (
                    <div className="text-center py-20 bg-[#161622] rounded-3xl border border-slate-800/80 p-8">
                        <BiFolderOpen size={48} className="mx-auto text-slate-500 mb-3" />
                        <h3 className="text-lg font-semibold text-slate-300">No playlists found</h3>
                        <p className="text-slate-500 text-sm mt-1">Try searching for a different keyword or create one.</p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                    >
                        {filteredPlaylists.map((playlist) => (
                            <motion.div key={playlist.id} variants={itemVariants}>
                                <Link
                                    to={`/playlists/${playlist.id}`}
                                    className="group relative flex flex-col bg-[#161622] p-4 rounded-2xl border border-slate-800/80 hover:border-slate-700 hover:bg-[#1c1c2b] transition-all duration-300 shadow-lg"
                                >
                                    {/* Playlist Cover Art */}
                                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-900 mb-3">
                                        <img
                                            src={
                                                playlist.cover_url
                                                    ? `/uploads/images/${playlist.cover_url}`
                                                    : '/placeholder-cover.jpg'
                                            }
                                            alt={playlist.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src =
                                                    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop';
                                            }}
                                        />

                                        {/* Quick Play Hover Button */}
                                        <button
                                            onClick={(e) => handleQuickPlay(e, playlist.id)}
                                            className="absolute right-3 bottom-3 p-3.5 rounded-full bg-red-600 text-white shadow-xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-95"
                                            aria-label="Play Playlist"
                                        >
                                            <BiPlay size={24} className="ml-0.5" />
                                        </button>
                                    </div>

                                    {/* Metadata */}
                                    <h3 className="text-base font-bold text-slate-100 group-hover:text-red-500 transition-colors truncate">
                                        {playlist.title}
                                    </h3>
                                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                                        {playlist.description || 'No description'}
                                    </p>

                                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/60">
                                        <span className="flex items-center gap-1">
                                            <BiMusic size={14} /> {playlist.track_count || 0} tracks
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}