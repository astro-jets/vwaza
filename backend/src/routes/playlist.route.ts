import { FastifyInstance } from "fastify";
import { PlaylistController } from "../controllers/playlist.controller";
import { authenticate, optionalAuthenticate } from "../hooks/auth.hooks";

export default async function playlistsRoutes(fastify: FastifyInstance) {
  // 1. Create Playlist Container (Metadata + Cover Art)
  // Route: POST /artist/playlists
  fastify.post(
    "/new",
    { preHandler: authenticate },
    PlaylistController.createPlaylist,
  );

  // 2. Add/Reorder Tracks in a Playlist
  // Route: POST /artist/playlists/:playlistId/tracks
  fastify.post(
    "/:playlistId/tracks",
    { preHandler: authenticate },
    PlaylistController.addTracksToPlaylist,
  );

  // 3. Search tracks for dropdown inclusion
  // Route: GET /artist/tracks?search=...
  fastify.get(
    "/tracks",
    { preHandler: optionalAuthenticate },
    PlaylistController.searchTracks,
  );

  // 4. Get all playlists for the authenticated user
  // Route: GET /artist/playlists
  fastify.get(
    "/",
    { preHandler: authenticate },
    PlaylistController.getMyPlaylists,
  );

  // 5. Get playlist details & tracks by ID
  // Route: GET /artist/playlists/:id
  fastify.get(
    "/:id",
    { preHandler: optionalAuthenticate },
    PlaylistController.getPlaylistById,
  );

  // 6. Delete a playlist
  // Route: DELETE /artist/playlists/:id
  fastify.delete(
    "/playlists/:id",
    { preHandler: authenticate },
    PlaylistController.deletePlaylist,
  );
}
