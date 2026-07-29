import React from 'react'
import type { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { Link } from "react-router"
import { FaTheaterMasks } from 'react-icons/fa'
import type { Event } from 'types/Event'
import { PrevButton, NextButton, usePrevNextButtons } from './EmblaCarouselArrowButtons'

type PropType = {
  events: Event[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { events, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <section className="embla w-full relative group">
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex space-x-5 w-full pl-8 py-2">
          {events.map((event) => {
            // Image URL helper: handles absolute URLs vs relative uploads
            const imageSrc = event.thumbnail_url
              ? event.thumbnail_url.startsWith('http')
                ? event.thumbnail_url
                : `${event.thumbnail_url}`
              : '/images/event-placeholder.png'

            return (
              <div
                key={event.id}
                className="max-h-50 h-50 items-start justify-start min-w-45 w-45 flex flex-col relative cursor-pointer rounded-2xl overflow-hidden shrink-0 border border-neutral-800 bg-neutral-900"
              >
                <img
                  src={imageSrc}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback on broken image link
                    (e.target as HTMLImageElement).src = '/images/event-placeholder.png'
                  }}
                />

                {/* Hover Details Overlay */}
                <div className="z-20 opacity-0 hover:opacity-100 w-full h-full bg-black/80 items-center justify-center flex flex-col space-y-3 absolute top-0 left-0 right-0 p-3 transition-opacity duration-200">
                  <p className="text-white text-xs font-bold text-center line-clamp-2">
                    {event.title}
                  </p>
                  {event.venue && (
                    <p className="text-neutral-400 text-[10px] text-center truncate w-full">
                      📍 {event.venue}
                    </p>
                  )}
                  <Link
                    to={`/events/${event.id}`}
                    className="flex px-3 py-1.5 text-xs items-center bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
                  >
                    View details
                  </Link>
                </div>
              </div>
            )
          })}

          {/* View All Events Card */}
          <Link
            to={'/events'}
            className="bg-neutral-900 border border-neutral-800 min-w-40 h-50 rounded-2xl overflow-hidden shrink-0 flex flex-col items-center justify-center hover:border-neutral-700 transition"
          >
            <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
              <FaTheaterMasks size={48} className="text-neutral-400" />
              <h3 className="text-xs text-white font-semibold mt-2">
                View All Events
              </h3>
            </div>
          </Link>
        </div>
      </div>

      {/* Navigation Buttons */}
      {events.length > 0 && (
        <div className="flex items-center justify-end gap-2 px-8 mt-2">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      )}
    </section>
  )
}

export default EmblaCarousel