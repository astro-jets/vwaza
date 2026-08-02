import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import {
    BiPlay,
    BiPause,
    BiTime,
    BiMusic,
    BiArrowBack,
    BiShuffle
} from 'react-icons/bi';
import { useAudioStore, type Track } from 'stores/MusicStore';
import DefaultLayout from '~/components/layouts/DefaultLayout';

export interface PlaylistTrack {
    id: string;
    title: string;
    genre: string;
    audio_url: string;
    duration_ms: number;
    position: number;
    artist_name?: string;
}

export interface PlaylistDetail {
    id: string;
    title: string;
    description?: string;
    cover_url?: string;
    is_public: boolean;
    created_at: string;
    creator_name: string;
    tracks: PlaylistTrack[];
}

export default function PlaylistSinglePage() {
    const { id } = useParams<{ id: string }>();
    const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const { audio, playing, setAudio, setQueue, setPlaying } = useAudioStore();

    useEffect(() => {
        if (id) {
            fetchPlaylistDetail(id);
        }
    }, [id]);

    const fetchPlaylistDetail = async (playlistId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3001/playlist/${playlistId}`);
            if (res.ok) {
                const data = await res.json();
                setPlaylist(data);
            }
        } catch (err) {
            console.error('Failed to fetch playlist:', err);
        } finally {
            setLoading(false);
        }
    };

    // Format track duration from ms to MM:SS
    const formatDuration = (ms: number) => {
        if (!ms) return '0:00';
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Convert API tracks to the Track interface expected by useAudioStore
    const getFormattedQueue = (): Track[] => {
        if (!playlist || !playlist.tracks) return [];
        return playlist.tracks.map((t, idx) => ({
            id: t.id as any,
            title: t.title,
            genre: t.genre || 'Various',
            cover_url: playlist.cover_url || '',
            audio_url: t.audio_url,
            track_number: t.position || idx + 1,
            release_title: playlist.title,
            artist_name: t.artist_name || playlist.creator_name || 'Various Artists',
        }));
    };

    // Play a specific track in the playlist
    const handlePlayTrack = (trackIndex: number) => {
        const queue = getFormattedQueue();
        if (queue.length === 0) return;

        setQueue(queue);
        setAudio(queue[trackIndex]);
        setPlaying(true);
    };

    // Play/Pause entire playlist from hero button
    const handleTogglePlayAll = () => {
        const queue = getFormattedQueue();
        if (queue.length === 0) return;

        const isCurrentPlaylistPlaying =
            audio && queue.some((t) => t.audio_url === audio.audio_url) && playing;

        if (isCurrentPlaylistPlaying) {
            setPlaying(false);
        } else {
            setQueue(queue);
            setAudio(queue[0]);
            setPlaying(true);
        }
    };

    // Play shuffled
    const handleShufflePlay = () => {
        const queue = getFormattedQueue();
        if (queue.length === 0) return;

        const shuffled = [...queue].sort(() => Math.random() - 0.5);
        setQueue(shuffled);
        setAudio(shuffled[0]);
        setPlaying(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0d0d12] text-slate-100 p-8 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="min-h-screen bg-[#0d0d12] text-slate-100 p-8 flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold mb-2">Playlist Not Found</h2>
                <Link to="/playlists" className="text-red-500 hover:underline text-sm flex items-center gap-1">
                    <BiArrowBack /> Back to Playlists
                </Link>
            </div>
        );
    }

    const isPlaylistActive =
        audio && playlist.tracks?.some((t) => t.audio_url === audio.audio_url);

    return (
        <DefaultLayout>
            <div className="min-h-screen  w-full text-slate-100 pb-32">
                {/* Banner / Hero Section */}
                <div className="relative p-6 md:p-10 border-b border-slate-800/80">
                    <Link
                        to="/playlists"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
                    >
                        <BiArrowBack size={16} /> Back to Playlists
                    </Link>

                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 max-w-7xl mx-auto">
                        {/* Cover Art */}
                        <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden bg-slate-900 shadow-2xl shrink-0 border border-slate-700/50">
                            <img
                                src={
                                    playlist.cover_url
                                        ? `/uploads/images/${playlist.cover_url}`
                                        : '/placeholder-cover.jpg'
                                }
                                alt={playlist.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop';
                                }}
                            />
                        </div>

                        {/* Details */}
                        <div className="flex-1 text-center md:text-left space-y-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-red-500">
                                Playlist
                            </span>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                                {playlist.title}
                            </h1>
                            {playlist.description && (
                                <p className="text-sm text-slate-400 max-w-2xl">{playlist.description}</p>
                            )}

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400 pt-2">
                                <span className="font-medium text-slate-200">Created by {playlist.creator_name}</span>
                                <span>•</span>
                                <span>{playlist.tracks?.length || 0} tracks</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                                <button
                                    onClick={handleTogglePlayAll}
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg shadow-red-600/30 active:scale-95"
                                >
                                    {isPlaylistActive && playing ? (
                                        <>
                                            <BiPause size={22} /> Pause
                                        </>
                                    ) : (
                                        <>
                                            <BiPlay size={22} /> Play All
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleShufflePlay}
                                    className="p-3 rounded-full bg-[#161622] hover:bg-[#222233] text-slate-300 hover:text-white border border-slate-800 transition-all active:scale-95"
                                    title="Shuffle Play"
                                >
                                    <BiShuffle size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tracklist Table */}
                <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8">
                    {playlist.tracks && playlist.tracks.length > 0 ? (
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-400 border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 text-xs font-semibold uppercase text-slate-500">
                                        <th className="py-3 px-4 w-12 text-center">#</th>
                                        <th className="py-3 px-4">Title</th>
                                        <th className="py-3 px-4 hidden md:table-cell">Genre</th>
                                        <th className="py-3 px-4 text-right w-24">
                                            <BiTime className="inline" size={16} />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {playlist.tracks.map((track, idx) => {
                                        const isTrackPlaying = audio?.audio_url === track.audio_url && playing;

                                        return (
                                            <tr
                                                key={track.id || idx}
                                                onClick={() => handlePlayTrack(idx)}
                                                className={`group hover:bg-[#161622] cursor-pointer transition-colors border-b border-slate-900 ${isTrackPlaying ? 'bg-[#161622]/80 text-red-500 font-semibold' : ''
                                                    }`}
                                            >
                                                {/* # / Play Icon */}
                                                <td className="py-3.5 px-4 text-center font-medium">
                                                    <span className="group-hover:hidden">
                                                        {isTrackPlaying ? (
                                                            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping mx-auto" />
                                                        ) : (
                                                            idx + 1
                                                        )}
                                                    </span>
                                                    <BiPlay
                                                        size={20}
                                                        className="hidden group-hover:block mx-auto text-white group-hover:text-red-500"
                                                    />
                                                </td>

                                                {/* Track Details */}
                                                <td className="py-3.5 px-4">
                                                    <div className="font-semibold text-slate-100 group-hover:text-red-500 transition-colors">
                                                        {track.title}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {track.artist_name || playlist.creator_name}
                                                    </div>
                                                </td>

                                                {/* Genre */}
                                                <td className="py-3.5 px-4 hidden md:table-cell text-xs text-slate-500">
                                                    {track.genre || 'Single'}
                                                </td>

                                                {/* Duration */}
                                                <td className="py-3.5 px-4 text-right text-xs font-mono text-slate-500">
                                                    {formatDuration(track.duration_ms)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-[#161622] rounded-2xl border border-slate-800 p-6">
                            <BiMusic size={40} className="mx-auto text-slate-500 mb-2" />
                            <p className="text-slate-400 text-sm">No tracks in this playlist yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
}