// src/models/releases.model.ts

import { sql } from "../db/db"; // Assuming database connection is exported as 'sql'
import { ReleaseFormData, TrackFormData } from "../validators/release.schema";

// Interfaces for return types
interface ReleaseResult {
  id: string;
  title: string;
}

interface TrackResult {
  id: string;
}

/**
 * Inserts the core release metadata into the database.
 * @returns The ID and title of the newly created release.
 */
export async function insertRelease(
  data: Partial<ReleaseFormData>,
  coverUrl: string,
  primaryArtistId: string
): Promise<ReleaseResult> {
  const result = await sql<ReleaseResult>(
    `
        INSERT INTO releases 
        (title, release_type, release_date, cover_url, primary_artist_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, title
        `,
    [data.title, data.releaseType, data.releaseDate, coverUrl, primaryArtistId]
  );

  return result.rows[0];
}

/**
 * Inserts a track and links it to a release and the main artist within a database transaction.
 * Rolls back if any part of the operation fails.
 * @returns The ID of the newly created track.
 */
export async function insertTrackAndLink(
  trackMetadata: Partial<TrackFormData> & { trackNumber: string },
  audioUrl: string,
  releaseId: string,
  artistId: string
): Promise<TrackResult> {
  // Start transaction to ensure atomicity
  await sql("BEGIN");

  try {
    // 1. Insert into tracks
    const trackResult = await sql<TrackResult>(
      `
            INSERT INTO tracks 
            (title, genre, isrc_code, audio_url, duration_ms)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
            `,
      [
        trackMetadata.title,
        trackMetadata.genre,
        trackMetadata.isrc,
        audioUrl,
        Number(trackMetadata.duration) * 1000, // Convert seconds to milliseconds
      ]
    );
    const trackId = trackResult.rows[0].id;

    // 2. Insert into release_tracks (sets the track order)
    await sql(
      `
            INSERT INTO release_tracks
            (release_id, track_id, track_number)
            VALUES ($1, $2, $3)
            `,
      [releaseId, trackId, Number(trackMetadata.trackNumber)]
    );

    // 3. Insert into track_artists (Link main artist)
    await sql(
      `
            INSERT INTO track_artists
            (track_id, artist_id, role)
            VALUES ($1, $2, 'main')
            `,
      [trackId, artistId]
    );

    await sql("COMMIT"); // Commit transaction

    return { id: trackId };
  } catch (error) {
    await sql("ROLLBACK"); // Rollback on error
    throw error; // Re-throw the error for the controller to handle logging/response
  }
}

/**
 * Fetches all releases for a specific artist.
 */
// src/models/release.model.ts

/**
 * Fetches all tracks for an artist, including their parent release metadata.
 * This performs a JOIN across releases, release_tracks, and tracks.
 */
export async function getReleasesByArtist(artistId: string): Promise<any[]> {
  const result = await sql(
    `
    SELECT 
        t.id, 
        t.title, 
        t.genre, 
        t.audio_url, 
        r.cover_url, 
        r.release_date,
        -- You can add featuring logic here if you have a contributors table
        '' as featuring 
    FROM releases r
    JOIN release_tracks rt ON r.id = rt.release_id
    JOIN tracks t ON rt.track_id = t.id
    WHERE r.primary_artist_id = $1
    ORDER BY r.created_at DESC, rt.track_number ASC
    `,
    [artistId]
  );

  return result.rows;
}
