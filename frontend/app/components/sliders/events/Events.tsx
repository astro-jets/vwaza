import { useEffect, useState } from 'react'
import EmblaCarousel from './EmblaCarousel'
import type { EmblaOptionsType } from 'embla-carousel'
import { FaTheaterMasks } from 'react-icons/fa'
import axios from 'axios'
import type { Event } from 'types/Event'

const OPTIONS: EmblaOptionsType = { align: 'start', loop: false }

function EventsSlider() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState<boolean>(true)

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

    return (

        <section className="flex flex-col h-65 w-full items-start">
            <div className="flex flex-col w-full h-full my-4">
                <div className="flex w-full items-center space-x-2 px-4 mb-3">
                    <FaTheaterMasks size={20} className='fill-black dark:fill-white' />
                    <h2 className="text-xl font-thin tracking-tight text-black dark:text-white">Events</h2>
                </div>

                <div className="w-full">
                    {loading ? (
                        <div className="flex space-x-4 px-8 overflow-hidden">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="min-w-45 h-50 bg-neutral-800/40 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <EmblaCarousel events={events} options={OPTIONS} />
                    )}
                </div>
            </div>
        </section >
    )
}

export default EventsSlider