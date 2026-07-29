"use client"

import React, { useCallback, useContext, useEffect, useState } from 'react'
import type { EmblaOptionsType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import axios from "axios";
import { useAuth } from "~/context/AuthContext";

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
  plays?: number; // Added mock field for design
}

// import { fetchTracks } from '@/services/tracks'
import { useAudioStore } from 'stores/MusicStore'
type PropType = {
  slides: number[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { options } = props
  const [emblaRef] = useEmblaCarousel(options, [Autoplay()])
  const { audio, playing, setAudio, setQueue, setPlaying } = useAudioStore();

  const [releases, setReleases] = useState<ReleaseSummary[]>([]);
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const res = await axios.get("http://localhost:3001/artist/releases", {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Adding mock play counts if backend doesn't provide them yet
        const dataWithMockStats = res.data.map((r: any) => ({
          ...r,
          plays: Math.floor(Math.random() * 50000) + 1200
        }));
        setReleases(dataWithMockStats);
        setLoading(false)
      } catch (err) {
        console.error(err);
      }
    };
    fetchReleases();
  }, [token]);

  return (
    <section className="embla w-full">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container space-x-5 w-full pl-8">
          {
            releases.length ?
              releases.map((track, index) => (
                <img src={`/uploads/images/${track.cover_url}`} loading='lazy' height={560} width={560} key={index}
                  className={`w-25 h-25  md:w-45 md:h-45  cursor-pointer rounded-full ${audio.title == track.title && playing ? 'animate-rotating' : ''}`}
                  onClick={() => {

                    if (audio.title == track.title) {
                      setPlaying(!playing);
                    } else {
                      setAudio(track);
                      setQueue(releases);
                      setPlaying(true)
                    }
                  }}
                />
              ))
              :
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="min-w-30 min-h-30  md:w-45 md:h-45 animate-pulse  bg-slate-900 rounded-full"></div>
              ))
          }
        </div>
      </div>

    </section>
  )
}

export default EmblaCarousel
