// import { FastifyRequest, FastifyReply } from "fastify";
// import { utapi } from "../uploadthing";
// import { pool } from "../db/db";
// // import { Blob } from "fetch-blob";

// export async function uploadRelease(
//   request: FastifyRequest,
//   reply: FastifyReply
// ) {
//   const parts = request.parts();

//   let coverPart: any;
//   let audioPart: any;
//   const fields: Record<string, string> = {};

//   for await (const part of parts) {
//     if (part.type === "file") {
//       if (part.fieldname === "cover") coverPart = part;
//       if (part.fieldname === "audio") audioPart = part;
//     } else {
//       fields[part.fieldname] = String(part.value);
//     }
//   }

//   if (!coverPart || !audioPart) {
//     return reply.code(400).send({ error: "Missing files" });
//   }

//   // Convert streams → Buffer
//   const coverBuffer = await coverPart.toBuffer();
//   const audioBuffer = await audioPart.toBuffer();

//   // ✅ Buffer → Blob (Node-safe)
//   const coverBlob = new Blob([coverBuffer], {
//     type: coverPart.mimetype,
//   });

//   const audioBlob = new Blob([audioBuffer], {
//     type: audioPart.mimetype,
//   });

//   // Upload to UploadThing
//   const coverUpload = await utapi.uploadFiles(coverBlob as any);
//   const audioUpload = await utapi.uploadFiles(audioBlob as any);

//   if (coverUpload.error || audioUpload.error) {
//     return reply.code(500).send({ error: "Upload failed" });
//   }

//   const coverUrl = coverUpload.data!.url;
//   const audioUrl = audioUpload.data!.url;

//   // TODO: replace with request.user.id when auth middleware is added
//   const artistId = 2;

//   const { rows } = await pool.query(
//     `
//     INSERT INTO tracks (
//       artist_id,
//       title,
//       featuring,
//       genre,
//       isrc,
//       release_date,
//       is_album,
//       cover_url,
//       audio_url
//     )
//     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
//     RETURNING *
//     `,
//     [
//       artistId,
//       fields.title,
//       fields.genre,
//       fields.isrc || null,
//       fields.releaseDate || null,
//       fields.isAlbum === "true",
//       coverUrl,
//       audioUrl,
//     ]
//   );

//   return reply.send({
//     success: true,
//     track: rows[0],
//   });
// }
