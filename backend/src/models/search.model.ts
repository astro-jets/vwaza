import { sql } from "../db/db";

export interface SuggestionItem {
  id: string;
  title: string;
  subtitle?: string;
  type: "artist" | "track" | "release";
  cover_url?: string;
}

export interface SuggestionResults {
  artists: SuggestionItem[];
  tracks: SuggestionItem[];
  releases: SuggestionItem[];
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  cover_url: string | null;
  type: "artist" | "track" | "release";
  score: number;
}

/**
 * Fast auto-suggestions across multiple entities (top matches per category)
 */
export async function getSuggestionsModel(
  query: string,
  limitPerCategory = 4,
): Promise<SuggestionResults> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return { artists: [], tracks: [], releases: [] };

  // Set a lower threshold for trigram similarity matching
  await sql("SET LOCAL pg_trgm.similarity_threshold = 0.2");

  // 1. Search Artists
  const artistsQuery = `
    SELECT 
      id, 
      artist_name AS title, 
      'artist' AS type,
      similarity(artist_name, $1) AS score
    FROM users
    WHERE (role = 'artist' OR artist_name IS NOT NULL)
      AND (artist_name % $1 OR artist_name ILIKE '%' || $1 || '%')
    ORDER BY score DESC, artist_name ASC
    LIMIT $2;
  `;

  // 2. Search Tracks (with primary artist name & cover art)
  const tracksQuery = `
    SELECT DISTINCT ON (t.id)
      t.id, 
      t.title, 
      u.artist_name AS subtitle,
      r.cover_url,
      'track' AS type,
      similarity(t.title, $1) AS score
    FROM tracks t
    LEFT JOIN track_artists ta ON t.id = ta.track_id
    LEFT JOIN users u ON ta.artist_id = u.id
    LEFT JOIN release_tracks rt ON t.id = rt.track_id
    LEFT JOIN releases r ON rt.release_id = r.id
    WHERE (t.title % $1 OR t.title ILIKE '%' || $1 || '%')
    ORDER BY t.id, score DESC
    LIMIT $2;
  `;

  // 3. Search Releases (Albums / EPs / Singles)
  const releasesQuery = `
    SELECT 
      r.id, 
      r.title, 
      u.artist_name AS subtitle,
      r.cover_url,
      'release' AS type,
      similarity(r.title, $1) AS score
    FROM releases r
    JOIN users u ON r.primary_artist_id = u.id
    WHERE r.is_published = TRUE
      AND (r.title % $1 OR r.title ILIKE '%' || $1 || '%')
    ORDER BY score DESC, r.release_date DESC
    LIMIT $2;
  `;

  const [artistsRes, tracksRes, releasesRes] = await Promise.all([
    sql<SuggestionItem>(artistsQuery, [cleanQuery, limitPerCategory]),
    sql<SuggestionItem>(tracksQuery, [cleanQuery, limitPerCategory]),
    sql<SuggestionItem>(releasesQuery, [cleanQuery, limitPerCategory]),
  ]);

  return {
    artists: artistsRes.rows,
    tracks: tracksRes.rows,
    releases: releasesRes.rows,
  };
}

/**
 * Unified search for full search result pages (paginated)
 */
export async function fullSearchModel(
  query: string,
  limit = 20,
  offset = 0,
): Promise<SearchResultItem[]> {
  const cleanQuery = query.trim();

  const searchQuery = `
    SELECT id, title, subtitle, cover_url, type, score FROM (
      SELECT id, artist_name AS title, '' AS subtitle, NULL AS cover_url, 'artist' AS type, similarity(artist_name, $1) AS score
      FROM users WHERE (role = 'artist' OR artist_name IS NOT NULL) AND (artist_name % $1 OR artist_name ILIKE '%' || $1 || '%')
      
      UNION ALL
      
      SELECT t.id, t.title, COALESCE(u.artist_name, '') AS subtitle, r.cover_url, 'track' AS type, similarity(t.title, $1) AS score
      FROM tracks t
      LEFT JOIN track_artists ta ON t.id = ta.track_id
      LEFT JOIN users u ON ta.artist_id = u.id
      LEFT JOIN release_tracks rt ON t.id = rt.track_id
      LEFT JOIN releases r ON rt.release_id = r.id
      WHERE (t.title % $1 OR t.title ILIKE '%' || $1 || '%')

      UNION ALL

      SELECT r.id, r.title, u.artist_name AS subtitle, r.cover_url, 'release' AS type, similarity(r.title, $1) AS score
      FROM releases r
      JOIN users u ON r.primary_artist_id = u.id
      WHERE r.is_published = TRUE AND (r.title % $1 OR r.title ILIKE '%' || $1 || '%')
    ) combined_results
    ORDER BY score DESC
    LIMIT $2 OFFSET $3;
  `;

  const result = await sql<SearchResultItem>(searchQuery, [
    cleanQuery,
    limit,
    offset,
  ]);
  return result.rows;
}
