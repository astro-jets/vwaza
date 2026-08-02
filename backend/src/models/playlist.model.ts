import { sql } from "../db/db";

export interface PlaylistFormData {
  title: string;
  description?: string;
  isPublic?: boolean | string;
}

export interface PlaylistTrackInput {
  trackId: string;
  position: number;
}

export interface PlaylistResult {
  id: string;
  title: string;
}

/**
 * Inserts core playlist metadata into the database.
 */
export async function insertPlaylist(
  data: Partial<PlaylistFormData>,
  coverUrl: string | null,
  userId: string,
): Promise<PlaylistResult> {
  const isPublicBool =
    typeof data.isPublic === "string"
      ? data.isPublic === "true"
      : Boolean(data.isPublic);

  const result = await sql<PlaylistResult>(
    `
    INSERT INTO playlists 
      (title, description, cover_url, is_public, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, title
    `,
    [data.title, data.description || null, coverUrl, isPublicBool, userId],
  );

  return result.rows[0];
}

/**
 * Replaces or attaches ordered tracks to a playlist using a SQL transaction.
 */
export async function insertTracksToPlaylist(
  playlistId: string,
  tracks: PlaylistTrackInput[],
): Promise<boolean> {
  await sql("BEGIN");

  try {
    // 1. Clear existing links if reordering an existing playlist
    await sql(`DELETE FROM playlist_tracks WHERE playlist_id = $1`, [
      playlistId,
    ]);

    // 2. Insert updated ordered tracks
    for (const item of tracks) {
      await sql(
        `
        INSERT INTO playlist_tracks (playlist_id, track_id, position)
        VALUES ($1, $2, $3)
        `,
        [playlistId, item.trackId, item.position],
      );
    }

    await sql("COMMIT");
    return true;
  } catch (error) {
    await sql("ROLLBACK");
    throw error;
  }
}

/**
 * Searches tracks by title or artist name for the playlist builder dropdown.
 */
export async function searchTracksModel(query: string): Promise<any[]> {
  const searchPattern = `%${query}%`;
  const result = await sql(
    `
    SELECT 
      t.id, 
      t.title, 
      t.genre, 
      t.duration_ms, 
      a.artist_name
    FROM tracks t
    LEFT JOIN track_artists ta ON t.id = ta.track_id AND ta.role = 'main'
    LEFT JOIN users a ON ta.artist_id = a.id
    WHERE t.title ILIKE $1 OR a.artist_name ILIKE $1
    LIMIT 20
    `,
    [searchPattern],
  );

  return result.rows;
}

/**
 * Fetches all playlists created by a specific user.
 */
export async function getUserPlaylistsModel(userId: string): Promise<any[]> {
  const result = await sql(
    `
    SELECT 
      p.id, 
      p.title, 
      p.description, 
      p.cover_url, 
      p.is_public, 
      p.created_at,
      COUNT(pt.track_id)::int AS track_count
    FROM playlists p
    LEFT JOIN playlist_tracks pt ON p.id = pt.playlist_id
    GROUP BY p.id
    ORDER BY p.created_at DESC
    `,
  );

  return result.rows;
}

/**
 * Fetches playlist details along with its ordered tracks.
 */
export async function getPlaylistByIdModel(playlistId: string): Promise<any> {
  const playlistResult = await sql(
    `
    SELECT 
      p.id, 
      p.title, 
      p.description, 
      p.cover_url, 
      p.is_public, 
      p.created_at,
      u.artist_name AS creator_name
    FROM playlists p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = $1
    `,
    [playlistId],
  );

  if (playlistResult.rows.length === 0) return null;

  const tracksResult = await sql(
    `
    SELECT 
      t.id, 
      t.title, 
      t.genre, 
      t.audio_url, 
      t.duration_ms, 
      pt.position,
      a.artist_name
    FROM playlist_tracks pt
    JOIN tracks t ON pt.track_id = t.id
    LEFT JOIN track_artists ta ON t.id = ta.track_id AND ta.role = 'main'
    LEFT JOIN users a ON ta.artist_id = a.id
    WHERE pt.playlist_id = $1
    ORDER BY pt.position ASC
    `,
    [playlistId],
  );

  return {
    ...playlistResult.rows[0],
    tracks: tracksResult.rows,
  };
}

/**
 * Deletes a playlist (ON DELETE CASCADE handles playlist_tracks removal).
 */
export async function deletePlaylistModel(
  playlistId: string,
  userId: string,
): Promise<boolean> {
  const result = await sql(
    `DELETE FROM playlists WHERE id = $1 AND user_id = $2 RETURNING id`,
    [playlistId, userId],
  );
  return result.rows.length > 0;
}
