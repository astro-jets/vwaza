import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router";
import axios from "axios";
import { FiPlay, FiPause, FiMusic } from "react-icons/fi";
import { useAudioStore } from "stores/MusicStore";
import { useAuth } from "~/context/AuthContext";

interface Track {
    id: string;
    title: string;
    genre: string;
    audio_url: string;
    duration_ms: number;
    position: number;
    artist_name: string;
}

interface Playlist {
    id: string;
    title: string;
    description?: string;
    cover_url?: string;
    is_public: boolean;
    created_at: string;
    creator_name: string;
    tracks: Track[];
}

interface DiscoverSliderProps {
    playlistId?: string;
}

const DiscoverSlider: React.FC<DiscoverSliderProps> = ({ playlistId }) => {
    const { id: paramId } = useParams<{ id: string }>();
    const { token } = useAuth();

    // Prioritize passed prop ID over route param ID, with a fallback default
    const activePlaylistId = playlistId || paramId || "56a33f6a-daf6-4904-83bc-d0c52e329981";

    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Primitive Zustand selectors to prevent re-render infinite loops
    const audio = useAudioStore((state: any) => state.audio);
    const playing = useAudioStore((state: any) => state.playing);
    const setPlaying = useAudioStore((state: any) => state.setPlaying);
    const setAudio = useAudioStore((state: any) => state.setAudio || state.setCurrentTrack);
    const setQueue = useAudioStore((state: any) => state.setQueue);

    const fetchPlaylistDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get<Playlist>(
                `http://localhost:3001/playlist/${activePlaylistId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setPlaylist(res.data);
        } catch (err: any) {
            console.error("Error fetching playlist:", err);
            setError("Failed to load discover tracks.");
        } finally {
            setLoading(false);
        }
    }, [activePlaylistId, token]);

    useEffect(() => {
        if (activePlaylistId) {
            fetchPlaylistDetails();
        }
    }, [activePlaylistId, fetchPlaylistDetails]);

    // Handle play/pause toggles or selecting new tracks
    const handleTrackClick = useCallback(
        (track: Track, index: number) => {
            const isCurrentTrack = audio?.id === track.id;

            if (isCurrentTrack) {
                setPlaying(!playing);
            } else {
                const trackData = {
                    ...track,
                    cover_url: playlist?.cover_url || "",
                    artist_name: track.artist_name || playlist?.creator_name || "Unknown Artist",
                };

                if (playlist?.tracks && setQueue) {
                    const formattedQueue = playlist.tracks.map((t) => ({
                        ...t,
                        cover_url: playlist.cover_url || "",
                        artist_name: t.artist_name || playlist.creator_name || "Unknown Artist",
                    }));
                    setQueue(formattedQueue, index);
                }

                if (setAudio) {
                    setAudio(trackData);
                }
                setPlaying(true);
            }
        },
        [audio, playing, playlist, setAudio, setQueue, setPlaying]
    );

    // Format cover image URL properly
    const getCoverImage = (url?: string) => {
        if (!url) return null;
        return url.startsWith("http") ? url : `/uploads/images/${url}`;
    };

    if (error) {
        return null; // Silently fail or replace with error message component
    }

    return (
        <section className="my-6">
            <div className="flex items-center justify-between mb-4 px-4 font-thin">
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Discover
                </h2>
                <Link
                    to="/discover"
                    className="text-sm font-semibold text-red-600 hover:text-red-500 transition-colors"
                >
                    See all
                </Link>
            </div>

            {/* Skeleton Loading State */}
            {loading ? (
                <div className="flex px-4 gap-4 overflow-x-auto pb-4 scrollbar-none">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="min-w-[12rem] w-48 bg-neutral-100 dark:bg-[#101010d8] rounded-xl p-3 animate-pulse"
                        >
                            <div className="w-full h-44 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-3" />
                            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : playlist && playlist.tracks.length > 0 ? (
                <div className="flex px-4 gap-4 overflow-x-auto pb-4 scrollbar-none snap-x">
                    {playlist.tracks.map((track, index) => {
                        const isCurrentTrack = audio?.id === track.id;
                        const isCurrentlyPlaying = isCurrentTrack && playing;
                        const coverSrc = getCoverImage(playlist.cover_url);

                        return (
                            <div
                                key={track.id || index}
                                onClick={() => handleTrackClick(track, index)}
                                className={`group min-w-[12rem] w-48 bg-white dark:bg-[#101010d8] border transition-all duration-200 backdrop-blur rounded-xl p-3 shadow-sm hover:shadow-md cursor-pointer snap-start flex-shrink-0 ${isCurrentTrack
                                    ? "border-red-600 ring-1 ring-red-600"
                                    : "border-neutral-200 dark:border-neutral-800/60 hover:border-neutral-300 dark:hover:border-neutral-700"
                                    }`}
                            >
                                {/* Thumbnail Container */}
                                <div className="relative w-full h-44 rounded-lg overflow-hidden mb-3 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                                    {coverSrc ? (
                                        <img
                                            src={coverSrc}
                                            alt={track.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <FiMusic className="text-neutral-500 w-10 h-10" />
                                    )}

                                    {/* Overlay Play/Pause Button */}
                                    <div
                                        className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${isCurrentTrack ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                            }`}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                            {isCurrentlyPlaying ? (
                                                <FiPause className="w-6 h-6 fill-current" />
                                            ) : (
                                                <FiPlay className="w-6 h-6 fill-current ml-0.5" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Track Info */}
                                <h3
                                    className={`font-semibold text-sm truncate ${isCurrentTrack ? "text-red-600 dark:text-red-500" : "text-neutral-900 dark:text-white"
                                        }`}
                                >
                                    {track.title}
                                </h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                                    {track.artist_name || playlist.creator_name || "Unknown Artist"}
                                </p>
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </section>
    );
};

export default DiscoverSlider;