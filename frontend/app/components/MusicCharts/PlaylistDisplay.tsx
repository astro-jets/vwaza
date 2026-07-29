'use client'

import { useAudioStore } from '@/stores/MusicStore'
import { Track } from '@/types/Track'
import React, { useEffect, useState } from 'react'
import { BsArrowDown, BsArrowUp, BsPause, BsPlay, BsSlashCircle, BsTrash } from 'react-icons/bs'

interface Charts {
    [key: string]: Track[]; // Optional, allows additional chart categories dynamically
}[]


const PlaylistDisplay = ({ tracks, title }: { title: string; tracks: Track[] }) => {
    const { audio, setAudio, playing, setQueue, setPlaying } = useAudioStore()
    const [filteredTracks, setFilteredTrack] = useState<Track[]>([]);

    useEffect(() => { setFilteredTrack(tracks) }, [tracks])


    return (
        <div className="px-4 w-full h-full space-y-4 ease-in-out duration-500">
            <div className="flex w-full items-center space-x-2">
                {/* <FaTheaterMasks size={20} color="white" /> */}
                <h2 className="text-xl text-center font-thin tracking-tight  text-black dark:text-white">{title}</h2>
            </div>
            <div className="space-y-4">
                {
                    filteredTracks?.length ?
                        filteredTracks.map((track, index) => (
                            <div
                                key={index}
                                className={`flex items-center  p-1 rounded-lg lg:hover:bg-[#ff2424b6] duration-[900000]
                                ${audio.title == track.title ? 'bg-[#b80000ee]' : 'bg-white/30 dark:bg-[#111111b4]'}
                                ${audio.title == track.title && playing ? 'playing' : ''}
                                `}
                            >
                                {/* Album Art */}
                                <div className="w-16 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                        src={`/uploads/images/${track.albumArtUrl}`}
                                        alt="Album Art"
                                        className="object-cover w-full h-full"
                                    />
                                </div>

                                {/* Song Info */}
                                <div className="ml-4 flex-1">
                                    <h3 className="font-thin text-black dark:text-white">{track.title}</h3>
                                    <p className="text-gray-700 text-sm">{track.artist}</p>
                                </div>

                                {/* Play/Pause */}
                                <div className={`mx-3 flex space-x-4`}>
                                    {
                                        playing && track.title === audio.title ?
                                            <BsPause color='#fff' size={20} onClick={() => { setPlaying(false) }} />
                                            : <BsPlay onClick={() => {

                                                if (audio.title == track.title) {
                                                    setPlaying(!playing);
                                                } else {
                                                    setAudio(track);
                                                    setQueue(tracks);
                                                    setPlaying(true)
                                                }
                                            }} color='#fff' size={20} />
                                    }
                                    <BsArrowUp color='white' size={20} />
                                    <BsArrowDown color='white' size={20} />
                                    <BsTrash color='white' size={20} onClick={() => {
                                        if (track.title === audio.title) { setPlaying(false) }
                                        setFilteredTrack(
                                            filteredTracks.filter((filteredtrack) => {
                                                if (track.title != filteredtrack.title) {
                                                    return filteredtrack;
                                                }
                                            })
                                        )
                                    }} />
                                </div>
                            </div>
                        ))
                        :
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <h1 className="text-3xl text-white">No tracks yet...</h1>
                            <BsSlashCircle size={300} className={'fill-white/30'} />
                        </div>
                }
            </div>
        </div>
    );
}

export default PlaylistDisplay;