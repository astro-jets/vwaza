import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
    BiPlay,
    BiPause,
    BiDisc,
    BiSun,
    BiMoon,
    BiSearch,
    BiMusic,
    BiTrendingUp
} from 'react-icons/bi';
import { useAudioStore, type Track } from 'stores/MusicStore';

const API_BASE_URL = 'http://localhost:3001';

export interface ReleaseItem {
    id: string;
    title: string;
    genre?: string;
    audio_url?: string;
    release_id?: string;
    cover_url: string;
    release_title?: string;
    release_type: string;
    release_date?: string;
    artist_name: string;
    track_number?: number;
}

const CATEGORIES = ['all', 'album', 'single', 'ep'];

export default function DiscoverPage() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [releases, setReleases] = useState<ReleaseItem[]>([]);
    const [featured, setFeatured] = useState<ReleaseItem | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    // GSAP animation refs
    const heroRef = useRef<HTMLDivElement>(null);
    const heroTextRef = useRef<HTMLDivElement>(null);
    const heroImageRef = useRef<HTMLDivElement>(null);

    const { audio, playing, setAudio, setQueue, setPlaying } = useAudioStore();

    // Toggle Dark/Light mode on root wrapper
    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    // Fetch Releases from Backend
    useEffect(() => {
        fetchReleases(selectedCategory);
    }, [selectedCategory]);

    const fetchReleases = async (category: string) => {
        setLoading(true);
        try {
            const endpoint = `${API_BASE_URL}/artist/releases`;

            const res = await fetch(endpoint);
            if (res.ok) {
                const data: ReleaseItem[] = await res.json();
                setReleases(data);
                if (data.length > 0 && category === 'all') {
                    setFeatured(data[0]); // Pick first as featured spotlight
                }
            }
        } catch (err) {
            console.error('Failed to load discover content:', err);
        } finally {
            setLoading(false);
        }
    };

    // GSAP Entrance Animation for Hero Spotlight when featured changes
    useEffect(() => {
        if (featured && heroRef.current) {
            const ctx = gsap.context(() => {
                gsap.fromTo(
                    heroImageRef.current,
                    { scale: 0.85, opacity: 0, rotation: -3 },
                    { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: 'power3.out' }
                );

                gsap.fromTo(
                    heroTextRef.current?.children || [],
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.2 }
                );
            }, heroRef);

            return () => ctx.revert();
        }
    }, [featured]);

    // Convert Release item to player track format
    const playRelease = (item: ReleaseItem) => {
        const formattedTrack: Track = {
            id: item.id as any,
            title: item.title || item.release_title || 'Untitled Track',
            genre: item.genre || 'Hip-Hop',
            cover_url: item.cover_url || '',
            audio_url: item.audio_url || '',
            track_number: item.track_number || 1,
            release_title: item.release_title || item.title,
            artist_name: item.artist_name || 'Unknown Artist',
        };

        setQueue([formattedTrack]);
        setAudio(formattedTrack);
        setPlaying(true);
    };

    const filteredReleases = releases.filter(
        (item) =>
            (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.artist_name && item.artist_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className={theme === 'dark' ? 'dark' : ''}>
            <div className="min-h-screen transition-colors duration-500 bg-white text-black dark:bg-black dark:text-white pb-32 font-sans selection:bg-red-600 selection:text-white">

                {/* Navbar / Top Bar */}
                <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-zinc-200 dark:border-zinc-900 px-6 py-4 transition-colors">
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/40">
                                <BiDisc size={22} className="animate-spin-slow" />
                            </div>
                            <span className="text-xl font-black tracking-tighter uppercase italic">
                                Discover<span className="text-red-600">.</span>
                            </span>
                        </div>

                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md hidden md:block">
                            <BiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search tracks, artists, or albums..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 focus:outline-none focus:border-red-600 dark:focus:border-red-600 text-sm transition-all text-black dark:text-white placeholder:text-zinc-400"
                            />
                        </div>

                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle Dark Mode"
                            className="p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 hover:border-red-600 text-black dark:text-white transition-all active:scale-90"
                        >
                            {theme === 'dark' ? <BiSun size={20} className="text-amber-400" /> : <BiMoon size={20} className="text-zinc-800" />}
                        </button>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-6 pt-8 space-y-12">

                    {/* GSAP Hero Spotlight */}
                    {featured && (
                        <div
                            ref={heroRef}
                            className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-100 via-zinc-200 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-black border border-zinc-200 dark:border-zinc-800/80 p-8 md:p-12 shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">

                                {/* Hero Text */}
                                <div ref={heroTextRef} className="flex-1 space-y-4 text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 bg-red-600/10 dark:bg-red-950/40 border border-red-600/30 text-red-600 dark:text-red-500 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {/* <BsFlame size={16} /> Featured Spotlight */}
                                    </div>

                                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-black dark:text-white">
                                        {featured.title || featured.release_title}
                                    </h1>

                                    <p className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">
                                        By <span className="text-red-600 dark:text-red-500 font-bold">{featured.artist_name}</span>
                                    </p>

                                    <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                                        <button
                                            onClick={() => playRelease(featured)}
                                            className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-extrabold text-sm tracking-wide transition-all shadow-xl shadow-red-600/30 active:scale-95"
                                        >
                                            {audio?.audio_url === featured.audio_url && playing ? (
                                                <>
                                                    <BiPause size={22} /> PAUSE NOW
                                                </>
                                            ) : (
                                                <>
                                                    <BiPlay size={22} /> STREAM NOW
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Hero Cover Art */}
                                <div ref={heroImageRef} className="w-56 h-56 md:w-72 md:h-72 shrink-0 rounded-2xl overflow-hidden shadow-2xl border-2 border-red-600/40 relative group">
                                    <img
                                        src={`/uploads/images/${featured.cover_url}`}
                                        alt={featured.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Category Filter Tabs */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-200 dark:border-zinc-900 pb-4">
                            <div className="flex items-center gap-2">
                                <BiTrendingUp className="text-red-600" size={24} />
                                <h2 className="text-2xl font-black tracking-tight uppercase">
                                    Trending Releases
                                </h2>
                            </div>

                            {/* Tabs */}
                            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                {CATEGORIES.map((cat) => {
                                    const isActive = selectedCategory === cat;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`relative px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors z-10 ${isActive
                                                ? 'text-white'
                                                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                                                }`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute inset-0 bg-red-600 rounded-lg -z-10"
                                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                                />
                                            )}
                                            {cat}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Releases Grid with Framer Motion */}
                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                    <div
                                        key={n}
                                        className="h-64 rounded-2xl bg-zinc-200 dark:bg-zinc-900 animate-pulse border border-zinc-300 dark:border-zinc-800/50"
                                    />
                                ))}
                            </div>
                        ) : filteredReleases.length === 0 ? (
                            <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
                                <BiMusic size={48} className="mx-auto text-zinc-400 mb-3" />
                                <h3 className="text-lg font-bold">No releases found</h3>
                                <p className="text-zinc-500 text-sm mt-1">Try selecting another category or clear search filter.</p>
                            </div>
                        ) : (
                            <motion.div
                                layout
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                            >
                                <AnimatePresence>
                                    {filteredReleases.map((item, idx) => {
                                        const isPlayingThis = audio?.audio_url === item.audio_url && playing;

                                        return (
                                            <motion.div
                                                key={item.id || idx}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                            >
                                                <div
                                                    onClick={() => playRelease(item)}
                                                    className="group relative flex flex-col bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-900 hover:border-red-600 dark:hover:border-red-600 transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer"
                                                >
                                                    {/* Artwork & Play Overlay */}
                                                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-900 mb-3">
                                                        <img
                                                            src={
                                                                item.cover_url
                                                                    ? `/uploads/images/${item.cover_url}`
                                                                    : '/placeholder-cover.jpg'
                                                            }
                                                            alt={item.title || item.release_title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src =
                                                                    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop';
                                                            }}
                                                        />

                                                        {/* Hover / Active Play Button */}
                                                        <div
                                                            className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isPlayingThis ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                                                }`}
                                                        >
                                                            <div className="p-3.5 rounded-full bg-red-600 text-white shadow-xl hover:scale-110 active:scale-95 transition-transform">
                                                                {isPlayingThis ? <BiPause size={24} /> : <BiPlay size={24} className="ml-0.5" />}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Info */}
                                                    <h3 className="text-sm font-bold truncate group-hover:text-red-600 transition-colors">
                                                        {item.title || item.release_title || 'Untitled Track'}
                                                    </h3>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                                                        {item.artist_name}
                                                    </p>

                                                    {/* Footer Tag */}
                                                    <div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-900">
                                                        <span>{item.release_type || 'Single'}</span>
                                                        {item.genre && <span className="text-red-600">{item.genre}</span>}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}