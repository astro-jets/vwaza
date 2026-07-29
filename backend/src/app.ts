// src/app.ts
import Fastify from "fastify";
import dotenv from "dotenv";

import corsPlugin from "./plugins/cors";
import multipartPlugin from "./plugins/multipart";
import postgresPlugin from "./plugins/postgress";
import healthRoute from "./routes/health.route";
import releasesRoute from "./routes/releases.route";
import authRoutes from "./routes/auth.route";
import playlistRoute from "./routes/playlist.route";
import eventsRoute from "./routes/event.route";
import searchRoutes from "./routes/search.route";

dotenv.config();

export async function buildApp() {
  const app = Fastify({ logger: true });

  // Plugins
  await app.register(corsPlugin);
  await app.register(multipartPlugin);
  await app.register(postgresPlugin);

  // Routes
  await app.register(healthRoute);
  await app.register(authRoutes);
  await app.register(searchRoutes, { prefix: "/search" });
  await app.register(eventsRoute, { prefix: "/events" });
  await app.register(releasesRoute, { prefix: "/artist" });
  await app.register(playlistRoute, { prefix: "/playlist" });

  return app;
}
