import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router";
import axios from "axios";
import { FiPlay, FiPause, FiClock, FiMusic, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "~/context/AuthContext";
import { useAudioStore } from "stores/MusicStore";

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

const SinglePlaylistTemplate: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { token } = useAuth();

    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ FIX: Use individual primitive selectors to prevent infinite re-render loop
    const audio = useAudioStore((state: any) => state.audio);
    const playing = useAudioStore((state: any) => state.playing);
    const setPlaying = useAudioStore((state: any) => state.setPlaying);
    const setAudio = useAudioStore((state: any) => state.setAudio || state.setCurrentTrack);
    const setQueue = useAudioStore((state: any) => state.setQueue);

    useEffect(() => {
        if (id) {
            fetchPlaylistDetails();
        }
    }, [id]);

    const fetchPlaylistDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get<Playlist>(
                `http://localhost:3001/playlist/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setPlaylist(res.data);
        } catch (err: any) {
            console.error("Error fetching playlist:", err);
            setError("Failed to load playlist details.");
        } finally {
            setLoading(false);
        }
    };

    // Convert milliseconds to MM:SS format
    const formatDuration = (ms: number) => {
        if (!ms) return "0:00";
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    // Format total duration of all tracks
    const getTotalDuration = (tracks: Track[]) => {
        const totalMs = tracks.reduce((acc, t) => acc + (t.duration_ms || 0), 0);
        return formatDuration(totalMs);
    };

    // Play a specific track or toggle current playback
    const handleTrackClick = useCallback(
        (track: Track, index: number) => {
            const isCurrentTrack = audio?.id === track.id;

            if (isCurrentTrack) {
                // Toggle play/pause if already selected
                setPlaying(!playing);
            } else {
                // Build track payload with cover_url inherited from playlist
                const trackData = {
                    ...track,
                    cover_url: playlist?.cover_url || "",
                    artist_name: track.artist_name || playlist?.creator_name || "Unknown Artist",
                };

                // Prepare queue for next/prev track functionality
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

    // "Play All" button action
    const handlePlayAll = () => {
        if (!playlist || playlist.tracks.length === 0) return;

        const firstTrack = playlist.tracks[0];
        const isFirstPlaying = audio?.id === firstTrack.id && playing;

        if (isFirstPlaying) {
            setPlaying(false);
        } else {
            handleTrackClick(firstTrack, 0);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <p className="text-neutral-400 animate-pulse">Loading playlist...</p>
            </div>
        );
    }

    if (error || !playlist) {
        return (
            <div className="min-h-screen bg-black text-white p-6">
                <Link
                    to="/artists/playlists"
                    className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
                >
                    <FiArrowLeft /> Back to Playlists
                </Link>
                <div className="text-center py-20">
                    <p className="text-red-500 mb-4">{error || "Playlist not found."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-32">
            {/* Back button */}
            <Link
                to="/artists/playlists"
                className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition mb-6"
            >
                <FiArrowLeft className="w-5 h-5" /> Back to Playlists
            </Link>

            {/* Playlist Banner Header */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8 bg-neutral-900/40 p-6 rounded-3xl border border-neutral-800 backdrop-blur-md">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden bg-neutral-800 flex-shrink-0 shadow-2xl flex items-center justify-center border border-neutral-700">
                    {playlist.cover_url ? (
                        <img
                            src={
                                playlist.cover_url.startsWith("http")
                                    ? playlist.cover_url
                                    : `/uploads/images/${playlist.cover_url}`
                            }
                            alt={playlist.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <FiMusic className="text-neutral-600 w-20 h-20" />
                    )}
                </div>

                <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
                    <span className="text-xs uppercase tracking-widest text-red-500 font-bold mb-1">
                        {playlist.is_public ? "Public Playlist" : "Private Playlist"}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
                        {playlist.title}
                    </h1>
                    {playlist.description && (
                        <p className="text-neutral-400 text-sm md:text-base mb-4 max-w-2xl">
                            {playlist.description}
                        </p>
                    )}

                    <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-400">
                        <span className="text-white font-semibold">
                            {playlist.creator_name || "Artist"}
                        </span>
                        <span>•</span>
                        <span>{playlist.tracks?.length || 0} tracks</span>
                        <span>•</span>
                        <span>{getTotalDuration(playlist.tracks || [])}</span>
                    </div>

                    {/* Action Buttons */}
                    {playlist.tracks && playlist.tracks.length > 0 && (
                        <div className="flex items-center gap-4 mt-6">
                            <button
                                onClick={handlePlayAll}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition shadow-lg shadow-red-600/30"
                            >
                                {audio && playlist.tracks.some((t) => t.id === audio.id) && playing ? (
                                    <>
                                        <FiPause className="w-5 h-5 fill-current" /> Pause
                                    </>
                                ) : (
                                    <>
                                        <FiPlay className="w-5 h-5 fill-current" /> Play All
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Tracklist Table */}
            <div className="bg-neutral-900/30 rounded-2xl border border-neutral-800 overflow-hidden">
                {playlist.tracks.length === 0 ? (
                    <div className="py-16 text-center text-neutral-500">
                        <FiMusic className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-lg">This playlist is empty.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-neutral-300">
                            <thead className="bg-neutral-900/80 text-neutral-400 uppercase text-xs border-b border-neutral-800">
                                <tr>
                                    <th className="py-4 px-6 w-12 text-center">#</th>
                                    <th className="py-4 px-6">Title</th>
                                    <th className="py-4 px-6 hidden md:table-cell">Artist</th>
                                    <th className="py-4 px-6 hidden lg:table-cell">Genre</th>
                                    <th className="py-4 px-6 text-right">
                                        <FiClock className="inline w-4 h-4" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/60">
                                {playlist.tracks.map((track, idx) => {
                                    const isCurrentTrack = audio?.id === track.id;
                                    const isCurrentlyPlaying = isCurrentTrack && playing;

                                    return (
                                        <tr
                                            key={track.id || idx}
                                            onClick={() => handleTrackClick(track, idx)}
                                            className={`group hover:bg-neutral-800/50 transition cursor-pointer ${isCurrentTrack ? "bg-red-950/20 text-red-400" : ""
                                                }`}
                                        >
                                            {/* Play / Index Button */}
                                            <td className="py-4 px-6 text-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleTrackClick(track, idx);
                                                    }}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 group-hover:text-white"
                                                >
                                                    {isCurrentlyPlaying ? (
                                                        <FiPause className="w-4 h-4 text-red-500" />
                                                    ) : isCurrentTrack ? (
                                                        <FiPlay className="w-4 h-4 text-red-500" />
                                                    ) : (
                                                        <span className="group-hover:hidden">
                                                            {idx + 1}
                                                        </span>
                                                    )}
                                                    {!isCurrentTrack && (
                                                        <FiPlay className="w-4 h-4 hidden group-hover:block" />
                                                    )}
                                                </button>
                                            </td>

                                            {/* Title */}
                                            <td className="py-4 px-6">
                                                <div className="font-semibold text-white group-hover:text-red-400 transition">
                                                    {track.title}
                                                </div>
                                                <div className="text-xs text-neutral-400 md:hidden mt-0.5">
                                                    {track.artist_name || playlist.creator_name}
                                                </div>
                                            </td>

                                            {/* Artist */}
                                            <td className="py-4 px-6 hidden md:table-cell text-neutral-400">
                                                {track.artist_name || playlist.creator_name}
                                            </td>

                                            {/* Genre */}
                                            <td className="py-4 px-6 hidden lg:table-cell">
                                                {track.genre ? (
                                                    <span className="px-2.5 py-1 text-xs rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                                                        {track.genre}
                                                    </span>
                                                ) : (
                                                    "—"
                                                )}
                                            </td>

                                            {/* Duration */}
                                            <td className="py-4 px-6 text-right font-mono text-xs text-neutral-400">
                                                {formatDuration(track.duration_ms)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SinglePlaylistTemplate;