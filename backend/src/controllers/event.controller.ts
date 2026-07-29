import { FastifyRequest, FastifyReply } from "fastify";
import {
  createEventModel,
  getOrganizerEventsModel,
  getPublicEventsModel,
  getEventByIdModel,
  deleteEventModel,
  CreateEventInput,
} from "../models/event.model";

/**
 * Create a new event with multiple ticket tiers
 */
export async function createEvent(req: FastifyRequest, reply: FastifyReply) {
  const organizerId = req.user.id;
  const body = req.body as CreateEventInput;

  if (!body.title || !body.venue || !body.start_time || !body.end_time) {
    return reply.code(400).send({
      error: "Missing required fields: title, venue, start_time, or end_time.",
    });
  }
  if (
    !body.ticket_types ||
    !Array.isArray(body.ticket_types) ||
    body.ticket_types.length === 0
  ) {
    return reply.code(400).send({
      error: "At least one ticket tier configuration is required.",
    });
  }

  try {
    const event = await createEventModel(body, organizerId);

    return reply.status(201).send({
      eventId: event.id,
      title: event.title,
      message: "Event published successfully!",
    });
  } catch (error) {
    req.log.error(error as Error, "Error creating event:");
    return reply.code(500).send({ error: "Failed to create event." });
  }
}

/**
 * Get all events organized by the authenticated user with sales analytics
 */
export async function getOrganizerEvents(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const organizerId = req.user.id;

  try {
    const events = await getOrganizerEventsModel(organizerId);
    return reply.send(events);
  } catch (error) {
    req.log.error(error as Error, "Error fetching organizer events:");
    return reply.code(500).send({ error: "Failed to fetch organizer events." });
  }
}

/**
 * Get all public upcoming events with optional search query
 */
export async function getAllEvents(req: FastifyRequest, reply: FastifyReply) {
  const { search } = req.query as { search?: string };

  try {
    const events = await getPublicEventsModel(search);
    return reply.send(events);
  } catch (error) {
    req.log.error(error as Error, "Error fetching events catalog:");
    return reply.code(500).send({ error: "Failed to fetch events." });
  }
}

/**
 * Get single event details by ID
 */
export async function getEventById(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as { id: string };

  try {
    const event = await getEventByIdModel(id);

    if (!event) {
      return reply.code(404).send({ error: "Event not found." });
    }

    return reply.send(event);
  } catch (error) {
    req.log.error(error as Error, "Error fetching event details:");
    return reply.code(500).send({ error: "Failed to fetch event." });
  }
}

/**
 * Delete an event owned by the organizer
 */
export async function deleteEvent(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as { id: string };
  const organizerId = req.user.id;

  try {
    const deleted = await deleteEventModel(id, organizerId);

    if (!deleted) {
      return reply
        .code(404)
        .send({ error: "Event not found or user unauthorized." });
    }

    return reply.send({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    req.log.error(error as Error, "Error deleting event:");
    return reply.code(500).send({ error: "Failed to delete event." });
  }
}

export const EventController = {
  createEvent,
  getOrganizerEvents,
  getAllEvents,
  getEventById,
  deleteEvent,
};
