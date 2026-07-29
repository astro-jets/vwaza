import { useState, useEffect, useRef } from 'react';
import { BsSearch } from 'react-icons/bs';
import axios from 'axios';

interface SuggestionItem {
    id: string;
    title: string;
    subtitle?: string;
    type: 'artist' | 'track' | 'release';
    cover_url?: string;
}

interface SuggestionResults {
    artists: SuggestionItem[];
    tracks: SuggestionItem[];
    releases: SuggestionItem[];
}

const API_BASE_URL = 'http://localhost:3001';


const Search = () => {
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState<SuggestionResults>({ artists: [], tracks: [], releases: [] });
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const controller = new AbortController();

        const timer = setTimeout(async () => {
            if (search.trim().length >= 2) {
                setIsLoading(true);
                try {
                    const response = await axios.get<SuggestionResults>(`${API_BASE_URL}/search/suggestions`, {
                        params: { q: search.trim() },
                        signal: controller.signal,
                    });
                    // console.log("Suggestions fetched:", response.data);
                    setSuggestions(response.data);
                    setIsOpen(true);
                } catch (err: any) {
                    // Ignore canceled request errors caused by rapid typing
                    if (axios.isCancel(err) || err.name === 'CanceledError') {
                        return;
                    }
                    console.error("Error fetching suggestions:", err.response?.data || err.message);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSuggestions({ artists: [], tracks: [], releases: [] });
                setIsOpen(false);
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [search]);

    useEffect(() => {
        console.log("Suggestions state:", suggestions);
    }, [suggestions]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const searchSong = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim() !== '') {
            setIsOpen(false);
            setSearch("");
        }
    };

    const handleSelectSuggestion = (item: SuggestionItem) => {
        setIsOpen(false);
        setSearch("");
    };

    const hasSuggestions =
        suggestions.artists.length > 0 ||
        suggestions.tracks.length > 0 ||
        suggestions.releases.length > 0;

    return (
        <div ref={wrapperRef} className="search-bar relative">
            <form onSubmit={searchSong}>
                <input
                    type="text"
                    placeholder="search"
                    name="search_item"
                    className="search w-full font-thin bg-transparent outline-none text-white px-3 py-3 placeholder:text-gray-200"
                    id="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => search.trim().length >= 2 && setIsOpen(true)}
                    autoComplete="off"
                />

                <button type="submit" className="btn off" onClick={searchSong}>
                    <BsSearch color='black' size={20} />
                </button>
            </form>

            {isOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-black/90 backdrop-blur-md border border-gray-800 rounded-md shadow-xl z-50 max-h-80 overflow-y-auto text-white">
                    {isLoading && (
                        <div className="p-3 text-xs text-gray-400">Searching...</div>
                    )}

                    {!isLoading && !hasSuggestions && (
                        <div className="p-3 text-xs text-gray-400">No results found</div>
                    )}

                    {suggestions.artists.length > 0 && (
                        <div className="py-1 border-b border-gray-800">
                            <span className="px-3 py-1 text-[10px] uppercase font-bold text-gray-400 block">Artists</span>
                            {suggestions.artists.map((artist) => (
                                <div
                                    key={artist.id}
                                    onClick={() => handleSelectSuggestion(artist)}
                                    className="px-3 py-2 hover:bg-gray-800/80 cursor-pointer text-sm flex items-center justify-between"
                                >
                                    <span className="font-medium">{artist.title}</span>
                                    <span className="text-[10px] text-gray-400 uppercase">Artist</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {suggestions.tracks.length > 0 && (
                        <div className="py-1 border-b border-gray-800">
                            <span className="px-3 py-1 text-[10px] uppercase font-bold text-gray-400 block">Tracks</span>
                            {suggestions.tracks.map((track) => (
                                <div
                                    key={track.id}
                                    onClick={() => handleSelectSuggestion(track)}
                                    className="px-3 py-2 hover:bg-gray-800/80 cursor-pointer text-sm flex items-center justify-between"
                                >
                                    <div>
                                        <div className="font-medium">{track.title}</div>
                                        {track.subtitle && <div className="text-xs text-gray-400">{track.subtitle}</div>}
                                    </div>
                                    <span className="text-[10px] text-gray-400 uppercase">Track</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {suggestions.releases.length > 0 && (
                        <div className="py-1">
                            <span className="px-3 py-1 text-[10px] uppercase font-bold text-gray-400 block">Releases</span>
                            {suggestions.releases.map((release) => (
                                <div
                                    key={release.id}
                                    onClick={() => handleSelectSuggestion(release)}
                                    className="px-3 py-2 hover:bg-gray-800/80 cursor-pointer text-sm flex items-center justify-between"
                                >
                                    <div>
                                        <div className="font-medium">{release.title}</div>
                                        {release.subtitle && <div className="text-xs text-gray-400">{release.subtitle}</div>}
                                    </div>
                                    <span className="text-[10px] text-gray-400 uppercase">Release</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;