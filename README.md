This application uses npm to manage packages

1. after cloning use npm install on both frontend and backend to install packages
2. in the backend write npm run dev to start the server
3. in the frontend write npm start to start the react server npm run dev

#Backend Variables (ENV)
DATABASE_URL=postgres://postgres:password123@@localhost:5432/vwaza
PORT=3001
JWT_SECRET=some-secret
NODE_ENV=development
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_p8pCSvKojAKdadMd_LHWY4lx7U5OCYhCm9tM5vU9Zb0cBDu

#Frontend Variables (ENV)
VITE_API_URL='http://localhost:3001'

The application facilitates a multi-step release process where artists can create a release container, upload high-resolution cover art, and attach audio tracks with specific metadata. The system is designed to be scalable, transitioning from simple metadata storage to a full-fledge media streaming experience.

Key Features ImplementedNormalized Database Architecture:

Uses a relational PostgreSQL schema to separate concerns between releases (metadata/branding) and tracks (audio files/credits), linked via junction tables for many-to-many flexibility.

Cloud Media Management: Integrated with Vercel Blob Storage for reliable, global delivery of cover art and audio files.

Multipart Stream Processing: Utilizes @fastify/multipart to handle heavy file uploads without blocking the server, converting streams to buffers for secure, "unlocked" processing.

Interactive Audio Playback: Features a customized WaveSurfer.js implementation that generates dynamic waveforms, allowing artists to visualize and play back their music directly from cloud URLs.

JWT-Secured Workflows: Implements a robust authentication hook that protects artist routes and automatically associates uploads with the correct user profile.

Tech StackLayerTechnology:
FrontendReact, Tailwind CSS, Axios, WaveSurfer

Backend
Fastify (Node.js), TypeScriptDatabasePostgreSQL (PG-node)StorageVercel BlobAuthJSON Web Tokens (JWT)
