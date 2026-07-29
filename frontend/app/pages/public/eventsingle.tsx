import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import axios from 'axios'
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaUser,
    FaTicketAlt,
    FaArrowLeft,
    FaCheckCircle,
    FaSpinner,
    FaQrcode
} from 'react-icons/fa'
import type { Event } from 'types/Event'


interface PurchasedTicket {
    ticketCode: string
    tierName: string
    price: number
    holderName: string
}

export default function SingleEvent() {
    const { id } = useParams<{ id: string }>()

    // State Management
    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // Ticket Selection State: { [ticketTypeId]: count }
    const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({})

    // Checkout & Payment State
    const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false)
    const [attendeeName, setAttendeeName] = useState<string>('')
    const [attendeeEmail, setAttendeeEmail] = useState<string>('')
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>([])

    // 1. Fetch Event Details by ID
    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return
            try {
                setLoading(true)
                setError(null)
                const res = await axios.get(`http://localhost:3001/events/${id}`)
                setEvent(res.data)
            } catch (err: any) {
                console.error('Error fetching event details:', err)
                setError(err.response?.data?.error || 'Failed to load event details.')
            } finally {
                setLoading(false)
            }
        }

        fetchEvent()
    }, [id])

    // Handle ticket quantity adjustments
    const handleQuantityChange = (tierId: string, delta: number, remainingQty: number) => {
        setTicketQuantities((prev) => {
            const current = prev[tierId] || 0
            const next = current + delta
            if (next < 0) return prev
            if (next > remainingQty) return prev // Limit to remaining stock
            return { ...prev, [tierId]: next }
        })
    }

    // Calculate order total
    const totalAmount = event?.ticket_types?.reduce((sum, tier) => {
        const qty = ticketQuantities[tier.id || ''] || 0
        return sum + qty * tier.price
    }, 0) || 0

    const totalTicketCount = Object.values(ticketQuantities).reduce((a, b) => a + b, 0)

    // 2. Dummy Payment & Ticket Generation Handler
    const handleDummyPayment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (totalTicketCount === 0 || !attendeeName || !attendeeEmail) return

        setIsProcessing(true)

        // Simulate API network delay for payment processing
        setTimeout(() => {
            const generated: PurchasedTicket[] = []

            // Generate tickets based on selected tiers
            event?.ticket_types?.forEach((tier) => {
                const qty = ticketQuantities[tier.id || ''] || 0
                for (let i = 0; i < qty; i++) {
                    generated.push({
                        ticketCode: `TKT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
                        tierName: tier.name,
                        price: tier.price,
                        holderName: attendeeName,
                    })
                }
            })

            setPurchasedTickets(generated)
            setIsProcessing(false)
        }, 1500)
    }

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
                <FaSpinner className="animate-spin text-3xl text-red-500 mr-3" />
                <p className="text-neutral-400">Loading event details...</p>
            </div>
        )
    }

    // Error / Not Found State
    if (error || !event) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6">
                <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
                <p className="text-neutral-400 mb-6">{error || "The event you are looking for doesn't exist."}</p>
                <Link to="/events" className="flex items-center text-red-500 hover:underline">
                    <FaArrowLeft className="mr-2" /> Back to Events
                </Link>
            </div>
        )
    }

    const imageSrc = '/uploads/images/img.jpg'

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 md:p-8">
            {/* Navigation */}
            <div className="max-w-6xl mx-auto mb-6">
                <Link to="/events" className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition">
                    <FaArrowLeft className="mr-2" /> All Events
                </Link>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: Event Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Banner Image */}
                    <div className="w-full h-72 md:h-96 rounded-2xl overflow-hidden border border-neutral-800 relative bg-neutral-900">
                        <img
                            src={imageSrc}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/uploads/images/img.jpg'
                            }}
                        />
                    </div>

                    {/* Title and Metadata */}
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{event.title}</h1>

                        <div className="flex flex-wrap gap-4 text-sm text-neutral-300">
                            {event.organizer_name && (
                                <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
                                    <FaUser className="text-red-500" />
                                    <span>Hosted by <strong>{event.organizer_name}</strong></span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
                                <FaCalendarAlt className="text-red-500" />
                                <span>{new Date(event.start_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
                                <FaMapMarkerAlt className="text-red-500" />
                                <span>{event.venue}</span>
                            </div>
                        </div>
                    </div>

                    {/* Event Description */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
                        <h2 className="text-lg font-semibold text-white">About This Event</h2>
                        <p className="text-neutral-400 leading-relaxed whitespace-pre-line">
                            {event.details || 'No additional details provided for this event.'}
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN: Ticket Selection Panel */}
                <div className="space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sticky top-8">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-800">
                            <FaTicketAlt className="text-red-500 text-xl" />
                            <h2 className="text-lg font-bold text-white">Select Tickets</h2>
                        </div>

                        {/* Ticket Tier List */}
                        {event.ticket_types && event.ticket_types.length > 0 ? (
                            <div className="space-y-4 mb-6">
                                {event.ticket_types.map((tier) => {
                                    const selectedQty = ticketQuantities[tier.id || ''] || 0
                                    const isSoldOut = tier.remaining_qty <= 0

                                    return (
                                        <div
                                            key={tier.id || tier.name}
                                            className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 flex justify-between items-center"
                                        >
                                            <div>
                                                <h3 className="font-semibold text-white">{tier.name}</h3>
                                                <p className="text-sm text-red-400 font-bold">${Number(tier.price).toFixed(2)}</p>
                                                <p className="text-xs text-neutral-500 mt-1">
                                                    {isSoldOut ? 'Sold Out' : `${tier.remaining_qty} tickets left`}
                                                </p>
                                            </div>

                                            {/* Plus / Minus Counter */}
                                            {!isSoldOut ? (
                                                <div className="flex items-center space-x-3 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuantityChange(tier.id || '', -1, tier.remaining_qty)}
                                                        className="w-7 h-7 flex items-center justify-center rounded text-neutral-400 hover:bg-neutral-800 hover:text-white"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-sm font-semibold w-4 text-center">{selectedQty}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuantityChange(tier.id || '', 1, tier.remaining_qty)}
                                                        className="w-7 h-7 flex items-center justify-center rounded text-neutral-400 hover:bg-neutral-800 hover:text-white"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-neutral-600 uppercase font-bold">Unavailable</span>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-neutral-500 mb-6">No ticket tiers currently available.</p>
                        )}

                        {/* Total Summary */}
                        <div className="border-t border-neutral-800 pt-4 mb-6 space-y-2">
                            <div className="flex justify-between text-sm text-neutral-400">
                                <span>Total Tickets</span>
                                <span>{totalTicketCount}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-white">
                                <span>Total Price</span>
                                <span className="text-red-500">${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            disabled={totalTicketCount === 0}
                            onClick={() => setIsCheckoutOpen(true)}
                            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition shadow-lg shadow-red-600/20"
                        >
                            Get Tickets (${totalAmount.toFixed(2)})
                        </button>
                    </div>
                </div>
            </div>

            {/* CHECKOUT & DUMMY PAYMENT MODAL */}
            {isCheckoutOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 relative overflow-hidden">

                        {/* SCREEN 1: Enter Attendee Information */}
                        {purchasedTickets.length === 0 ? (
                            <form onSubmit={handleDummyPayment} className="space-y-4">
                                <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                                    <h2 className="text-xl font-bold text-white">Checkout Details</h2>
                                    <button
                                        type="button"
                                        onClick={() => setIsCheckoutOpen(false)}
                                        className="text-neutral-500 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 text-xs text-neutral-400">
                                    <p><strong>Order Summary:</strong> {totalTicketCount} ticket(s) for <strong>{event.title}</strong></p>
                                    <p className="text-white font-bold mt-1">Total Due: ${totalAmount.toFixed(2)}</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-neutral-400">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={attendeeName}
                                        onChange={(e) => setAttendeeName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-red-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-neutral-400">Email Address (for ticket delivery)</label>
                                    <input
                                        type="email"
                                        required
                                        value={attendeeEmail}
                                        onChange={(e) => setAttendeeEmail(e.target.value)}
                                        placeholder="john@example.com"
                                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-red-500"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <FaSpinner className="animate-spin" /> Processing Dummy Payment...
                                            </>
                                        ) : (
                                            `Complete Dummy Payment($${totalAmount.toFixed(2)})`
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* SCREEN 2: Purchase Success & Generated Digital Tickets */
                            <div className="space-y-6 text-center">
                                <div className="flex flex-col items-center">
                                    <FaCheckCircle className="text-green-500 text-5xl mb-2" />
                                    <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
                                    <p className="text-xs text-neutral-400">Your tickets have been issued to {attendeeEmail}</p>
                                </div>

                                <div className="max-h-60 overflow-y-auto space-y-3 pr-1 text-left">
                                    {purchasedTickets.map((tkt, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="text-xs font-mono text-red-500">{tkt.ticketCode}</p>
                                                <p className="text-sm font-semibold text-white">{tkt.tierName}</p>
                                                <p className="text-xs text-neutral-400">{tkt.holderName}</p>
                                            </div>
                                            <div className="text-right">
                                                <FaQrcode className="text-3xl text-neutral-300" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCheckoutOpen(false)
                                        setPurchasedTickets([])
                                        setTicketQuantities({})
                                    }}
                                    className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-semibold transition"
                                >
                                    Close & Done
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    )
}