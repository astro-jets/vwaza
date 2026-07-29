import { FastifyInstance } from "fastify";
import { SearchController } from "../controllers/search.controller";

export default async function searchRoutes(fastify: FastifyInstance) {
  // 1. Auto-suggestions endpoint
  // Route: GET /search/suggestions
  fastify.get(
    "/suggestions",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            q: { type: "string", minLength: 1 },
          },
          required: ["q"],
        },
      },
    },
    SearchController.getSuggestions,
  );

  // 2. Full Search endpoint
  // Route: GET /search
  fastify.get(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            q: { type: "string", minLength: 1 },
            page: { type: "string" },
            limit: { type: "string" },
          },
          required: ["q"],
        },
      },
    },
    SearchController.searchAll,
  );
}
