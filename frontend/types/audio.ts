import { Dispatch, SetStateAction } from "react";

export interface AudioContextType {
  audio: {
    title: string;
    artist: string;
    avatar: string;
    audio: string;
  } | null;
}
