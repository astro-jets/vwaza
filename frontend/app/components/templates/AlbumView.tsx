import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import { BsPlayFill, BsPauseFill, BsMusicNoteBeamed } from "react-icons/bs";
import { FaTrash, FaCheck, FaTimes, FaCamera, FaEdit } from "react-icons/fa";
import { IoPencilOutline, IoTrashBin, IoArrowBack } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "~/context/AuthContext";
import DeleteModal from "../modals/DeleteModal";
import WaveSurferPlayer from "../WaveSurferPlayer";
import DefaultLoader from "../layouts/DefaultLoader";

type Track = {
    releaseID: number;
    release_type: string;
    id: number; // maps to tracks.id
    title: string;
    genre: string;
    audio_url: string;
    artist_name: string;
    track_number: number; // maps to release_tracks.track_number
    release_title: string;
    cover_url?: string;
};

export default function AlbumView() {
    const { id: releaseID } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);

    // Track Management States
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const currentRelease = tracks[selectedIndex];
    const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'track' | 'release';
        id: number | null;
        name: string;
    }>({ isOpen: false, type: 'track', id: null, name: '' });

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



    if (loading) return <div className="p-20 text-center text-red-500 animate-pulse font-black"><DefaultLoader /></div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Release Header */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">

                    {/* Cover Image with Edit Overlay */}
                    <div className="relative group shrink-0">
                        <img
                            src={`import type { EmblaOptionsType } from 'embla-carousel'${tracks[0]?.cover_url}` || '/placeholder.png'}
                            className="w-56 h-56 rounded-2xl shadow-2xl object-cover border border-neutral-700 transition-transform group-hover:scale-[1.02]"
                        />
                    </div>

                    <div className="flex-1 w-full space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1 flex-1">

                                <h2 className="text-4xl font-black text-white leading-tight flex items-center gap-4">
                                    {currentRelease?.release_title}

                                </h2>

                                <p className="text-xl text-white tracking-tighter capitalize">{currentRelease?.release_type}</p>
                            </div>

                        </div>

                        <div className="bg-black/40 p-5 rounded-2xl border border-white/5 backdrop-blur-md">
                            <WaveSurferPlayer
                                tracks={tracks}
                                initialIndex={selectedIndex}
                                isPlaying={isPlaying}
                                setIsPlaying={setIsPlaying}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tracklist */}
            <div className="space-y-2">
                {tracks.map((track) => (
                    <div key={track.id} className="group bg-neutral-900/80 border border-neutral-800 p-4 rounded-xl flex items-center justify-between hover:border-red-600/40 transition-all">
                        <div className="flex items-center space-x-4 flex-1">
                            <span className="text-neutral-600 font-mono text-xs w-5">{track.track_number}</span>

                            <div className="flex flex-col">
                                <span className="text-white font-bold tracking-wide">{track.title}</span>
                                <span className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">{track.genre}</span>
                            </div>

                        </div>

                        {/* Control Actions */}
                        <div className="flex items-center space-x-3">
                            <TrackAction
                                icon={playingTrackId === track.id ? <BsPauseFill size={22} /> : <BsPlayFill size={22} />}
                                onClick={() => setPlayingTrackId(playingTrackId === track.id ? null : track.id)}
                                active={playingTrackId === track.id}
                                hoverColor="hover:text-red-500"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Sub-component for Buttons ---
const TrackAction = ({ icon, onClick, active, hoverColor }: any) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-lg bg-neutral-800 border border-neutral-700 transition-all active:scale-90 
        ${active ? 'text-red-500 border-red-500/50 shadow-[0_0_10px_rgba(220,38,38,0.2)]' : 'text-neutral-400'} 
        ${hoverColor} hover:bg-neutral-700`}
    >
        {icon}
    </button>
);