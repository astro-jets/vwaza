import { useEffect, useState } from "react";
import { Link } from "react-router";
// import { getArtistReleases } from "../../api/releases";
import { usePolling } from "../../hooks/usePolling";
import ReleasesTable from "~/components/tables/ReleasesTable";
import ArtistLayout from "~/components/layouts/ArtistLayout";

type Release = {
    id: number;
    title: string;
    genre: string;
    cover_url?: string;
    status: string;
    created_at: string;
};

const statusStyles: Record<string, string> = {
    DRAFT: "bg-neutral-700 text-neutral-300",
    PROCESSING: "bg-yellow-600/20 text-yellow-400 border border-yellow-600/30",
    PENDING_REVIEW: "bg-red-600/20 text-red-400 border border-red-600/30",
    PUBLISHED: "bg-green-600/20 text-green-400 border border-green-600/30",
    REJECTED: "bg-red-600/20 text-red-400 border border-red-600/30",
};

export default function ArtistDashboard() {
    const [releases, setReleases] = useState<Release[]>([]);

    const load = async () => {
        const data: any = []// await getArtistReleases();
        setReleases(data);
    };

    useEffect(() => {
        load();
    }, []);

    usePolling(load, 4000); // live status updates

    return (
        <ArtistLayout>
            <ReleasesTable />
        </ArtistLayout>
    );
}
