import { join } from "path";
import { writeFile } from "fs/promises";

interface props {
  file: File;
  artist: string;
  title: string;
}

export const uploadLocally = async (
  bytes: Buffer<ArrayBufferLike>,
  filename: string,
  mime: string,
) => {
  try {
    const buffer = Buffer.from(bytes);
    const pathToPublic = join(
      "D:",
      "projects",
      "Vwaza",
      "frontend",
      "public",
      "uploads",
      "audios",
    );
    const songName = `${filename}`;
    const path = join(pathToPublic, songName);
    console.log("Path =====> ", path);
    await writeFile(path, buffer as unknown as Uint8Array<ArrayBufferLike>);

    return songName;
  } catch (error: any) {
    console.log(error);
  }
};

export const uploadImageLocally = async (
  bytes: Buffer<ArrayBufferLike>,
  filename: string,
  mime: string,
) => {
  try {
    const buffer = Buffer.from(bytes);
    const pathToPublic = join(
      "D:",
      "projects",
      "Vwaza",
      "frontend",
      "public",
      "uploads",
      "images",
    );
    const songName = `${filename}`;
    const path = join(pathToPublic, songName);
    await writeFile(path, buffer as unknown as Uint8Array<ArrayBufferLike>);

    return songName;
  } catch (error: any) {
    console.log(error);
  }
};
