
import { useEffect, useRef, useState } from 'react';
import { IoIosPause, IoIosPlayCircle, IoIosSkipBackward, IoIosSkipForward } from "react-icons/io";
import * as RadixSlider from '@radix-ui/react-slider';
import { useAudioStore } from "stores/MusicStore";
import { BsCameraVideo, BsDownload, BsHeart, BsShare } from 'react-icons/bs';
import LyricsPlayer from './LyricsPlayer';

import { BiMoviePlay } from 'react-icons/bi';
import { Link } from 'react-router';

const lyrics = `[
[00:00.00]Can't count up the times you've blown my line
[00:09.83]And that's been on my mind a lot lately
[00:16.41]I wanna leave the extra all behind, mmm
[00:23.26]And I know that you wanna be my baby, mmm yeah
[00:24.54]Said, my bad
[00:27.78]Blowin' me up, we been wilin'
[00:30.80]We was cool, yeah, we was vibin'
[00:34.36]Gotta put my phone on silent
[00:38.13]So my, my, my, my bad
[00:38.16]Blowin' me up, we been wilin'
[00:38.19]We were cool, yeah, we was vibin'
[00:43.78]Gotta put my phone on silent
[00:48.82]So my, my, my bad
[00:49.52]Oh, we both care about it
[00:55.23]But arguing with me just isn't worth it
[00:58.60]No, no, no
[01:01.40]Don't go reachin' in your bag, your bag, yeah
[01:06.12]I didn't text you back 'cause I was workin'
[01:09.76]Ah, yeah
[01:10.14]Said, my bad
[01:10.91]Blowin' me up, we been wilin'
[01:14.50]We was cool, yeah, we was vibin'
[01:18.11]Gotta put my phone on silent
[01:19.98]So my, my, my, my bad
[01:23.49]Blowin' me up, we been wilin'
[01:24.19]We were cool, yeah, we was vibin'
[01:24.91]Gotta put my phone on silent
[01:29.26]So my, my, my bad
[01:33.15]Gave you all the signs
[01:38.03]Gave you all of my time, my love
[01:38.97]You're followin' the signs
[01:39.77]But you're followin' the wrong signs, my love
[01:43.20]Gave you all the signs
[01:45.68]Gave you all of my time, my love
[01:49.32](Gave you all my time and all my love)
[01:49.84]You're followin' the signs
[01:53.87]But you're followin' the wrong signs, my love
[01:56.15]Said, my bad
[02:00.42]Blowin' me up, we been wilin'
[02:04.82]We was cool, yeah, we was vibin' (Vibin')
[02:07.11]Gotta put my phone on silent (On silent)
[02:07.74]So my, my, my, my bad (My bad)
[02:08.25]Blowin' me up, we been wilin' (Blowin' me up)
[02:09.14]We were cool, yeah, we was vibin'
[02:09.49]Gotta put my phone on silent
[02:14.52]So my, my, my bad
[02:18.24]Oh my, my, my
[02:21.01]Oh my, my, my
[02:24.08]My bad, my bad
[02:27.53]Alright

[02:33.65]`;
const Player = () => {
    const audioElement = useRef<HTMLAudioElement>(null);
    const { audio, nextTrack, prevTrack, playing, setPlaying } = useAudioStore();
    const [isOpen, setIsOpen] = useState(true)
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioPlayer, setAP] = useState<HTMLAudioElement>();
    const [seeking, setSeeking] = useState(false);
    const parsedLyrics = lyrics.split('\n')
        .map(line => {
            const match = line.match(/^\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
            if (match) {
                const [_, minutes, seconds, milliseconds, text] = match;
                const time = parseInt(minutes) * 60 + parseInt(seconds) + parseInt(milliseconds) / 100;

                return { time, text };
            }
            return null;
        })
        .filter(line => line !== null);


    useEffect(() => {
        const audioTag = document.getElementById('mainAudio') as HTMLAudioElement;
        if (audioTag) {
            audioTag.src = `/uploads/audios/${audio.audio_url as string}`;
            setAP(audioTag);

            // Attach the event listeners immediately to audioTag
            const handleTimeUpdate = () => {
                if (!seeking) {
                    const progress = (audioTag.currentTime / audioTag.duration) * 100;
                    setAudioProgress(progress);
                }
            };

            const handleEnded = () => {
                nextTrack();
            };

            audioTag.addEventListener('timeupdate', handleTimeUpdate);
            audioTag.addEventListener('ended', handleEnded);

            // Play if already in playing state
            if (playing) {
                audioTag.play();
            }

            // Clean up listeners when component unmounts or audio changes
            return () => {
                audioTag.removeEventListener('timeupdate', handleTimeUpdate);
                audioTag.removeEventListener('ended', handleEnded);
            };
        }
    }, [audio]); // Only depends on audio


    useEffect(() => {
        if (audioPlayer) {
            // Define the event handler for the 'timeupdate' event
            const handleTimeUpdate = () => {
                if (!seeking) {  // Only update progress if we are not seeking
                    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                    setAudioProgress(progress);
                }
            };

            // Add the 'ended' and 'timeupdate' event listeners
            audioPlayer.addEventListener('timeupdate', handleTimeUpdate);
            audioPlayer.addEventListener('ended', nextTrack);

            // Cleanup function to remove the 'ended' and 'timeupdate' event listeners
            return () => {
                audioPlayer.removeEventListener('ended', nextTrack);
                audioPlayer.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }
    }, [audio, playing, seeking]);

    // Handle play pause Global state
    useEffect(() => {
        if (audioPlayer) {
            if (playing) {
                audioPlayer.play();
            } else {
                audioPlayer.pause();
            }
        }
    }, [playing, audioPlayer]);

    // Handle when the user manually changes the slider (seek position)
    const handleSeek = (value: number) => {
        if (audioPlayer) {
            setSeeking(true)
            const newTime = (value * audioPlayer.duration / 100);
            audioPlayer.currentTime = newTime;
            setAudioProgress(value);
        }
    };

    // Ensure seeking ends when the user is done with the slider
    const handleSliderMouseUp = () => {
        setSeeking(false);  // Mark seeking as false when the user stops interacting
    };

    const togglePlayPause = () => {
        if (playing) {
            setPlaying(false)
            audioPlayer?.pause()
        }
        else { audioPlayer?.play(); setPlaying(true); }
    };
    // 

    return (
        <>
            {
                audio.cover_url ?
                    <div
                        className="w-full h-full bg-no-repeat bg-cover md:mt-0 p-0"
                        style={{ backgroundImage: `url('/uploads/images/${audio.cover_url}')` }}
                    >
                        <div className={`flex flex-col w-full md:max-h-10 md:p-0  pb-6 md:rounded-none  md:bg-[#ff3030] dark:bg-black/30 bg-black/30 h-full   backdrop-blur-sm ${isOpen ? 'h-[100vh]' : 'h-20'}`}>
                            <div className={`md:hidden flex-col w-screen h-[68%] py-4 pb-6 space-y-6 ${isOpen ? 'flex' : 'hidden'}`}>
                                <div className="flex space-x-6 h-20 p-2 items-center">
                                    <Link to={`/artists/${audio.artist_name}`}>
                                        <img src={`/uploads/images/${audio?.cover_url}`}
                                            className='w-20 h-20 rounded-full object-cover' alt="" />
                                    </Link>
                                    <div className="flex flex-col space-y-2 justify-center items-start ">
                                        <p className='text-lg text-white font-thin pl-2'>{audio.artist_name}</p>
                                        <div className="rounded-xl shadow-3 bg-[#111]/80 px-4 py-2">
                                            <p className='text-red-500'> Follow +</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-around items-center">
                                    <div className="flex flex-col w-[10%] space-y-8 py-4">
                                        <p className='bg-[#111]/50 items-center justify-center h-10 w-10 rounded-full py-2 flex text-white'>
                                            <BiMoviePlay color='red' size={23} />
                                        </p>
                                        <p className='bg-[#111]/50 items-center justify-center h-10 w-10 rounded-full p-2 flex text-white'>
                                            <BsHeart color='red' size={20} />
                                        </p>
                                        <p className='bg-[#111]/50 items-center justify-center h-10 w-10 rounded-full p-2 flex text-white'>
                                            <BsShare color='red' size={20} />
                                        </p>
                                        <a download={true} href={`/uploads/audios/${audio.audio_url}`} className='bg-[#111]/50 items-center justify-center h-10 w-10 rounded-full p-2 flex text-white'>
                                            <BsDownload color='red' size={20} />
                                        </a>
                                    </div>
                                    <div className="w-4/5 h-full justify-center overflow-hidden text-center md:w-1/4">
                                        <LyricsPlayer audioRef={audioElement as React.RefObject<HTMLAudioElement>} lyrics={parsedLyrics} />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full h-[30%] flex flex-col px-6 space-y-4  py-2 md:space-x-4 items-center md:flex-row md:h-20">
                                <div className="flex items-center h-18 space-x-4 w-full md:hidden">
                                    <img src={`/uploads/images/${audio?.cover_url}`} className={`rounded-full object-cover h-18 w-18 cursor-pointer ${playing ? 'rotation-animation' : ''}`} onClick={() => { setIsOpen(!isOpen) }} alt="" />
                                    <div className='w-3/4 h-18 flex flex-col space-y-3'>
                                        <div className="w-full flex flex-col justify-start text-white items-start">
                                            <p className="text-md font-thin">{audio?.artist_name}</p>
                                            <p className="text-sm text-[#cacaca]">{audio?.title}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full">
                                    <RadixSlider.Root
                                        className="custom-slider relative"
                                        min={0}
                                        max={100}
                                        step={0.1}
                                        value={[audioProgress]}
                                        onValueChange={(value) => handleSeek(value[0])}
                                        onValueCommit={() => handleSliderMouseUp()}
                                    >
                                        {/* <RadixSlider.Track className="bg-blue-600 relative grow rounded-full h-1"> */}
                                        {/* <RadixSlider.Range className="absolute bg-red-500 rounded-full h-full" /> */}
                                        {/* </RadixSlider.Track> */}
                                        <RadixSlider.Thumb className=" flex w-6 h-6 backdrop-blur-lg bg-red-700 border-4 border-[#0e0d0dc0] rounded-full shadow hover:bg-red-500 focus:outline-none" />
                                    </RadixSlider.Root>
                                </div>

                                <div className="controls w-full flex items-center space-x-6  pb-3">
                                    <IoIosSkipBackward color="white" className='cursor-pointer' size={20} onClick={() => { prevTrack() }} />
                                    {
                                        playing
                                            ?
                                            <IoIosPause className='cursor-pointer p-1 bg-[#6100004d] backdrop-blur-2xl rounded-full' color="red" size={40} onClick={togglePlayPause} />
                                            :
                                            <IoIosPlayCircle className='cursor-pointer p-1 bg-[#6100004d] backdrop-blur-2xl rounded-full' color="red" size={40} onClick={togglePlayPause} />
                                    }
                                    <IoIosSkipForward className='cursor-pointe' size={20}
                                        color="white"
                                        onClick={() => { nextTrack() }}
                                    />
                                </div>

                                <audio id="mainAudio" ref={audioElement} preload='lazy' />
                            </div>
                        </div >
                    </div > : <p>Loading</p>
            }
        </>
    );
}

export default Player;
