import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
    FiCalendar,
    FiMapPin,
    FiPlus,
    FiTrash2,
    FiDollarSign,
    // FiTicket,
    FiUsers,
    FiArrowLeft,
    FiClock,
    FiImage,
    FiCheckCircle,
} from "react-icons/fi";
import { useAuth } from "~/context/AuthContext";
import { BsTicket } from "react-icons/bs";

// Interfaces matching PostgreSQL Schema
export interface TicketTypeInput {
    name: string;
    price: number;
    quantity: number;
}

export interface TicketType extends TicketTypeInput {
    id: string;
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
    ticket_types?: TicketType[];
    total_revenue?: number;
    tickets_sold?: number;
    total_capacity?: number;
}

const API_BASE_URL = "http://localhost:3001";

const EventManagement: React.FC = () => {
    const { token } = useAuth();

    // Navigation View State
    const [view, setView] = useState<"list" | "create" | "details">("list");
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

    // Data States
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Form State for Creating Event
    const [formTitle, setFormTitle] = useState("");
    const [formVenue, setFormVenue] = useState("");
    const [formDetails, setFormDetails] = useState("");
    const [formThumbnail, setFormThumbnail] = useState("");
    const [formStartTime, setFormStartTime] = useState("");
    const [formEndTime, setFormEndTime] = useState("");
    const [ticketTiers, setTicketTiers] = useState<TicketTypeInput[]>([
        { name: "General Admission", price: 20.0, quantity: 100 },
    ]);

    // Fetch Events for Organizer
    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get<EventItem[]>(`${API_BASE_URL}/events/organizer`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvents(res.data);
        } catch (err: any) {
            console.error("Error fetching events:", err);
            setError("Failed to load events.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Handle Ticket Tier Inputs
    const handleAddTicketTier = () => {
        setTicketTiers([...ticketTiers, { name: "", price: 0, quantity: 50 }]);
    };

    const handleRemoveTicketTier = (index: number) => {
        if (ticketTiers.length === 1) return;
        setTicketTiers(ticketTiers.filter((_, i) => i !== index));
    };

    const handleTicketTierChange = (
        index: number,
        field: keyof TicketTypeInput,
        value: string | number
    ) => {
        const updated = [...ticketTiers];
        updated[index] = {
            ...updated[index],
            [field]: field === "name" ? value : Number(value),
        };
        setTicketTiers(updated);
    };

    // Handle Form Reset
    const resetForm = () => {
        setFormTitle("");
        setFormVenue("");
        setFormDetails("");
        setFormThumbnail("");
        setFormStartTime("");
        setFormEndTime("");
        setTicketTiers([{ name: "General Admission", price: 20.0, quantity: 100 }]);
    };

    // Create Event Submission
    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            setError(null);

            const payload = {
                title: formTitle,
                venue: formVenue,
                details: formDetails,
                thumbnail_url: formThumbnail,
                start_time: new Date(formStartTime).toISOString(),
                end_time: new Date(formEndTime).toISOString(),
                ticket_types: ticketTiers,
            };

            await axios.post(`${API_BASE_URL}/events`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            resetForm();
            setView("list");
            fetchEvents();
        } catch (err: any) {
            console.error("Error creating event:", err);
            setError(err.response?.data?.message || "Failed to create event.");
        } finally {
            setSubmitting(false);
        }
    };

    // Date Format Helper
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-neutral-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Event Manager</h1>
                    <p className="text-neutral-400 text-sm mt-1">
                        Create events, issue e-tickets, and manage attendee sales.
                    </p>
                </div>

                {view === "list" ? (
                    <button
                        onClick={() => setView("create")}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-lg shadow-red-600/20"
                    >
                        <FiPlus className="w-5 h-5" /> Create Event
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setView("list");
                            setSelectedEvent(null);
                        }}
                        className="text-neutral-400 hover:text-white flex items-center gap-2 text-sm transition"
                    >
                        <FiArrowLeft className="w-4 h-4" /> Back to All Events
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* VIEW 1: EVENT LIST */}
            {view === "list" && (
                <div>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 animate-pulse h-64"
                                />
                            ))}
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-20 bg-neutral-900/30 rounded-3xl border border-neutral-800/80">
                            <FiCalendar className="w-12 h-12 mx-auto text-neutral-600 mb-4" />
                            <h3 className="text-lg font-bold text-neutral-300">No events found</h3>
                            <p className="text-neutral-500 text-sm mb-6 max-w-sm mx-auto">
                                You haven't organized any events yet. Get started by creating your first e-ticket event.
                            </p>
                            <button
                                onClick={() => setView("create")}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl inline-flex items-center gap-2 transition"
                            >
                                <FiPlus /> Create First Event
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className="bg-neutral-900/50 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition flex flex-col"
                                >
                                    {/* Thumbnail */}
                                    <div className="h-44 bg-neutral-800 relative">
                                        {event.thumbnail_url ? (
                                            <img
                                                src={
                                                    event.thumbnail_url.startsWith("http")
                                                        ? event.thumbnail_url
                                                        : `${event.thumbnail_url}`
                                                }
                                                alt={event.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-600">
                                                <FiImage className="w-10 h-10" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                                                {event.title}
                                            </h3>
                                            <div className="space-y-1.5 text-xs text-neutral-400 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <FiClock className="text-red-500" />
                                                    <span>{formatDate(event.start_time)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FiMapPin className="text-red-500" />
                                                    <span className="truncate">{event.venue}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action / Stats Footer */}
                                        <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                                            <span className="text-neutral-400">
                                                {(event.tickets_sold || 0)} / {(event.total_capacity || 0)} Sold
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setView("details");
                                                }}
                                                className="text-red-500 hover:text-red-400 font-semibold transition"
                                            >
                                                Manage & Stats →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* VIEW 2: CREATE EVENT FORM */}
            {view === "create" && (
                <form onSubmit={handleCreateEvent} className="max-w-4xl mx-auto space-y-8">
                    {/* Basic Info Box */}
                    <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6 backdrop-blur-md">
                        <h2 className="text-xl font-bold text-white border-b border-neutral-800 pb-4">
                            Event Details
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                                    Event Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Summer Night Jam 2026"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                                        Venue / Location *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Studio X Arena, Main Hall"
                                        value={formVenue}
                                        onChange={(e) => setFormVenue(e.target.value)}
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                                        Thumbnail URL
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="https://... or upload path"
                                        value={formThumbnail}
                                        onChange={(e) => setFormThumbnail(e.target.value)}
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                                        Start Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formStartTime}
                                        onChange={(e) => setFormStartTime(e.target.value)}
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                                        End Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formEndTime}
                                        onChange={(e) => setFormEndTime(e.target.value)}
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                                    Event Details / Description
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe your event, lineup, special instructions..."
                                    value={formDetails}
                                    onChange={(e) => setFormDetails(e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ticket Tiers Box */}
                    <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6 backdrop-blur-md">
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-white">Ticket Tiers</h2>
                                <p className="text-xs text-neutral-400">
                                    Configure pricing and capacity limits for each ticket tier.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddTicketTier}
                                className="text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-2 rounded-lg flex items-center gap-1 transition"
                            >
                                <FiPlus /> Add Tier
                            </button>
                        </div>

                        <div className="space-y-4">
                            {ticketTiers.map((tier, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col md:flex-row items-center gap-4 bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/80"
                                >
                                    <div className="flex-1 w-full">
                                        <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">
                                            Tier Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. VIP Pass"
                                            value={tier.name}
                                            onChange={(e) =>
                                                handleTicketTierChange(index, "name", e.target.value)
                                            }
                                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600"
                                        />
                                    </div>

                                    <div className="w-full md:w-36">
                                        <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">
                                            Price ($)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            required
                                            value={tier.price}
                                            onChange={(e) =>
                                                handleTicketTierChange(index, "price", e.target.value)
                                            }
                                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600"
                                        />
                                    </div>

                                    <div className="w-full md:w-36">
                                        <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            required
                                            value={tier.quantity}
                                            onChange={(e) =>
                                                handleTicketTierChange(index, "quantity", e.target.value)
                                            }
                                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600"
                                        />
                                    </div>

                                    {ticketTiers.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTicketTier(index)}
                                            className="text-neutral-500 hover:text-red-500 p-2 mt-4 md:mt-0 transition"
                                            title="Remove Tier"
                                        >
                                            <FiTrash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => setView("list")}
                            className="text-neutral-400 hover:text-white px-5 py-3 text-sm font-semibold transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-xl transition shadow-lg shadow-red-600/20 disabled:opacity-50"
                        >
                            {submitting ? "Publishing Event..." : "Publish Event"}
                        </button>
                    </div>
                </form>
            )}

            {/* VIEW 3: EVENT DETAILS & STATS */}
            {view === "details" && selectedEvent && (
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Event Banner */}
                    <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 md:p-8 backdrop-blur-md">
                        <span className="text-xs uppercase tracking-widest text-red-500 font-bold">
                            Event Dashboard
                        </span>
                        <h2 className="text-3xl font-black text-white mt-1 mb-2">
                            {selectedEvent.title}
                        </h2>

                        <div className="flex flex-wrap gap-4 text-xs text-neutral-400 mt-4">
                            <span className="flex items-center gap-1.5 bg-neutral-800 px-3 py-1.5 rounded-full">
                                <FiMapPin className="text-red-500" /> {selectedEvent.venue}
                            </span>
                            <span className="flex items-center gap-1.5 bg-neutral-800 px-3 py-1.5 rounded-full">
                                <FiClock className="text-red-500" /> {formatDate(selectedEvent.start_time)}
                            </span>
                        </div>
                    </div>

                    {/* Quick Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                            <div className="flex items-center gap-3 text-neutral-400 mb-2">
                                <FiDollarSign className="text-emerald-500 w-5 h-5" />
                                <span className="text-xs font-semibold uppercase">Total Revenue</span>
                            </div>
                            <p className="text-2xl font-black text-white">
                                ${selectedEvent.total_revenue?.toFixed(2) || "0.00"}
                            </p>
                        </div>

                        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                            <div className="flex items-center gap-3 text-neutral-400 mb-2">
                                <BsTicket className="text-red-500 w-5 h-5" />
                                <span className="text-xs font-semibold uppercase">Tickets Sold</span>
                            </div>
                            <p className="text-2xl font-black text-white">
                                {selectedEvent.tickets_sold || 0}
                            </p>
                        </div>

                        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
                            <div className="flex items-center gap-3 text-neutral-400 mb-2">
                                <FiUsers className="text-blue-500 w-5 h-5" />
                                <span className="text-xs font-semibold uppercase">Total Capacity</span>
                            </div>
                            <p className="text-2xl font-black text-white">
                                {selectedEvent.total_capacity || 0}
                            </p>
                        </div>
                    </div>

                    {/* Ticket Tier Breakdown */}
                    <div className="bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 md:p-8">
                        <h3 className="text-lg font-bold text-white mb-6 border-b border-neutral-800 pb-3">
                            Ticket Tier Sales Breakdown
                        </h3>

                        {!selectedEvent.ticket_types || selectedEvent.ticket_types.length === 0 ? (
                            <p className="text-neutral-500 text-sm">No ticket tiers configured.</p>
                        ) : (
                            <div className="space-y-6">
                                {selectedEvent.ticket_types.map((tier) => {
                                    const sold = tier.quantity - tier.remaining_qty;
                                    const percentage = Math.round((sold / tier.quantity) * 100);

                                    return (
                                        <div key={tier.id} className="space-y-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <div>
                                                    <span className="font-bold text-white">{tier.name}</span>
                                                    <span className="text-neutral-500 text-xs ml-2">
                                                        (${tier.price.toFixed(2)})
                                                    </span>
                                                </div>
                                                <span className="text-xs text-neutral-400">
                                                    {sold} / {tier.quantity} Sold ({percentage}%)
                                                </span>
                                            </div>

                                            {/* Capacity Bar */}
                                            <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-red-600 rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventManagement;