import React, { useEffect, useState } from 'react'
import type { EmblaOptionsType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import axios from "axios"
import { useAuth } from "~/context/AuthContext"
import { useAudioStore } from 'stores/MusicStore'


interface ReleaseSummary {
  id: number;
  title: string;
  featuring?: string;
  genre: string;
  cover_url: string;
  audio_url: string;
  track_number: number;
  release_title: string;
  release_date: string;
  release_type: 'single' | 'album' | 'ep';
  status: boolean;
  artist_name: string;
  plays?: number;
}

type PropType = {
  slides?: number[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { options } = props
  const [isMounted, setIsMounted] = useState(false)

  // 1. Client-Side Hydration Guard (Prevents Vercel SSR Crash)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const [emblaRef] = useEmblaCarousel(options, isMounted ? [Autoplay()] : [])
  const { audio, playing, setAudio, setQueue, setPlaying } = useAudioStore()

  const [releases, setReleases] = useState<ReleaseSummary[]>([])
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isMounted) return

    const fetchReleases = async () => {
      try {
        // 2. Dynamic Environment API URL (Replaces hardcoded localhost)
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001"
        const res = await axios.get(`${baseUrl}/artist/releases`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })

        const dataWithMockStats = res.data.map((r: any) => ({
          ...r,
          plays: Math.floor(Math.random() * 50000) + 1200
        }))
        setReleases(dataWithMockStats)
      } catch (err) {
        console.error("Failed to fetch releases:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchReleases()
  }, [token, isMounted])

  // 3. Fallback render while rendering on Node.js Server
  if (!isMounted) {
    return (
      <section className="embla w-full">
        <div className="embla__viewport">
          <div className="embla__container space-x-5 w-full pl-8 flex">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="min-w-30 min-h-30 md:w-45 md:h-45 animate-pulse bg-slate-900 rounded-full" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="embla w-full">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container space-x-5 w-full pl-8 flex">
          {releases.length ? (
            releases.map((track) => (
              <img
                key={track.id || track.title}
                src={`/uploads/images/${track.cover_url}`}
                loading="lazy"
                height={560}
                width={560}
                alt={track.title}
                className={`w-25 h-25 md:w-45 md:h-45 cursor-pointer rounded-full object-cover ${audio?.title === track.title && playing ? 'animate-rotating' : ''
                  }`}
                onClick={() => {
                  if (audio?.title === track.title) {
                    setPlaying(!playing)
                  } else {
                    setAudio(track)
                    setQueue(releases)
                    setPlaying(true)
                  }
                }}
              />
            ))
          ) : (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="min-w-30 min-h-30 md:w-45 md:h-45 animate-pulse bg-slate-900 rounded-full" />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel