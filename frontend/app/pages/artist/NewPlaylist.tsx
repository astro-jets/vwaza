import React, { useEffect, useState } from "react";
import {
    FiUpload,
    FiMusic,
    FiImage,
    FiArrowRight,
    FiArrowLeft,
    FiTrash2,
    FiLoader,
    FiCheck,
    FiSearch,
    FiGlobe,
    FiLock,
    FiFileText,
} from "react-icons/fi";
import { BsGripVertical } from "react-icons/bs";
import ArtistLayout from "~/components/layouts/ArtistLayout";
import axios from "axios";
import { useAuth } from "~/context/AuthContext";
import SuccessModal from "~/components/modals/SuccessModal";

// --- Types & Interfaces ---
interface Track {
    id: string;
    title: string;
    artist_name?: string;
    genre?: string;
    duration_ms?: number;
    position?: number;
}

interface PlaylistForm {
    title: string;
    description: string;
    isPublic: boolean;
    coverFile: File | null;
    tracks: Track[];
}

interface InputProps {
    icon?: React.ReactNode;
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
    type?: string;
    error?: string | null;
}

// Support for environment variables across Vite, Next.js, and Local fallbacks
const API_BASE_URL =
    "http://localhost:3001/playlist";

// --- Helper Components ---
const Input: React.FC<InputProps> = ({ icon, placeholder, value, onChange, type = "text", error }) => (
    <div className="flex flex-col">
        <div
            className={`flex items-center gap-2 bg-black rounded-xl px-4 py-3 border ${error ? "border-red-600" : "border-neutral-800 focus-within:border-red-600"
                }`}
        >
            {icon && <span className="text-neutral-500">{icon}</span>}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent outline-none text-white text-sm w-full"
            />
        </div>
        {error && <p className="text-xs text-red-500 mt-1 ml-4">{error}</p>}
    </div>
);

function UploadPlaceholder({ icon, label, sub }: { icon: React.ReactNode; label: string; sub?: string }) {
    return (
        <div className="text-center text-neutral-300 space-y-1">
            <div className="mx-auto w-fit text-xl text-red-500">{icon}</div>
            <p className="text-sm font-medium">{label}</p>
            {sub && <p className="text-xs text-neutral-500">{sub}</p>}
        </div>
    );
}

// --- Step 1: Playlist Metadata ---
const PlaylistMetadataStep: React.FC<{
    formData: PlaylistForm;
    setFormData: React.Dispatch<React.SetStateAction<PlaylistForm>>;
    next: () => void;
}> = ({ formData, setFormData, next }) => {
    const [error, setError] = useState<string | null>(null);

    const validateAndNext = () => {
        if (!formData.title.trim()) {
            setError("Playlist Title is required.");
            return;
        }
        setError(null);
        next();
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold text-white border-l-4 border-red-600 pl-3">
                Playlist Details
            </h2>

            {/* Public / Private Toggle */}
            <div className="flex gap-4 p-1 bg-black rounded-xl w-fit">
                <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, isPublic: true }))}
                    className={`px-6 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${formData.isPublic ? "bg-red-600 text-white" : "text-neutral-500 hover:text-white"
                        }`}
                >
                    <FiGlobe /> Public
                </button>
                <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, isPublic: false }))}
                    className={`px-6 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${!formData.isPublic ? "bg-red-600 text-white" : "text-neutral-500 hover:text-white"
                        }`}
                >
                    <FiLock /> Private
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <Input
                    icon={<FiMusic />}
                    placeholder="Playlist Title *"
                    value={formData.title}
                    onChange={(v: string) => setFormData((prev) => ({ ...prev, title: v }))}
                    error={error}
                />

                <div className="flex items-start gap-2 bg-black rounded-xl px-4 py-3 border border-neutral-800 focus-within:border-red-600">
                    <FiFileText className="text-neutral-500 mt-1" />
                    <textarea
                        rows={3}
                        placeholder="Description (Optional)"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        className="bg-transparent outline-none text-white text-sm w-full resize-none"
                    />
                </div>
            </div>

            {/* Cover Image Upload */}
            <label
                className="relative cursor-pointer group block border-2 border-dashed rounded-2xl p-8 transition-all border-neutral-800 hover:border-red-600 bg-black"
            >
                {formData.coverFile ? (
                    <div className="relative h-48 w-48 mx-auto">
                        <img
                            src={URL.createObjectURL(formData.coverFile)}
                            className="rounded-xl object-cover w-full h-full shadow-2xl"
                            alt="Preview"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                            <p className="text-white text-xs font-bold">Change Cover</p>
                        </div>
                    </div>
                ) : (
                    <UploadPlaceholder
                        icon={<FiImage />}
                        label="Upload Cover Art (Optional)"
                        sub="JPEG or PNG (1:1 aspect ratio recommended)"
                    />
                )}
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                        e.target.files?.[0] &&
                        setFormData((prev) => ({ ...prev, coverFile: e.target.files![0] }))
                    }
                />
            </label>

            <div className="flex justify-end pt-4">
                <button
                    type="button"
                    onClick={validateAndNext}
                    className="bg-red-600 hover:bg-red-500 px-8 py-3 rounded-xl text-white font-bold flex items-center gap-2 shadow-lg shadow-red-900/20"
                >
                    Add Tracks <FiArrowRight />
                </button>
            </div>
        </div>
    );
};

// --- Step 2: Add & Drag-and-Drop Reorder Tracks ---
const PlaylistTracksStep: React.FC<{
    formData: PlaylistForm;
    setFormData: React.Dispatch<React.SetStateAction<PlaylistForm>>;
    prev: () => void;
    next: () => void;
}> = ({ formData, setFormData, prev, next }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<Track[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const { token } = useAuth();

    // Search existing tracks with AbortController to handle race conditions
    useEffect(() => {
        if (searchTerm.trim().length < 2) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        const controller = new AbortController();

        const delayDebounce = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await axios.get(`http://localhost:3001/playlist/tracks`, {
                    params: { search: searchTerm },
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    signal: controller.signal,
                });

                // Standardize handling of response formats
                const tracksData = Array.isArray(res.data)
                    ? res.data
                    : res.data.tracks || res.data.data || [];

                setSearchResults(tracksData);
            } catch (err: any) {
                if (!axios.isCancel(err)) {
                    console.error("Search tracks failed", err);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsSearching(false);
                }
            }
        }, 400);

        return () => {
            clearTimeout(delayDebounce);
            controller.abort();
        };
    }, [searchTerm, token]);

    const addTrackToPlaylist = (track: Track) => {
        if (formData.tracks.some((t) => t.id === track.id)) return;

        setFormData((prev) => ({
            ...prev,
            tracks: [
                ...prev.tracks,
                { ...track, position: prev.tracks.length + 1 },
            ],
        }));
        setSearchTerm("");
        setSearchResults([]);
    };

    const removeTrack = (index: number) => {
        setFormData((prev) => {
            const updated = prev.tracks.filter((_, i) => i !== index);
            return {
                ...prev,
                tracks: updated.map((t, i) => ({ ...t, position: i + 1 })),
            };
        });
    };

    // --- Drag and Drop Logic ---
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (dragOverIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === targetIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        const updatedTracks = [...formData.tracks];
        const [movedTrack] = updatedTracks.splice(draggedIndex, 1);
        updatedTracks.splice(targetIndex, 0, movedTrack);

        const reordered = updatedTracks.map((track, i) => ({
            ...track,
            position: i + 1,
        }));

        setFormData((prev) => ({ ...prev, tracks: reordered }));
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between border-l-4 border-red-600 pl-3">
                <h2 className="text-xl font-bold text-white">
                    Playlist Tracks ({formData.tracks.length})
                </h2>
                <span className="text-xs text-neutral-400">
                    💡 Drag tracks using the grip icon to reorder
                </span>
            </div>

            {/* Drag & Drop Reorder List */}
            <div className="space-y-3 min-h-[120px]">
                {formData.tracks.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-neutral-800 rounded-2xl text-neutral-500">
                        No tracks added yet. Search below to add tracks to your playlist.
                    </div>
                ) : (
                    formData.tracks.map((track, idx) => (
                        <div
                            key={track.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragOver={(e) => handleDragOver(e, idx)}
                            onDrop={(e) => handleDrop(e, idx)}
                            onDragEnd={handleDragEnd}
                            className={`flex items-center justify-between bg-black p-4 rounded-xl border transition-all ${draggedIndex === idx
                                ? "opacity-30 border-red-600/50 scale-[0.98]"
                                : dragOverIndex === idx
                                    ? "border-red-600 bg-neutral-900/80"
                                    : "border-neutral-800 hover:border-neutral-700"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="cursor-grab active:cursor-grabbing text-neutral-500 hover:text-white p-1">
                                    <BsGripVertical size={20} />
                                </div>

                                <span className="text-red-600 font-bold w-6 text-center">{idx + 1}</span>

                                <div>
                                    <p className="text-white font-medium">{track.title}</p>
                                    <p className="text-neutral-500 text-xs">
                                        {track.artist_name || "Unknown Artist"} {track.genre ? `• ${track.genre}` : ""}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => removeTrack(idx)}
                                className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Search & Add Track Section */}
            <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 space-y-4 shadow-inner">
                <p className="font-bold text-sm uppercase tracking-widest text-neutral-500">
                    Find & Add Tracks
                </p>

                <div className="relative">
                    <div className="flex items-center gap-2 bg-black rounded-xl px-4 py-3 border border-neutral-800">
                        <FiSearch className="text-neutral-500" />
                        <input
                            placeholder="Search by track title or artist..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent outline-none text-white text-sm w-full"
                        />
                    </div>

                    {/* Search Results Dropdown */}
                    {searchTerm.trim().length >= 2 && (
                        <div className="absolute z-50 w-full mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl max-h-56 overflow-y-auto p-2 space-y-1">
                            {isSearching ? (
                                <div className="p-3 text-neutral-500 text-sm flex items-center gap-2">
                                    <FiLoader className="animate-spin text-red-600" /> Searching tracks...
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="p-3 text-neutral-500 text-sm">No tracks found.</div>
                            ) : (
                                searchResults.map((track) => {
                                    const isAdded = formData.tracks.some((t) => t.id === track.id);
                                    return (
                                        <div
                                            key={track.id}
                                            onClick={() => !isAdded && addTrackToPlaylist(track)}
                                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${isAdded
                                                ? "opacity-50 cursor-not-allowed bg-neutral-950"
                                                : "hover:bg-neutral-800"
                                                }`}
                                        >
                                            <div>
                                                <p className="text-white text-sm font-medium">{track.title}</p>
                                                <p className="text-neutral-500 text-xs">
                                                    {track.artist_name || "Unknown Artist"}
                                                </p>
                                            </div>
                                            {isAdded ? (
                                                <span className="text-xs text-neutral-500 flex items-center gap-1">
                                                    <FiCheck className="text-red-500" /> Added
                                                </span>
                                            ) : (
                                                <span className="text-xs bg-red-600/10 text-red-500 px-2 py-1 rounded-md font-bold">
                                                    + Add
                                                </span>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    type="button"
                    onClick={prev}
                    className="px-6 py-3 text-neutral-400 hover:text-white flex items-center gap-2 font-bold"
                >
                    <FiArrowLeft /> Back
                </button>
                <button
                    type="button"
                    disabled={!formData.tracks.length}
                    onClick={next}
                    className="bg-red-600 hover:bg-red-500 disabled:opacity-30 px-10 py-3 rounded-xl text-white font-bold flex items-center gap-2"
                >
                    Review Playlist <FiArrowRight />
                </button>
            </div>
        </div>
    );
};

// --- Step 3: Review and Submit ---
const ReviewAndSubmitStep: React.FC<{
    formData: PlaylistForm;
    prevStep: () => void;
    resetForm: () => void;
}> = ({ formData, prevStep, resetForm }) => {
    const { token } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progress, setProgress] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleFinalSubmit = async () => {
        if (!token) return setError("Session expired. Please log in again.");
        setIsSubmitting(true);
        setError(null);

        try {
            setProgress("Creating playlist...");

            // Construct Multipart Form Data
            const payload = new FormData();
            payload.append("title", formData.title);
            payload.append("description", formData.description || "");
            payload.append("isPublic", String(formData.isPublic));

            if (formData.coverFile) {
                payload.append("coverFile", formData.coverFile);
            }

            // 1. Create Playlist API Call
            const createRes = await axios.post(`http://localhost:3001/playlist/new`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Extract playlist ID with fallback parsing
            const playlistId =
                createRes.data?.playlistId ||
                createRes.data?.id ||
                createRes.data?.data?.id;

            if (!playlistId) {
                throw new Error("Playlist created, but no valid Playlist ID was returned.");
            }

            // 2. Attach ordered track list API Call
            setProgress("Saving track ordering...");
            const trackPayload = formData.tracks.map((track, idx) => ({
                trackId: track.id,
                position: idx + 1,
            }));

            await axios.post(
                `http://localhost:3001/playlist/${playlistId}/tracks`,
                { tracks: trackPayload },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setProgress("Done!");
            setShowSuccess(true);
        } catch (err: any) {
            console.error("Playlist publish error:", err);
            const errorMessage =
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                "An error occurred while creating the playlist.";
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 overflow-hidden">
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => {
                    resetForm();
                    setShowSuccess(false);
                    window.location.href = "/playlists";
                }}
            />
            <h2 className="text-xl font-bold text-white border-l-4 border-red-600 pl-3">
                Review & Publish
            </h2>

            <div className="bg-black border border-neutral-800 rounded-2xl">
                <div className="flex flex-col md:flex-row gap-6 p-6">
                    {formData.coverFile ? (
                        <img
                            src={URL.createObjectURL(formData.coverFile)}
                            className="w-40 h-40 rounded-xl object-cover shadow-2xl"
                            alt="Playlist Cover"
                        />
                    ) : (
                        <div className="w-40 h-40 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600">
                            <FiMusic size={40} />
                        </div>
                    )}
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white">{formData.title}</h3>
                        <p className="text-red-500 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                            {formData.isPublic ? <FiGlobe /> : <FiLock />}
                            {formData.isPublic ? "Public Playlist" : "Private Playlist"}
                        </p>
                        {formData.description && (
                            <p className="text-neutral-400 text-sm">{formData.description}</p>
                        )}
                        <p className="text-neutral-500 text-sm">{formData.tracks.length} Tracks</p>
                    </div>
                </div>
            </div>

            {/* Final Track Order Summary */}
            <div className="space-y-2 bg-black p-4 rounded-xl border border-neutral-800 max-h-60 overflow-y-auto">
                <p className="text-xs uppercase font-bold text-neutral-500 mb-2">Track Order Summary</p>
                {formData.tracks.map((track, i) => (
                    <div key={track.id} className="flex items-center gap-3 text-sm py-1 border-b border-neutral-900 last:border-0">
                        <span className="text-red-600 font-bold w-4 text-center">{i + 1}</span>
                        <span className="text-white font-medium">{track.title}</span>
                        <span className="text-neutral-500 text-xs ml-auto">{track.artist_name}</span>
                    </div>
                ))}
            </div>

            {isSubmitting && (
                <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-xl flex items-center gap-4">
                    <FiLoader className="animate-spin text-red-600" />
                    <p className="text-sm text-white font-medium">{progress}</p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-500 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="flex justify-between pt-4">
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={prevStep}
                    className="px-6 py-3 text-neutral-400 hover:text-white flex items-center gap-2 font-bold disabled:opacity-50"
                >
                    <FiArrowLeft /> Back
                </button>
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinalSubmit}
                    className={`bg-red-600 hover:bg-red-500 disabled:opacity-50 px-12 py-4 rounded-xl text-white font-bold flex items-center gap-2 shadow-xl shadow-red-900/40 ${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                        }`}
                >
                    <FiUpload /> {isSubmitting ? "Creating..." : "Publish Playlist"}
                </button>
            </div>
        </div>
    );
};

// --- Main Playlist Creator Component ---
export default function PlaylistCreator() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<PlaylistForm>({
        title: "",
        description: "",
        isPublic: true,
        coverFile: null,
        tracks: [],
    });

    const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 3));
    const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));
    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            isPublic: true,
            coverFile: null,
            tracks: [],
        });
        setCurrentStep(1);
    };

    return (
        <ArtistLayout>
            <div className="mx-auto p-4 max-w-4xl">
                <div className="mb-10 text-center">
                    <h1 className="text-xl md:text-4xl font-black text-white mb-2 tracking-tight">
                        CREATE <span className="text-red-600">PLAYLIST</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 w-12 rounded-full transition-all duration-500 ${currentStep >= s ? "bg-red-600" : "bg-neutral-800"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="w-full bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
                    {currentStep === 1 && (
                        <PlaylistMetadataStep
                            formData={formData}
                            setFormData={setFormData}
                            next={nextStep}
                        />
                    )}

                    {currentStep === 2 && (
                        <PlaylistTracksStep
                            formData={formData}
                            setFormData={setFormData}
                            prev={prevStep}
                            next={nextStep}
                        />
                    )}

                    {currentStep === 3 && (
                        <ReviewAndSubmitStep
                            formData={formData}
                            prevStep={prevStep}
                            resetForm={resetForm}
                        />
                    )}
                </div>
            </div>
        </ArtistLayout>
    );
}