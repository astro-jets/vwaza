import axios from "axios";
import { useEffect, useState } from "react";
import { BsPlay } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { IoPencilOutline, IoTrashBin } from "react-icons/io5";
import { useParams } from "react-router";
import ArtistLayout from "~/components/layouts/ArtistLayout";
import { useAuth } from "~/context/AuthContext";

type Release = {
    release_id: number;
    id: number;
    title: string;
    genre: string;
    cover_url?: string;
    status: string;
    created_at: string;
    track_number: string;
    release_title: string;
};


export default function ReleaseView() {
    const params = useParams()
    const releaseID = params.id;
    if (!releaseID) { return }
    const [release, setRelease] = useState<Release[]>([]);
    const { token } = useAuth();

    useEffect(() => {
        fetchReleases();
    }, []);


    const fetchReleases = async () => {
        try {
            const res = await axios.get<Release[]>(`http://localhost:3001/artist/releases/${releaseID}`, { headers: { Authorization: `Bearer ${token}` } });
            setRelease(res.data);

        } catch (err) {
            console.error(err);
        }
    };

    const release_title = release[0]?.release_title || '';
    const word = release_title.split(' ')
    console.log("Your release ===> ", release[0])

    return (
        <div className="flex flex-col p-4">
            <h1 className="text-xl md:text-4xl font-black text-white mb-2 tracking-tight w-full text-center">
                {
                    word.map((w, idx) => {
                        if (idx + 1 < word.length) { return (w + ' ') }
                        else {
                            return (<span className="text-red-600">{w}</span>)
                        }
                    })

                }
            </h1>
            <div className="flex flex-col space-y-3 w-md">
                {release?.map((rls, idx) => {
                    return (
                        <div key={idx} className="bg-neutral-900/50 border border-neutral-700 p-6 rounded-2xl shadow-lg">
                            <div className="flex justify-between items-start">

                                <div className="flex space-x-2 items-center">

                                    <p className="text-white">{rls.track_number + '.'}</p>
                                    <p className="text-neutral-400 text-sm font-medium uppercase tracking-wider">{rls.title}</p>
                                </div>
                                <div className="space-x-4 flex items-center">
                                    <div className="bg-neutral-900/80 border border-neutral-700 cursor-pointer backdrop-blur-2xl rounded-xl p-2"><BsPlay size={20} /></div>
                                    <div className="bg-neutral-900/80 border border-neutral-700 cursor-pointer backdrop-blur-2xl rounded-xl p-2"><IoPencilOutline size={20} /></div>
                                    <div className="bg-neutral-900/80 border border-neutral-700 cursor-pointer backdrop-blur-2xl rounded-xl p-2"><FaTrash size={20} /></div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>

    );
}
