import { BsPause, BsPlay } from 'react-icons/bs'
import { useAudioStore } from 'stores/MusicStore';
import type { Track } from 'types/Track';

interface Charts {
    [key: string]: Track[]; // Optional, allows additional chart categories dynamically
}[]


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
const TopTenCharts = ({ tracks, title }: { title: string, tracks: ReleaseSummary[] }) => {
    const { audio, setAudio, playing, setQueue, setPlaying } = useAudioStore()
    // const [tracks, setTracks] = useState<any[]>([])
    // useEffect(() => {
    //     const fetchTracks = async () => {
    //         try {
    //             const res = await fetchTracks();
    //             setTracks(res);
    //         }
    //         catch { }
    //     }
    //     fetchTracks();
    // }, [])

    return (
        <div className="px-4 w-full h-full space-y-4">
            <div className="flex w-full items-center space-x-2">
                {/* <FaTheaterMasks size={20} color="white" /> */}
                <h2 className="text-xl capitalize caption-bottom font-thin tracking-tight  text-black dark:text-white">Studio <span className="text-red-500">X</span> {title}</h2>
            </div>
            <div className="space-y-4">
                {
                    tracks?.length ?
                        tracks.map((track, index) => (
                            <div
                                key={index}
                                className={`flex items-center  p-1 rounded-lg lg:hover:bg-[#ff2424b6] duration-[900000]
                                ${audio.title == track.title ? 'bg-[#b80000ee]' : 'bg-white/30 dark:bg-[#111111b4]'}
                                ${audio.title == track.title && playing ? 'playing' : ''}
                                `}
                                onClick={() => {

                                    if (audio.title == track.title) {
                                        setPlaying(!playing);
                                    } else {
                                        // setAudio(track);
                                        setQueue([]);
                                        setPlaying(true)
                                    }
                                }}
                            >
                                {/* Album Art */}
                                <div className="w-16 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                        src={`/uploads/images/${track.cover_url}`}
                                        alt="Album Art"
                                        className="object-cover w-full h-full"
                                    />
                                </div>

                                {/* Song Info */}
                                <div className="ml-4 flex-1">
                                    <h3 className="font-thin text-black dark:text-white">{track.title}</h3>
                                    <p className="text-gray-700 text-sm">{track.artist_name}</p>
                                </div>

                                {/* Play/Pause */}
                                <div className={`mx-3 ${audio.title == track.title ? 'inline' : 'hidden'}`}>
                                    {
                                        playing ? <BsPause color='#fff' size={20} /> : <BsPlay color='#fff' size={20} />
                                    }

                                </div>

                                {/* Duration */}
                                <p className="text-gray-400 text-sm">3:45</p>
                            </div>
                        ))
                        :
                        Array.from({ length: 4 }).map((_, index) => (
                            <div key={index}
                                className={`flex items-center  p-1 rounded-lg bg-slate-900`}>
                                {/* Album Art */}
                                <div className="w-16 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700 animate-pulse">
                                </div>

                                {/* Song Info */}
                                <div className="ml-4 flex-1 space-y-3">
                                    <h3 className="font-thin bg-slate-700 h-3 animate-pulse"></h3>
                                    <p className="bg-slate-700 animate-pulse h-3"></p>
                                </div>
                            </div>
                        ))
                }
            </div>
        </div>
    );
}

export default TopTenCharts;