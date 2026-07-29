import { FastifyRequest, FastifyReply } from "fastify";
import { getSuggestionsModel, fullSearchModel } from "../models/search.model";

/**
 * Get auto-suggestions for artists, tracks, and releases
 */
export async function getSuggestions(req: FastifyRequest, reply: FastifyReply) {
  const { q } = req.query as { q?: string };

  if (!q || q.trim().length < 2) {
    return reply.send({ artists: [], tracks: [], releases: [] });
  }

  try {
    const suggestions = await getSuggestionsModel(q);
    return reply.send(suggestions);
  } catch (error) {
    req.log.error(error as Error, "Error fetching search suggestions:");
    return reply
      .code(500)
      .send({ error: "Failed to fetch search suggestions." });
  }
}

/**
 * Get full paginated search results across all entities
 */
export async function searchAll(req: FastifyRequest, reply: FastifyReply) {
  const { q, page, limit } = req.query as {
    q?: string;
    page?: string;
    limit?: string;
  };

  const parsedPage = Math.max(1, parseInt(page || "1", 10));
  const parsedLimit = Math.min(50, parseInt(limit || "20", 10));
  const offset = (parsedPage - 1) * parsedLimit;

  if (!q || q.trim() === "") {
    return reply.send([]);
  }

  try {
    const results = await fullSearchModel(q, parsedLimit, offset);
    return reply.send(results);
  } catch (error) {
    req.log.error(error as Error, "Error performing search:");
    return reply.code(500).send({ error: "Search failed." });
  }
}

export const SearchController = {
  getSuggestions,
  searchAll,
};
