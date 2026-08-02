// src/routes/releases.route.ts

import { FastifyInstance } from "fastify";
import { ReleaseController } from "../controllers/releases.controller"; // Import the object containing the new controller functions
import { searchArtists } from "../controllers/artist.controller";
import { authenticate, optionalAuthenticate } from "../hooks/auth.hooks";

export default async function releasesRoutes(fastify: FastifyInstance) {
  // 1. Endpoint for Step 1: Create Release Container (Metadata + Cover Art)
  // Route: POST /artist/releases
  fastify.post(
    "/releases",
    { preHandler: authenticate },
    ReleaseController.createRelease,
  );

  // 2. Endpoint for Step 2: Add Track to an existing Release
  // Route: POST /artist/releases/:releaseId/tracks
  // Note: We need a dynamic parameter for releaseId
  fastify.post(
    "/releases/:releaseId/tracks",
    { preHandler: authenticate },
    ReleaseController.addTrackToRelease,
  );

  // 3. Existing route for fetching  all releases
  fastify.get(
    "/releases",
    { preHandler: optionalAuthenticate },
    ReleaseController.getReleases,
  );

  fastify.get(
    "/search-artists",
    { preHandler: optionalAuthenticate },
    searchArtists,
  );

  fastify.get(
    "/category/:category",
    { preHandler: optionalAuthenticate },
    ReleaseController.getByReleaseCategory,
  );

  // Updated route for the Artist Dashboard/Library
  fastify.get("/library/:releaseType", ReleaseController.getMyLibrary);

  // Get release by ReleaseID
  fastify.get("/releases/:id", ReleaseController.getReleaseById);
}
