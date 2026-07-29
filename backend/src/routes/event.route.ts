import { FastifyInstance } from "fastify";
import { EventController } from "../controllers/event.controller";
import { authenticate, optionalAuthenticate } from "../hooks/auth.hooks";

export default async function eventsRoutes(fastify: FastifyInstance) {
  // 1. Create Event with Ticket Tiers
  // Route: POST /events
  fastify.post("/", { preHandler: authenticate }, EventController.createEvent);

  // 2. Get Events created by logged-in organizer (Dashboard view)
  // Route: GET /events/organizer
  fastify.get(
    "/organizer",
    { preHandler: authenticate },
    EventController.getOrganizerEvents,
  );

  // 3. Search & List Public Events
  // Route: GET /events?search=...
  fastify.get(
    "/",
    { preHandler: optionalAuthenticate },
    EventController.getAllEvents,
  );

  // 4. Get Event details by ID
  // Route: GET /events/:id
  fastify.get(
    "/:id",
    { preHandler: optionalAuthenticate },
    EventController.getEventById,
  );

  // 5. Delete Event
  // Route: DELETE /events/:id
  fastify.delete(
    "/:id",
    { preHandler: authenticate },
    EventController.deleteEvent,
  );
}
