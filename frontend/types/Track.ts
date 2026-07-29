export interface Track {
  _id?: string;
  title: string;
  artist: string;
  featuring?: string[] | null;
  producers?: string[] | null;
  videographers?: string[] | null;
  categories?: string[];
  audioUrl: string | File;
  videoURL?: string | null;
  albumArtUrl?: string | null;
  duration?: string | null;
  albumID?: string | null;
}
