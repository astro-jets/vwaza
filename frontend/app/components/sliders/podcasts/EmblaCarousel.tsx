"use client"

import React, { useRef } from 'react'
import type { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { FaMicrophoneAlt } from 'react-icons/fa'

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import type { channelDetailsProps } from 'types/video'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, CustomEase);

type PropType = {
  slides: number[]
  options?: EmblaOptionsType
  channels: channelDetailsProps[]
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { options, channels = [] } = props // Default to empty array to avoid undefined errors
  const [emblaRef] = useEmblaCarousel(options);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const channelsElements = gsap.utils.toArray<HTMLDivElement>(".channels");
    channelsElements.forEach((channel) => {
      const podcastChannels = channel.querySelector('.podcastChannel')

      gsap.fromTo(
        podcastChannels,
        { scale: 0.8, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: .9, ease: "power4.out" } // Changed scale: 0 to 1 so it doesn't disappear
      )
    });
  }, [channels]); // Re-run GSAP if channels load asynchronously


  return (
    <section ref={containerRef} className="embla w-full">
      <div className="embla__viewport" ref={emblaRef}>
        {/* The container MUST always be rendered here */}
        <div className="embla__container py-4 space-x-5 w-full pl-8">

          {/* 1. Safely check if channels is an array before mapping */}
          {Array.isArray(channels) && channels.map(channel => (
            <div key={channel.id} className="channels backdrop-blur-lg shadow-[#222] shadow-4 dark:shadow-1 dark:bg-[#0f0f0fce] bg-[#fff]/30 rounded-2xl p-2 max-h-60 h-full min-w-45">
              <Link to={`/podcasts/${channel.id}`} className="podcastChannel group relative">
                <div className="aspect-h-1 h-40 aspect-w-1 w-full overflow-hidden rounded-2xl lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img src={channel.snippet?.thumbnails?.high?.url} alt="channel thumbnail"
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full" />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-black dark:text-white">
                      <span aria-hidden="true" className="absolute inset-0"></span>
                      {channel.snippet?.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}s

          {/* "View All" acts as the final slider item */}
          <Link to={'/podcasts'} className="bg-[#00000049] backdrop-blur-2xl w-full min-w-40 mx-4 rounded-lg overflow-hidden">
            <div className="relative flex items-center justify-center h-40">
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ repeat: Infinity, duration: 1.7 }}
              >
                <FaMicrophoneAlt size={60} color="white" />
              </motion.div>
            </div>
            <div className="p-2 flex space-x-2 justify-center">
              {["View ", "All ", "Podcasts"].map((word, index) => (
                <motion.div
                  key={index}
                  className="text-sm text-center text-white font-medium inline"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: index * 0.1 }}
                >
                  {word}
                </motion.div>
              ))}
            </div>
          </Link>

        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel