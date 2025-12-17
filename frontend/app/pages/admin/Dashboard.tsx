import { useEffect, useState } from "react";
import { getPendingReleases } from "../../api/releases";
import { Link } from "react-router";
import AdminLayout from "~/components/layouts/AdminLayout";

type Release = {
    id: number;
    title: string;
    genre: string;
    cover_url?: string;
    artist_name?: string;
    status: string;
};

export default function AdminDashboard() {
    const [releases, setReleases] = useState<Release[]>([]);

    useEffect(() => {
        getPendingReleases().then(setReleases);
    }, []);

    return (
        <>
            <AdminLayout >
                <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">
                            🎧 Admin Review Queue
                        </h1>
                        <p className="text-neutral-400 mt-1">
                            Releases waiting for approval
                        </p>
                    </div>

                    {/* Empty state */}
                    {releases.length === 0 && (
                        <div className="flex items-center justify-center h-64 text-neutral-500">
                            No releases pending review 🎉
                        </div>
                    )}

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {releases.map((r) => (
                            <div
                                key={r.id}
                                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition"
                            >
                                {/* Cover */}
                                <div className="h-40 bg-neutral-800 flex items-center justify-center">
                                    {r.cover_url ? (
                                        <img
                                            src={r.cover_url}
                                            alt={r.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-neutral-600 text-sm">
                                            No Cover Art
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-2">
                                    <h2 className="text-lg font-semibold truncate">
                                        {r.title}
                                    </h2>

                                    <div className="text-sm text-neutral-400">
                                        {r.artist_name ?? "Unknown Artist"} • {r.genre}
                                    </div>

                                    {/* Status */}
                                    <span className="inline-block text-xs px-2 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-600/30">
                                        {r.status}
                                    </span>

                                    {/* Action */}
                                    <Link
                                        to={`/admin/review/${r.id}`}
                                        className="block mt-4 text-center rounded-xl bg-blue-600 hover:bg-blue-700 transition px-4 py-2 font-medium"
                                    >
                                        Review Release →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AdminLayout>
        </>
    );
}
