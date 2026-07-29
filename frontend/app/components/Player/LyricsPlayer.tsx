import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LyricLine {
    time: number;
    text: string;
}

interface LyricsPlayerProps {
    lyrics: LyricLine[];
    audioRef: React.RefObject<HTMLAudioElement>; // Pass the audio element ref
}

const LyricsPlayer: React.FC<LyricsPlayerProps> = ({ lyrics, audioRef }) => {
    const [currentTime, setCurrentTime] = useState<number>(0);
    const lyricsRef = useRef<HTMLDivElement>(null);


    // Sync currentTime with the audio playback
    useEffect(() => {
        const audioElement = audioRef.current;
        if (!audioElement) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audioElement.currentTime);
        };

        audioElement.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [audioRef]);

    // Find the current lyric based on the currentTime
    const currentLyricIndex = lyrics.findIndex(
        (line, index) =>
            currentTime >= line.time &&
            (index === lyrics.length - 1 || currentTime < lyrics[index + 1].time)
    );

    // Display the current lyric and the next one (if any)
    const visibleLyrics = [];
    if (currentLyricIndex !== -1) {
        visibleLyrics.push(lyrics[currentLyricIndex]);
        if (currentLyricIndex + 1 < lyrics.length) {
            visibleLyrics.push(lyrics[currentLyricIndex + 1]);
        }
    }

    return (
        <div
            className="w-full h-full overflow-hidden  text-white rounded-xl "
            ref={lyricsRef}
        >
            <AnimatePresence>
                {visibleLyrics.map((line, index) => (
                    <motion.p
                        key={line.time}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="text-xl text-justify font-thin  my-4 text-white"
                    >
                        {line.text}
                    </motion.p>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default LyricsPlayer;