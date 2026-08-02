import { FastifyRequest, FastifyReply } from "fastify";
import { uploadImageLocally } from "../helpers/upload";
import {
  insertPlaylist,
  insertTracksToPlaylist,
  searchTracksModel,
  getUserPlaylistsModel,
  getPlaylistByIdModel,
  deletePlaylistModel,
  PlaylistFormData,
  PlaylistTrackInput,
} from "../models/playlist.model";

/**
 * Step 1: Create Playlist Container (Metadata + Cover Image)
 */
export async function createPlaylist(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user.id;
  const parts = req.parts();

  let metadata: Partial<PlaylistFormData> = {};
  let coverFileBuffer: Buffer | null = null;
  let coverFileName: string = "";
  let coverMimeType: string = "";

  try {
    for await (const part of parts) {
      if (part.type === "file") {
        if (part.fieldname === "coverFile") {
          coverFileName = part.filename;
          coverMimeType = part.mimetype;
          coverFileBuffer = await part.toBuffer();
        } else {
          await part.toBuffer(); // Drain unused streams
        }
      } else {
        (metadata as any)[part.fieldname] = part.value;
      }
    }

    if (!metadata.title) {
      return reply.code(400).send({ error: "Playlist title is required." });
    }

    let coverUrl: string | null = null;
    if (coverFileBuffer) {
      coverUrl =
        (await uploadImageLocally(
          coverFileBuffer,
          coverFileName,
          coverMimeType,
        )) ?? null;
    }

    const result = await insertPlaylist(metadata, coverUrl, userId);

    return reply.status(201).send({
      playlistId: result.id,
      title: result.title,
      message: "Playlist created successfully!",
    });
  } catch (error) {
    req.log.error(error);
    return reply.code(500).send({ error: "Internal Server Error" });
  }
}

/**
 * Step 2: Attach ordered tracks to an existing playlist
 */
export async function addTracksToPlaylist(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { playlistId } = req.params as { playlistId: string };
  const { tracks } = req.body as { tracks: PlaylistTrackInput[] };

  if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
    return reply.code(400).send({ error: "Tracks array cannot be empty." });
  }

  try {
    await insertTracksToPlaylist(playlistId, tracks);

    return reply.send({
      success: true,
      message: "Tracks attached and ordered successfully.",
    });
  } catch (error) {
    req.log.error(error as Error, "Error adding tracks to playlist:");
    return reply.code(500).send({ error: "Failed to add tracks to playlist." });
  }
}

/**
 * Search tracks for the playlist builder component
 */
export async function searchTracks(req: FastifyRequest, reply: FastifyReply) {
  const { search } = req.query as { search?: string };

  if (!search || search.trim().length === 0) {
    return reply.send([]);
  }

  try {
    const tracks = await searchTracksModel(search.trim());
    return reply.send(tracks);
  } catch (error) {
    req.log.error(error);
    return reply.code(500).send({ error: "Failed to search tracks." });
  }
}

/**
 * Get all playlists created by the logged-in user
 */
export async function getMyPlaylists(req: FastifyRequest, reply: FastifyReply) {
  // const userId = req.user.id;

  try {
    const playlists = await getUserPlaylistsModel("");
    return reply.send(playlists);
  } catch (error) {
    req.log.error(error);
    return reply.code(500).send({ error: "Failed to fetch playlists." });
  }
}

/**
 * Get playlist details and tracks by playlist ID
 */
export async function getPlaylistById(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = req.params as { id: string };

  try {
    const playlist = await getPlaylistByIdModel(id);

    if (!playlist) {
      return reply.code(404).send({ error: "Playlist not found." });
    }

    return reply.send(playlist);
  } catch (error) {
    req.log.error(error as Error, "Playlist fetch error:");
    return reply.code(500).send({ error: "Failed to fetch playlist." });
  }
}

/**
 * Delete a playlist
 */
export async function deletePlaylist(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as { id: string };
  const userId = req.user.id;

  try {
    const deleted = await deletePlaylistModel(id, userId);

    if (!deleted) {
      return reply
        .code(404)
        .send({ error: "Playlist not found or user unauthorized." });
    }

    return reply.send({ success: true, message: "Playlist deleted." });
  } catch (error) {
    req.log.error(error);
    return reply.code(500).send({ error: "Failed to delete playlist." });
  }
}

export const PlaylistController = {
  createPlaylist,
  addTracksToPlaylist,
  searchTracks,
  getMyPlaylists,
  getPlaylistById,
  deletePlaylist,
};
