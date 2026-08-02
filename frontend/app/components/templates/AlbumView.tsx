import axios from "axios";
import { useEffect, useState } from "react";
import { BsPlayFill, BsPauseFill, BsMusicNoteBeamed } from "react-icons/bs";
import { IoArrowBack } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "~/context/AuthContext";
import { useAudioStore, type Track } from "stores/MusicStore"; // Single source of truth
import DefaultLoader from "../layouts/DefaultLoader";


export default function AlbumView() {
    const { id: releaseID } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const { audio, playing, setPlaying, setAudio, setQueue } = useAudioStore();

    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (releaseID) fetchReleaseData();
    }, [releaseID]);

    const fetchReleaseData = async () => {
        try {
            const res = await axios.get<Track[]>(`http://localhost:3001/artist/releases/${releaseID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTracks(res.data);
        } catch (err) {
            console.error("Error fetching release:", err);
        } finally {
            setLoading(false);
        }
    };

    const currentRelease = tracks[0];

    const handlePlayTrack = (track: Track) => {
        // Compare by audio_url or id
        const isSameTrack = audio?.audio_url === track.audio_url || (audio?.id && track.id && audio.id === track.id);

        if (isSameTrack) {
            setPlaying(!playing);
        } else {
            setQueue(tracks); // Populates store queue so Next/Prev work in main player
            setAudio(track);
            setPlaying(true);
        }
    };

    const handlePlayAll = () => {
        if (tracks.length > 0) {
            handlePlayTrack(tracks[0]);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center p-6 text-red-500 font-bold">
                <DefaultLoader />
            </div>
        );
    }

    return (
        <div className="w-11/12 mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
                <IoArrowBack size={18} />
                <span>Back</span>
            </button>

            {/* Album Header */}
            <div className="bg-white dark:bg-neutral-900 border p-4 border-neutral-200 dark:border-neutral-800 rounded-2xl sm:rounded-3xl  shadow-sm dark:shadow-2xl relative overflow-hidden transition-colors">
                <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-6 sm:gap-8 relative z-10">

                    {/* Cover Art */}
                    <div className="relative group shrink-0">
                        {currentRelease?.cover_url ? (
                            <img
                                src={`/uploads/images/${currentRelease.cover_url}`}
                                alt={currentRelease.release_title || 'Album Cover'}
                                className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-2xl shadow-lg object-cover border border-neutral-200 dark:border-neutral-700 transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                        ) : (
                            <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400 dark:text-neutral-500">
                                <BsMusicNoteBeamed size={48} />
                            </div>
                        )}
                    </div>

                    {/* Metadata & Play All */}
                    <div className="flex-1 w-full space-y-4 text-center sm:text-left">
                        <div className="space-y-1">
                            <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20 mb-1">
                                {currentRelease?.release_type || 'Release'}
                            </span>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 dark:text-white leading-tight">
                                {currentRelease?.release_title || 'Untitled Release'}
                            </h1>
                            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-medium">
                                {currentRelease?.artist_name}
                            </p>
                        </div>

                        <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4">
                            <button
                                onClick={handlePlayAll}
                                className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
                            >
                                {playing && tracks.some((t) => t.audio_url === audio?.audio_url) ? (
                                    <>
                                        <BsPauseFill size={22} />
                                        <span>Pause</span>
                                    </>
                                ) : (
                                    <>
                                        <BsPlayFill size={22} className="ml-0.5" />
                                        <span>Play All</span>
                                    </>
                                )}
                            </button>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                                {tracks.length} {tracks.length === 1 ? 'Track' : 'Tracks'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tracklist */}
            <div className="space-y-3">
                <h2 className="text-lg font-bold px-1 text-neutral-800 dark:text-neutral-200">
                    Tracklist
                </h2>
                <div className="divide-y divide-neutral-200 dark:divide-neutral-800/80 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 transition-colors">
                    {tracks.map((track) => {
                        const isCurrentTrack = audio?.audio_url === track.audio_url;
                        const isCurrentPlaying = isCurrentTrack && playing;

                        return (
                            <div
                                key={track.id || track.audio_url}
                                onClick={() => handlePlayTrack(track)}
                                className={`group p-3 sm:p-4 flex items-center justify-between cursor-pointer transition-colors ${isCurrentTrack
                                    ? 'bg-red-50/70 dark:bg-red-950/20'
                                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                                    }`}
                            >
                                <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0 mr-4">
                                    <span className="text-neutral-400 dark:text-neutral-500 font-mono text-xs w-6 text-center shrink-0">
                                        {isCurrentPlaying ? (
                                            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        ) : (
                                            track.track_number
                                        )}
                                    </span>

                                    <div className="flex flex-col min-w-0">
                                        <span
                                            className={`font-semibold text-sm sm:text-base truncate transition-colors ${isCurrentTrack
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-neutral-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400'
                                                }`}
                                        >
                                            {track.title}
                                        </span>
                                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-bold tracking-wider truncate">
                                            {track.genre}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => handlePlayTrack(track)}
                                        aria-label={isCurrentPlaying ? 'Pause track' : 'Play track'}
                                        className={`p-2 sm:p-2.5 rounded-full transition-all active:scale-90 border ${isCurrentTrack
                                            ? 'bg-red-600 border-red-600 text-white shadow-md'
                                            : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/50'
                                            }`}
                                    >
                                        {isCurrentPlaying ? <BsPauseFill size={18} /> : <BsPlayFill size={18} className="ml-0.5" />}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}