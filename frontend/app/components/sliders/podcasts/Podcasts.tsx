
import EmblaCarousel from './EmblaCarousel'
import type { EmblaOptionsType } from 'embla-carousel'
import { useState, useEffect } from 'react'
import { FaMicrophoneAlt } from 'react-icons/fa'
import type { channelDetailsProps } from 'types/video'



const OPTIONS: EmblaOptionsType = { align: 'start', loop: false }
const SLIDE_COUNT = 15
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

const [channels, setChannels] = useState([]);
const channelIds = [
    'UCv36EOUNAx2_l_5lmunaWNA',
    'UChjZB_B5f76x3ZkrASt348Q',
    'UCS_65yasWSBMLr5hPco3GxQ',
    'UCnPt6wUx9nmVcFWkV8fBUEg',
    'UC7BXdXFxVgMPKmBeDgx2QrQ',
    'UC1qC9CHrHw-m_xH73gRS0mw',
    'UCQ2bTOhnT-fttJV7PYXMFcA',
];
useEffect(() => {

    const fetchChannels = async () => {
        try {
            const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
            const fetchPromises = channelIds.map(async (channelId) => {
                try {
                    const endpoint = `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&id=${channelId}&part=snippet`;
                    const response = await fetch(endpoint);
                    return await response.json();
                } catch (error) { console.log(error) }
            });


            const allChannels = await Promise.all(fetchPromises);
            console.log("Channels => ", allChannels)
            return (allChannels.flatMap((data) => data?.items));
        } catch (error) {
            console.error('Error fetching channels:', error);
            // setError(error);
        }
    }
    const channelsRes = fetchChannels();
    setChannels(channelsRes as any)
})


function PodcastSlider() {
    return (
        <div className="flex flex-col h-70  w-full items-start">
            <div className="flex flex-col w-full h-full ">
                <div className="px-4 flex w-full items-center space-x-2">
                    <FaMicrophoneAlt size={20} className='fill-black dark:fill-white' />
                    <h2 className="text-xl font-thin tracking-tight text-black dark:text-white">Podcasts</h2>
                </div>
                <div className="w-full h-40 py-4 md:py-10">
                    <EmblaCarousel channels={channels} slides={SLIDES} options={OPTIONS} />
                </div>
            </div>
        </div>

    )
}

export default PodcastSlider;
