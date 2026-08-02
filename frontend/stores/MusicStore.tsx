import { create } from "zustand";

export interface Track {
    id?: number;
    releaseID?: number;
    title: string;
    featuring?: string;
    genre: string;
    cover_url?: string;
    audio_url: string;
    track_number: number;
    release_title: string;
    release_date?: string;
    release_type?: 'single' | 'album' | 'ep' | string;
    status?: boolean;
    artist_name: string;
    plays?: number;
}

export interface AudioState {
    audio: Track | null;
    queue: Track[];
    playing: boolean;
    setAudio: (track: Track) => void;
    setQueue: (queue: Track[]) => void;
    setPlaying: (playing: boolean) => void;
    nextTrack: () => void;
    prevTrack: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
    audio: null,
    queue: [],
    playing: false,

    setAudio: (track) => set({ audio: track }),
    setQueue: (queue) => set({ queue }),
    setPlaying: (playing) => set({ playing }),

    nextTrack: () => {
        const { queue, audio } = get();
        if (!queue.length || !audio) return;

        const currentIndex = queue.findIndex((track) => track.audio_url === audio.audio_url);
        if (currentIndex === -1) return;

        const nextIndex = (currentIndex + 1) % queue.length;
        set({ audio: queue[nextIndex], playing: true });
    },

    prevTrack: () => {
        const { queue, audio } = get();
        if (!queue.length || !audio) return;

        const currentIndex = queue.findIndex((track) => track.audio_url === audio.audio_url);
        if (currentIndex === -1) return;

        const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
        set({ audio: queue[prevIndex], playing: true });
    },
}));