import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
    BiCalendar,
    BiMap,
    BiSearch,
    BiTime,
    BiUser,
    BiX,
    BiSun,
    BiMoon,
    BiPlus
} from 'react-icons/bi';
import { Link } from 'react-router';
import { BsTicket } from 'react-icons/bs';
import axios from 'axios';
import DefaultLayout from '~/components/layouts/DefaultLayout';

// Types matching backend models
export interface TicketType {
    id: string;
    name: string;
    price: number | string;
    remaining_qty: number;
}

export interface EventItem {
    id: string;
    title: string;
    details?: string;
    venue: string;
    thumbnail_url?: string;
    start_time: string;
    end_time: string;
    organizer_name: string;
    ticket_types: TicketType[];
}

// Framer Motion Animation Variants with explicit `Variants` type annotations
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

export default function EventsPage() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

    // Fetch events from Fastify backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true)
                const res = await axios.get("http://localhost:3001/events")
                // Handles direct array or wrapped { events: [...] } response
                const fetchedEvents = Array.isArray(res.data) ? res.data : res.data.events || []
                setEvents(fetchedEvents)
            } catch (err) {
                console.error("Failed to load events:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchEvents()
    }, [])

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         fetchEvents(searchQuery);
    //     }, 300);
    //     return () => clearTimeout(timer);
    // }, [searchQuery]);

    // Format Helper Functions
    const formatDate = (isoStr: string) => {
        const date = new Date(isoStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (isoStr: string) => {
        const date = new Date(isoStr);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const getStartingPrice = (ticketTypes: TicketType[]) => {
        if (!ticketTypes || ticketTypes.length === 0) return 'Free';
        const minPrice = Math.min(...ticketTypes.map((t) => Number(t.price)));
        return minPrice === 0 ? 'Free' : `$${minPrice.toFixed(2)}`;
    };

    return (
        <DefaultLayout>
            <div className={isDarkMode ? 'dark' : ''}>
                <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d12] text-slate-900 dark:text-slate-100 transition-colors duration-300">

                    {/* ================= HEADER / HERO SECTION ================= */}

                    <div className="overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#12121a]/50 backdrop-blur-md">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                                    Live Events & Concerts
                                </h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    Discover live performances, album launches, and exclusive underground sessions.
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* ================= SEARCH & MAIN CONTENT ================= */}
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-0">

                        {/* Search Bar */}
                        <div className="relative max-w-xl mx-auto mb-10">
                            <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
                            <input
                                type="text"
                                placeholder="Search by event title, venue, or artist..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[#161622] border border-slate-200 dark:border-slate-800/80 focus:border-red-500 dark:focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 shadow-sm transition-all text-sm placeholder:text-slate-400"
                            />
                        </div>

                        {/* Event Cards Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                    <div key={n} className="h-96 rounded-2xl bg-slate-200/60 dark:bg-slate-800/40 animate-pulse border border-slate-200/40 dark:border-slate-800/40" />
                                ))}
                            </div>
                        ) : events.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16 bg-white dark:bg-[#161622] rounded-3xl border border-slate-200 dark:border-slate-800/80 p-8"
                            >
                                <BsTicket size={48} className="mx-auto text-slate-400 mb-3" />
                                <h3 className="text-lg font-semibold">No events found</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    Try refining your search terms or check back later for upcoming shows.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {events.map((event) => (
                                    <motion.div
                                        key={event.id}
                                        variants={itemVariants}
                                        whileHover={{ y: -6 }}
                                        className="group flex flex-col bg-white dark:bg-[#161622] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:shadow-red-500/5 dark:hover:border-slate-700 transition-all duration-300"
                                    >
                                        {/* Thumbnail Banner */}
                                        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                            <img
                                                src={
                                                    event.thumbnail_url
                                                        ? `${event.thumbnail_url}`
                                                        : '/placeholder-event.png'
                                                }
                                                alt={event.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src =
                                                        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop';
                                                }}
                                            />
                                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-semibold text-white">
                                                From {getStartingPrice(event.ticket_types)}
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-red-500 dark:text-red-400">
                                                    <BiUser size={14} />
                                                    <span>{event.organizer_name}</span>
                                                </div>

                                                <h2 className="text-xl font-bold line-clamp-1 group-hover:text-red-500 transition-colors">
                                                    {event.title}
                                                </h2>

                                                {event.details && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                        {event.details}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Meta Info */}
                                            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
                                                <div className="flex items-center gap-2">
                                                    <BiCalendar size={16} className="text-slate-400 shrink-0" />
                                                    <span>{formatDate(event.start_time)}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <BiTime size={16} className="text-slate-400 shrink-0" />
                                                    <span>
                                                        {formatTime(event.start_time)} - {formatTime(event.end_time)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <BiMap size={16} className="text-slate-400 shrink-0" />
                                                    <span className="truncate">{event.venue}</span>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <Link to={`/events/${event.id}`}
                                                // onClick={() => setSelectedEvent(event)}
                                                className="w-full p-2 text-center mt-4 bg-slate-900 dark:bg-slate-800 hover:bg-red-600 dark:hover:bg-red-600 text-white py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm"
                                            >
                                                View Tickets & Tiers
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </main>

                    {/* ================= TICKET TIERS MODAL ================= */}
                    <AnimatePresence>
                        {selectedEvent && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                {/* Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setSelectedEvent(null)}
                                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                                />

                                {/* Modal Card */}
                                <motion.div
                                    variants={modalVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="relative w-full max-w-lg bg-white dark:bg-[#161622] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden"
                                >
                                    {/* Close Button */}
                                    <button
                                        onClick={() => setSelectedEvent(null)}
                                        className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                                    >
                                        <BiX size={20} />
                                    </button>

                                    <div className="mb-4">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-red-500">
                                            {selectedEvent.organizer_name}
                                        </span>
                                        <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                                            {selectedEvent.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                                            <BiMap size={14} /> {selectedEvent.venue}
                                        </p>
                                    </div>

                                    {selectedEvent.details && (
                                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-6 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                            {selectedEvent.details}
                                        </p>
                                    )}

                                    {/* Ticket Tiers List */}
                                    <h4 className="text-sm font-semibold mb-3">Available Ticket Tiers</h4>
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                        {selectedEvent.ticket_types && selectedEvent.ticket_types.length > 0 ? (
                                            selectedEvent.ticket_types.map((tier) => (
                                                <div
                                                    key={tier.id}
                                                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40"
                                                >
                                                    <div>
                                                        <p className="font-semibold text-sm">{tier.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {tier.remaining_qty > 0
                                                                ? `${tier.remaining_qty} tickets available`
                                                                : 'Sold Out'}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-base text-red-500">
                                                            ${Number(tier.price).toFixed(2)}
                                                        </p>
                                                        <button
                                                            disabled={tier.remaining_qty <= 0}
                                                            className="mt-1 px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
                                                        >
                                                            {tier.remaining_qty > 0 ? 'Select' : 'Sold Out'}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-slate-500">No ticket information available.</p>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </DefaultLayout>
    );
}