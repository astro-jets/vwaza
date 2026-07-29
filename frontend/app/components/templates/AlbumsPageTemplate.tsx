import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "~/context/AuthContext";

interface Release {
    id: string;
    title: string;
    artist_name: string;
    cover_url: string;
}

export default function AlbumsPageTemplate() {
    const [releases, setReleases] = useState<Release[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1); // Use -1 for no selection initially
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredReleases, setFilteredReleases] = useState(releases);
    const { token } = useAuth();

    useEffect(() => {

        const fetchReleases = async () => {
            try {
                const res = await axios.get<Release[]>("http://localhost:3001/artist/category/album",
                    { headers: { Authorization: `Bearer ${token}` } });
                setReleases(res.data);
                setFilteredReleases(res.data);
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

    return (

        <div className="min-h-screen px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">Albums</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {filteredReleases.map((al, index) => (
                    <Link to={`/album/${al.id}`} key={index} className="rounded-lg bg-white dark:bg-[#101010] shadow hover:shadow-lg transition">
                        <div className="w-full h-44 overflow-hidden rounded-t-lg">
                            <img src={`/uploads/images/${al.cover_url}`} alt={al.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                            <div className="font-semibold">{al.title}</div>
                            <div className="text-xs text-gray-500">{al.artist_name}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
