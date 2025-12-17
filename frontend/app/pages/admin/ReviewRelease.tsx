import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Modal from "../../components/shared/Modal";
import WaveformPlayer from "../../components/shared/WaveFormPlayer";
import { approveRelease, rejectRelease } from "../../api/releases";
import client from "../../api/client";
import { formatDuration } from "../../utils/formatDuration";

export default function ReviewRelease() {
    const { id } = useParams();
    const navigate = useNavigate();
    const releaseId = Number(id);

    const [release, setRelease] = useState<any>(null);
    const [tracks, setTracks] = useState<any[]>([]);
    const [approveOpen, setApproveOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [reason, setReason] = useState("");

    useEffect(() => {
        client.get(`/admin/releases/${releaseId}`).then((res) => {
            setRelease(res.data.release);
            setTracks(res.data.tracks);
        });
    }, []);

    if (!release) return null;

    return (
        <>
            <div className="max-w-5xl mx-auto pb-32">
                <h1 className="text-3xl font-bold">{release.title}</h1>
                <p className="text-neutral-400 mb-6">
                    {release.artist_name} • {release.genre}
                </p>

                <div className="space-y-4">
                    {tracks.map((t, i) => (
                        <div
                            key={t.id}
                            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
                        >
                            <div className="flex justify-between mb-2">
                                <span className="font-medium">
                                    {i + 1}. {t.title}
                                </span>
                                <span className="text-neutral-500 text-sm">
                                    {formatDuration(t.duration)}
                                </span>
                            </div>

                            <WaveformPlayer url={t.audio_url} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Sticky Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800">
                <div className="max-w-5xl mx-auto p-4 flex justify-end gap-3">
                    <button
                        onClick={() => setRejectOpen(true)}
                        className="px-6 py-2 border border-red-600 text-red-400 rounded-xl"
                    >
                        Reject
                    </button>
                    <button
                        onClick={() => setApproveOpen(true)}
                        className="px-6 py-2 bg-green-600 rounded-xl"
                    >
                        Approve
                    </button>
                </div>
            </div>

            {/* Approve Modal */}
            <Modal open={approveOpen} onClose={() => setApproveOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Approve Release?</h2>
                <button
                    onClick={async () => {
                        await approveRelease(releaseId);
                        navigate("/admin");
                    }}
                    className="bg-green-600 w-full py-2 rounded-xl"
                >
                    Confirm Approval
                </button>
            </Modal>

            {/* Reject Modal */}
            <Modal open={rejectOpen} onClose={() => setRejectOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Reject Release</h2>

                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for rejection..."
                    className="w-full bg-neutral-800 p-3 rounded mb-4"
                />

                <button
                    onClick={async () => {
                        await rejectRelease(releaseId);
                        navigate("/admin");
                    }}
                    className="bg-red-600 w-full py-2 rounded-xl"
                >
                    Reject & Send Feedback
                </button>
            </Modal>
        </>
    );
}
