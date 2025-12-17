import React, { useEffect, useState } from "react";
import { FiUpload, FiMusic, FiImage, FiCalendar, FiTag, FiUser, FiArrowRight, FiArrowLeft, FiTrash2, FiLoader, FiCheck, FiSearch } from "react-icons/fi";
import ArtistLayout from "~/components/layouts/ArtistLayout";
import { z } from "zod";
import axios from "axios";
import { useReleaseStore } from "~/stores/useReleaseStore";
import { ReleaseSchema, TrackSchema } from "~/validators/release.schema";
import { useAuth } from "~/context/AuthContext";

// --- API Helpers ---

const API_BASE_URL = "http://localhost:3001/artist";

/**
 * Custom Input Component
 */
const Input = ({ icon, placeholder, value, onChange, type = "text", error }: any) => (
    <div className="flex flex-col">
        <div className={`flex items-center gap-2 bg-black rounded-xl px-4 py-3 border ${error ? 'border-red-600' : 'border-neutral-800 focus-within:border-red-600'}`}>
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

// --- Step 1: Release Metadata ---
const ReleaseMetadataStep: React.FC<{ next: () => void }> = ({ next }) => {
    const { release, setReleaseMetadata } = useReleaseStore();
    const [errors, setErrors] = useState<z.ZodIssue[]>([]);

    const validateAndNext = () => {
        try {
            // Validate only metadata fields
            const metadataSchema = ReleaseSchema.omit({ tracks: true });
            metadataSchema.parse(release);
            setErrors([]);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) setErrors(error.issues);
        }
    };

    const getError = (path: string) => errors.find(e => e.path[0] === path)?.message;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold text-white border-l-4 border-red-600 pl-3">Release Details</h2>

            <div className="flex gap-4 p-1 bg-black rounded-xl w-fit">
                {["single", "ep", "album"].map((type) => (
                    <button
                        key={type}
                        onClick={() => setReleaseMetadata({ releaseType: type as any })}
                        className={`px-6 py-2 rounded-lg text-sm capitalize transition-all ${release.releaseType === type ? 'bg-red-600 text-white' : 'text-neutral-500 hover:text-white'}`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input icon={<FiMusic />} placeholder="Release Title *" value={release.title || ""} onChange={(v: string) => setReleaseMetadata({ title: v })} error={getError('title')} />
                <Input icon={<FiCalendar />} type="date" placeholder="Release Date *" value={release.releaseDate || ""} onChange={(v: string) => setReleaseMetadata({ releaseDate: v })} error={getError('releaseDate')} />
            </div>

            <label className={`relative cursor-pointer group block border-2 border-dashed rounded-2xl p-8 transition-all ${getError('coverFile') ? 'border-red-600 bg-red-900/10' : 'border-neutral-800 hover:border-red-600 bg-black'}`}>
                {release.coverFile ? (
                    <div className="relative h-48 w-48 mx-auto">
                        <img src={URL.createObjectURL(release.coverFile)} className="rounded-xl object-cover w-full h-full shadow-2xl" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                            <p className="text-white text-xs font-bold">Change Cover</p>
                        </div>
                    </div>
                ) : (
                    <UploadPlaceholder icon={<FiImage />} label="Upload Cover Art *" sub="3000 x 3000px recommended (PNG/JPG)" />
                )}
                <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && setReleaseMetadata({ coverFile: e.target.files[0] })} />
            </label>
            {getError('coverFile') && <p className="text-xs text-red-500 text-center">{getError('coverFile')}</p>}

            <div className="flex justify-end pt-4">
                <button onClick={validateAndNext} className="bg-red-600 hover:bg-red-500 px-8 py-3 rounded-xl text-white font-bold flex items-center gap-2 shadow-lg shadow-red-900/20">
                    Add Tracks <FiArrowRight />
                </button>
            </div>
        </div>
    );
};

// --- Step 2: Track Details ---
const TrackDetailsStep: React.FC<{ prev: () => void, next: () => void }> = ({ prev, next }) => {
    const { release, addTrack, removeTrack } = useReleaseStore();
    const [newTrack, setNewTrack] = useState<any>({ title: "", genre: "", featuring: "", contributorIds: [] });
    const [errors, setErrors] = useState<z.ZodIssue[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const { token, user } = useAuth();
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchTerm.length < 2) return setSearchResults([]);
            setIsSearching(true);
            try {
                // Replace with your actual search endpoint
                const res = await axios.get(`${API_BASE_URL}/search-artists?query=${searchTerm}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSearchResults(res.data);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setIsSearching(false);
            }
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleAddTrack = () => {
        try {
            const trackData = {
                ...newTrack,
                trackNumber: (release.tracks?.length || 0) + 1,
                duration: 180 // Dummy duration
            };
            const validated = TrackSchema.parse(trackData);
            addTrack(validated);
            setNewTrack({ title: "", genre: "", featuring: "" });
            setErrors([]);
        } catch (error) {
            if (error instanceof z.ZodError) setErrors(error.issues);
        }
    };

    const toggleContributor = (artist: any) => {
        const exists = newTrack.contributorIds?.find((c: any) => c.id === artist.id);
        if (exists) {
            setNewTrack({ ...newTrack, contributorIds: newTrack.contributorIds.filter((c: any) => c.id !== artist.id) });
        } else {
            setNewTrack({ ...newTrack, contributorIds: [...newTrack.contributorIds, { id: artist.id, username: artist.username }] });
        }
        setSearchTerm("");
    };
    const getError = (path: string) => errors.find(e => e.path[0] === path)?.message;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold text-white border-l-4 border-red-600 pl-3">Tracks ({release.tracks?.length || 0})</h2>

            <div className="space-y-3">
                {release.tracks?.map((track, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-black p-4 rounded-xl border border-neutral-800">
                        <div className="flex items-center gap-4">
                            <span className="text-red-600 font-bold">{idx + 1}</span>
                            <div>
                                <p className="text-white font-medium">{track.title}</p>
                                <p className="text-neutral-500 text-xs">{track.genre}</p>
                            </div>
                        </div>
                        <button onClick={() => removeTrack(idx)} className="p-2 text-neutral-500 hover:text-red-500 transition-colors">
                            <FiTrash2 />
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 space-y-4 shadow-inner">
                <p className="font-bold text-sm uppercase tracking-widest text-neutral-500">New Track</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input icon={<FiMusic />} placeholder="Track Title *" value={newTrack.title} onChange={(v: string) => setNewTrack({ ...newTrack, title: v })} error={getError('title')} />
                    <Input icon={<FiTag />} placeholder="Genre *" value={newTrack.genre} onChange={(v: string) => setNewTrack({ ...newTrack, genre: v })} error={getError('genre')} />
                </div>

                {/* Contributor Search */}
                <div className="relative">
                    <div className="flex items-center gap-2 bg-black rounded-xl px-4 py-3 border border-neutral-800">
                        <FiSearch className="text-neutral-500" />
                        <input
                            placeholder="Search featuring artists..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent outline-none text-white text-sm w-full"
                        />
                    </div>

                    {/* Search Results Dropdown */}
                    {searchTerm.length >= 2 && (
                        <div className="absolute z-50 w-full mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl max-h-48 overflow-y-auto p-2">
                            {isSearching ? <div className="p-2 text-neutral-500 text-sm">Searching...</div> :
                                searchResults?.map(artist => (
                                    <div
                                        key={artist.id}
                                        onClick={() => toggleContributor(artist)}
                                        className="flex items-center justify-between p-3 hover:bg-neutral-800 rounded-lg cursor-pointer"
                                    >
                                        <span className="text-white text-sm">{artist.username}</span>
                                        {newTrack.contributorIds?.find((c: any) => c.id === artist.id) && <FiCheck className="text-red-500" />}
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </div>

                {/* Selected Contributors Tags */}
                <div className="flex flex-wrap gap-2">
                    {newTrack.contributorIds?.map((c: any) => (
                        <span key={c.id} className="bg-red-600/10 text-red-500 border border-red-600/20 px-3 py-1 rounded-full text-xs font-bold">
                            @{c.username}
                        </span>
                    ))}
                </div>

                <label className={`cursor-pointer block border-2 border-dashed rounded-xl p-6 transition-all ${getError('audioFile') ? 'border-red-600 bg-red-900/5' : 'border-neutral-800 hover:border-neutral-700 bg-black'}`}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-neutral-900 rounded-lg text-red-500"><FiMusic /></div>
                        <div>
                            <p className="text-white text-sm font-medium">{newTrack.audioFile ? newTrack.audioFile.name : "Select Audio File *"}</p>
                            <p className="text-neutral-500 text-xs">WAV, FLAC or MP3</p>
                        </div>
                    </div>
                    <input type="file" accept="audio/*" hidden onChange={(e) => e.target.files?.[0] && setNewTrack({ ...newTrack, audioFile: e.target.files[0] })} />
                </label>
                {getError('audioFile') && <p className="text-xs text-red-500">{getError('audioFile')}</p>}

                <button onClick={handleAddTrack} className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-bold transition-all">
                    + Add Track to List
                </button>
            </div>

            <div className="flex justify-between pt-4">
                <button onClick={prev} className="px-6 py-3 text-neutral-400 hover:text-white flex items-center gap-2 font-bold"><FiArrowLeft /> Back</button>
                <button disabled={!release.tracks?.length} onClick={next} className="bg-red-600 hover:bg-red-500 disabled:opacity-30 px-10 py-3 rounded-xl text-white font-bold flex items-center gap-2">Review Release <FiArrowRight /></button>
            </div>
        </div>
    );
};

// --- Step 3: Review and Submit ---
const ReviewAndSubmitStep: React.FC = () => {
    const { release, prevStep, resetStore } = useReleaseStore();
    const { token, user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progress, setProgress] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleFinalSubmit = async () => {
        if (!token) return setError("Session expired. Please login again.");
        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Create Release Container
            setProgress("Uploading ...");
            const releaseData = new FormData();

            console.log("Your Release", release);

            // FIX: Add fallbacks to ensure values aren't undefined
            // releaseData.append("user", user!.id);
            releaseData.append("title", release.title || "Untitled Release");
            releaseData.append("releaseType", release.releaseType || "single");
            releaseData.append("releaseDate", release.releaseDate || new Date().toISOString());

            if (release.coverFile) {
                releaseData.append("coverFile", release.coverFile);
            }

            const relRes = await axios.post(`${API_BASE_URL}/releases`, releaseData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
            });

            console.log("response ", relRes.data)

            const releaseId = relRes.data.releaseId;

            // 2. Upload Tracks Sequentially
            for (let i = 0; i < (release.tracks?.length || 0); i++) {
                const track = release.tracks![i];
                setProgress(`Uploading track ${i + 1} of ${release.tracks?.length}: ${track.title}...`);

                const trackData = new FormData();
                // FIX: Add fallbacks for track fields
                trackData.append("title", track.title || "Untitled Track");
                trackData.append("genre", track.genre || "Unknown");
                trackData.append("trackNumber", (i + 1).toString());
                trackData.append("duration", "180");

                if (track.audioFile) {
                    trackData.append("audioFile", track.audioFile);
                }

                await axios.post(`${API_BASE_URL}/releases/${releaseId}/tracks`, trackData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            setProgress("Done!");
            alert("Congratulations! Your release is live.");
            resetStore();
            window.location.href = "/artists";
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || "An error occurred during upload.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold text-white border-l-4 border-red-600 pl-3">Review & Publish</h2>

            <div className="bg-black border border-neutral-800 rounded-2xl overflow-hidden">
                <div className="flex flex-col md:flex-row gap-6 p-6">
                    {release.coverFile && <img src={URL.createObjectURL(release.coverFile)} className="w-40 h-40 rounded-xl object-cover shadow-2xl" />}
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white">{release.title}</h3>
                        <p className="text-red-500 font-bold uppercase text-xs tracking-widest">{release.releaseType}</p>
                        <p className="text-neutral-500 text-sm">Release Date: {release.releaseDate}</p>
                        <p className="text-neutral-500 text-sm">{release.tracks?.length} Tracks</p>
                    </div>
                </div>
            </div>

            {isSubmitting && (
                <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-xl flex items-center gap-4">
                    <FiLoader className="animate-spin text-red-600" />
                    <p className="text-sm text-white font-medium">{progress}</p>
                </div>
            )}

            {error && <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-500 rounded-xl text-sm font-medium">{error}</div>}

            <div className="flex justify-between pt-4">
                <button disabled={isSubmitting} onClick={prevStep} className="px-6 py-3 text-neutral-400 hover:text-white flex items-center gap-2 font-bold"><FiArrowLeft /> Back</button>
                <button disabled={isSubmitting} onClick={handleFinalSubmit} className="bg-red-600 hover:bg-red-500 disabled:opacity-50 px-12 py-4 rounded-xl text-white font-bold flex items-center gap-2 shadow-xl shadow-red-900/40">
                    <FiUpload /> {isSubmitting ? "Uploading..." : "Publish Release"}
                </button>
            </div>
        </div>
    );
};

// --- Main Layout ---
export default function UploadSection() {
    const { currentStep, nextStep, prevStep } = useReleaseStore();

    return (
        <ArtistLayout>
            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">CREATE <span className="text-red-600">RELEASE</span></h1>
                    <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${currentStep >= s ? 'bg-red-600' : 'bg-neutral-800'}`} />
                        ))}
                    </div>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
                    {currentStep === 1 && <ReleaseMetadataStep next={nextStep} />}
                    {currentStep === 2 && <TrackDetailsStep prev={prevStep} next={nextStep} />}
                    {currentStep === 3 && <ReviewAndSubmitStep />}
                </div>
            </div>
        </ArtistLayout>
    );
}