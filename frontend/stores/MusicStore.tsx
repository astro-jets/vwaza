// import { Track } from "@/types/Track";
import { create } from "zustand";

interface Track {
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


export interface AudioState {
    audio: Track;
    queue: Track[];
    playing: boolean;
    setAudio: (track: Track) => void;
    setQueue: (queue: Track[]) => void;
    setPlaying: (playing: boolean) => void;
    nextTrack: () => void;
    prevTrack: () => void;
}

// Zustand store
export const useAudioStore = create<AudioState>((set, get) => ({
    audio: {
        artist_name: "", audio_url: "", cover_url: "", title: "",
        genre: "",
        track_number: 0,
        release_title: "",
        release_date: "",
        release_type: "single",
        status: false
    },
    queue: [],
    playing: false,

    setAudio: (track) => set({ audio: track }),
    setQueue: (queue) => set({ queue }),
    setPlaying: (playing) => set({ playing }),

    nextTrack: () => {
        const { queue, audio } = get();
        const currentIndex = queue.findIndex((track) => track.audio_url === audio.audio_url);
        const nextIndex = (currentIndex + 1) % queue.length;
        set({ audio: queue[nextIndex] });
    },

    prevTrack: () => {
        const { queue, audio } = get();
        const currentIndex = queue.findIndex((track) => track.audio_url === audio.audio_url);
        const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
        set({ audio: queue[prevIndex] });
    },
}));
