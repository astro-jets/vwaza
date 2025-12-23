import React, { useCallback, useEffect, useState } from 'react';
import { FaMusic, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '~/context/AuthContext';
import type { IconType } from 'react-icons/lib';
import WaveSurferPlayer from '../WaveSurferPlayer';
import { FiPause, FiPlay } from 'react-icons/fi';


interface ReleaseSummary {
    id: string;
    title: string;
    featuring?: string;
    genre: string;
    cover_url: string;
    audio_url: string;
    release_date: string;
    status: boolean;
    artist_name: string;
}

const ArtistDashboardTemplate: React.FC = () => {
    const [releases, setReleases] = useState<ReleaseSummary[]>([]);
    const { token } = useAuth();

    const [selectedIndex, setSelectedIndex] = useState<number>(-1); // Use -1 for no selection initially
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    // Polling logic for "Real-time" status flips 
    useEffect(() => {
        const fetchReleases = async () => {
            try {
                const res = await axios.get("http://localhost:3001/artist/releases/artist",
                    { headers: { Authorization: `Bearer ${token}` } });
                setReleases(res.data);
                if (res.data.length > 0) {
                    // Automatically select the first track to load the player
                    setSelectedIndex(0);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchReleases();

    }, []);

    const handlePlayClick = useCallback((index: number) => {
        if (selectedIndex === index) {
            // If the same track is clicked, toggle play/pause status
            setIsPlaying(prev => !prev);
        } else {
            // If a new track is clicked, select it and start playing
            setSelectedIndex(index);
            setIsPlaying(true);
        }
    }, [selectedIndex]);

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Stats Overview */}
            {releases?.length > 0 &&
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard label="Total Releases"
                            value={releases?.length}
                            icon={FaMusic} color="text-yellow-400" />
                        <StatCard
                            label="Live Tracks"
                            value={releases?.filter(r => r.status === true).length}
                            icon={FaCheckCircle}
                            color="text-green-400"
                        />
                        <StatCard
                            label="In Review"
                            value={releases?.filter(r => r.status === false).length}
                            icon={FaSpinner}
                            color="text-yellow-400"
                        />
                    </div>


                    {/* Status Tracker List */}
                    <div className="bg-neutral-900/50 bg-[#111] border border-neutral-700 rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-neutral-700 flex items-center">
                            {!isPlaying ?
                                <h2 className="text-xl font-bold text-white">Your Releases</h2> :
                                <WaveSurferPlayer
                                    tracks={releases}
                                    initialIndex={selectedIndex}
                                    isPlaying={isPlaying} setIsPlaying={function (playing: boolean): void {
                                        throw new Error("Function not implemented.");
                                    }}
                                />
                            }
                        </div>

                        <div className="divide-y divide-neutral-800">
                            {releases?.map((release, idx) => {
                                const isSelected = idx === selectedIndex;
                                const currentTrackPlaying = isSelected && isPlaying;
                                return (
                                    <div key={release.id} className="p-4 flex items-center justify-between hover:bg-neutral-800/40 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-neutral-800 rounded-xl">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevents row selection from firing twice
                                                        handlePlayClick(idx);
                                                    }}
                                                    className={` 'bg-red-600 hover:bg-red-700' : 'bg-netural-700 hover:bg-red-600'} text-white`}
                                                >
                                                    {currentTrackPlaying ? (
                                                        <FiPause className="w-5 h-5" />

                                                    ) : (
                                                        <FiPlay className="w-5 h-5" />

                                                    )}
                                                </button>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white">{release.title}</h3>
                                                <p className="text-xs text-white text-neutral-500">{release.artist_name}</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={release.status} />
                                    </div>
                                )
                            })}
                            {releases?.length === 0 && (
                                <div className="p-12 text-center text-neutral-500">No active releases found.</div>
                            )}
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

// --- Sub-Components ---

const StatCard: React.FC<{ label: string; value: number; icon: IconType; color: string }> = ({ label, icon: Icon, color, value }) => (
    <div className="bg-neutral-900/50 border border-neutral-700 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-neutral-400 text-sm font-medium uppercase tracking-wider">{label}</p>
                <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className={`p-3 bg-neutral-800 rounded-lg ${color}`}>
                <Icon size={20} />
            </div>
        </div>
    </div>
);

const StatusBadge: React.FC<{ status: boolean }> = ({ status }) => {
    const configs = {
        'false': { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: FaSpinner, label: 'Processing', animate: 'animate-spin' },
        'true': { color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: FaCheckCircle, label: 'Published', animate: '' }
    };

    const config = status ? configs['true'] : configs['false'];
    const Icon = config.icon;

    return (
        <div className={`flex items-center px-4 py-1.5 rounded-full border text-xs font-bold space-x-2 ${config.color}`}>
            <Icon className={config.animate} />
            <span>{config.label}</span>
        </div>
    );
};

export default ArtistDashboardTemplate;