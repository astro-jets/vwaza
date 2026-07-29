import Search from "../forrms/SearchForm";
import Slider from "../sliders/topSlider";
import TrendingSlider from "../sliders/trending/Trending";
import TopTenCharts from "../MusicCharts/TopTen";
import { useEffect, useState } from "react";
import { useAuth } from "~/context/AuthContext";
import axios from "axios";
import EventsSlider from "../sliders/events/Events";
// import PodcastSlider from "../sliders/podcasts/Podcasts";
import DiscoverSlider from "../sliders/discover";
import HomePageAlbums from "./HomePageAlbums";
import NewReleasesTemlpate from "./NewReleases";
import MadeForYouTemplate from "./MadeForYou";
import PopulartArtistsTemplate from "./PopularArists";


interface ReleaseSummary {
    id: number;
    title: string;
    featuring?: string;
    genre: string;
    cover_url: string;
    audio_url: string;
    track_number: number;
    release_title: string;
    release_date: string;
    release_type: 'single' | 'album' | 'ep';
    status: boolean;
    artist_name: string;
    plays?: number; // Added mock field for design
}
const LandingTemplate = () => {
    const [releases, setReleases] = useState<ReleaseSummary[]>([]);
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchReleases = async () => {
            try {
                const res = await axios.get("http://localhost:3001/artist/releases", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Adding mock play counts if backend doesn't provide them yet
                const dataWithMockStats = res.data.map((r: any) => ({
                    ...r,
                    plays: Math.floor(Math.random() * 50000) + 1200
                }));
                setReleases(dataWithMockStats);
                setLoading(false)
            } catch (err) {
                console.error(err);
            }
        };
        fetchReleases();
    }, [token]);

    return (
        <div className="flex justify-around h-full w-full overflow-hidden md:py-10 pb-20">
            <Search />
            <div className="flex flex-col items-center space-y-4 md:space-y-10 w-full h-full  md:w-3/4 ">
                <Slider />
                <div className="flex flex-col space-y-6 h-full w-full">
                    <DiscoverSlider />
                    <TrendingSlider />
                    <TopTenCharts title={"Playlist here"} tracks={releases} />
                    <EventsSlider />
                    <NewReleasesTemlpate />
                    <MadeForYouTemplate />
                    <PopulartArtistsTemplate />
                    <HomePageAlbums />
                    {/* <PodcastSlider /> */}
                </div>
            </div>
        </div>
    );
}
export default LandingTemplate;