import axios, { type AxiosInstance } from "axios";

// --- Base Configuration ---
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/playlist";

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to pass Bearer token per request
const getAuthHeaders = (token?: string) => {
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- Types & Interfaces ---
export interface Track {
  id: string;
  title: string;
  artist_name?: string;
  genre?: string;
  duration_ms?: number;
  position?: number;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  coverUrl?: string;
  tracks?: Track[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePlaylistInput {
  title: string;
  description?: string;
  isPublic: boolean;
  coverFile?: File | null;
}

export interface PlaylistTrackInput {
  trackId: string;
  position: number;
}

// --- Playlist Service API Calls ---

/**
 * Search for existing tracks by title or artist name
 */
export const searchTracks = async (
  query: string,
  token?: string,
): Promise<Track[]> => {
  const response = await api.get<Track[]>("/tracks", {
    params: { search: query },
    headers: getAuthHeaders(token),
  });
  return response.data;
};

/**
 * Create a new playlist (Handles text fields + optional cover image file)
 */
export const createPlaylist = async (
  data: CreatePlaylistInput,
  token?: string,
): Promise<{ playlistId: string; message: string }> => {
  const formData = new FormData();
  formData.append("title", data.title);
  if (data.description) formData.append("description", data.description);
  formData.append("isPublic", String(data.isPublic));

  if (data.coverFile) {
    formData.append("coverFile", data.coverFile);
  }

  const response = await api.post<{ playlistId: string; message: string }>(
    "/playlists",
    formData,
    {
      headers: {
        ...getAuthHeaders(token),
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

/**
 * Add and ordered set of tracks to a playlist
 */
export const addTracksToPlaylist = async (
  playlistId: string,
  tracks: PlaylistTrackInput[],
  token?: string,
): Promise<{ success: boolean }> => {
  const response = await api.post<{ success: boolean }>(
    `/playlists/${playlistId}/tracks`,
    { tracks },
    {
      headers: getAuthHeaders(token),
    },
  );
  return response.data;
};

/**
 * Get all playlists created by the current user/artist
 */
export const getUserPlaylists = async (token?: string): Promise<Playlist[]> => {
  const response = await api.get<Playlist[]>("/playlists", {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

/**
 * Get a single playlist by ID along with its associated tracks
 */
export const getPlaylistById = async (
  playlistId: string,
  token?: string,
): Promise<Playlist> => {
  const response = await api.get<Playlist>(`/playlists/${playlistId}`, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

/**
 * Update metadata for an existing playlist
 */
export const updatePlaylist = async (
  playlistId: string,
  data: Partial<CreatePlaylistInput>,
  token?: string,
): Promise<Playlist> => {
  const formData = new FormData();
  if (data.title) formData.append("title", data.title);
  if (data.description !== undefined)
    formData.append("description", data.description);
  if (data.isPublic !== undefined)
    formData.append("isPublic", String(data.isPublic));
  if (data.coverFile) formData.append("coverFile", data.coverFile);

  const response = await api.put<Playlist>(
    `/playlists/${playlistId}`,
    formData,
    {
      headers: {
        ...getAuthHeaders(token),
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

/**
 * Reorder/Replace all tracks in an existing playlist
 */
export const updatePlaylistTracks = async (
  playlistId: string,
  tracks: PlaylistTrackInput[],
  token?: string,
): Promise<{ success: boolean }> => {
  const response = await api.put<{ success: boolean }>(
    `/playlists/${playlistId}/tracks`,
    { tracks },
    { headers: getAuthHeaders(token) },
  );
  return response.data;
};

/**
 * Delete a single track from a playlist
 */
export const removeTrackFromPlaylist = async (
  playlistId: string,
  trackId: string,
  token?: string,
): Promise<{ success: boolean }> => {
  const response = await api.delete<{ success: boolean }>(
    `/playlists/${playlistId}/tracks/${trackId}`,
    { headers: getAuthHeaders(token) },
  );
  return response.data;
};

/**
 * Delete a playlist completely
 */
export const deletePlaylist = async (
  playlistId: string,
  token?: string,
): Promise<{ success: boolean }> => {
  const response = await api.delete<{ success: boolean }>(
    `/playlists/${playlistId}`,
    {
      headers: getAuthHeaders(token),
    },
  );
  return response.data;
};
