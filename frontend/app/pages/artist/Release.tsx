import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ArtistLayout from "~/components/layouts/ArtistLayout";
import ReleaseView from "~/components/templates/ReleaseView";
import { useAuth } from "~/context/AuthContext";

type Release = {
    id: number;
    title: string;
    genre: string;
    cover_url?: string;
    status: string;
    created_at: string;
};


export default function ArtistDashboard() {

    return (
        <ArtistLayout>
            <ReleaseView />
        </ArtistLayout>
    );
}
