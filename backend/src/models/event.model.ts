import { sql } from "../db/db";

export interface TicketTypeInput {
  name: string;
  price: number;
  quantity: number;
}

export interface CreateEventInput {
  title: string;
  details?: string;
  venue: string;
  thumbnail_url?: string;
  start_time: string;
  end_time: string;
  ticket_types: TicketTypeInput[];
}

export interface EventResult {
  id: string;
  title: string;
  created_at: string;
}

/**
 * Creates an event and its ticket tiers within a single SQL transaction.
 */
export async function createEventModel(
  data: CreateEventInput,
  organizerId: string,
): Promise<EventResult> {
  await sql("BEGIN");

  try {
    // 1. Insert core Event record
    const eventRes = await sql<EventResult>(
      `
      INSERT INTO events 
        (organizer_id, title, details, venue, thumbnail_url, start_time, end_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, title, created_at
      `,
      [
        organizerId,
        data.title,
        data.details || null,
        data.venue,
        data.thumbnail_url || null,
        data.start_time,
        data.end_time,
      ],
    );

    const event = eventRes.rows[0];

    // 2. Insert associated Ticket Tiers
    if (data.ticket_types && data.ticket_types.length > 0) {
      for (const tier of data.ticket_types) {
        await sql(
          `
          INSERT INTO ticket_types (event_id, name, price, quantity, remaining_qty)
          VALUES ($1, $2, $3, $4, $4)
          `,
          [event.id, tier.name, tier.price, tier.quantity],
        );
      }
    }

    await sql("COMMIT");
    return event;
  } catch (error) {
    await sql("ROLLBACK");
    throw error;
  }
}

/**
 * Fetches all events owned by the authenticated organizer, including calculated stats
 * (total sales revenue, tickets sold, capacity) and nested ticket tiers.
 */
export async function getOrganizerEventsModel(
  organizerId: string,
): Promise<any[]> {
  const result = await sql(
    `
    SELECT 
      e.id,
      e.title,
      e.details,
      e.venue,
      e.thumbnail_url,
      e.start_time,
      e.end_time,
      e.created_at,
      COALESCE(SUM(tt.quantity), 0)::int AS total_capacity,
      COALESCE(SUM(tt.quantity - tt.remaining_qty), 0)::int AS tickets_sold,
      COALESCE(SUM((tt.quantity - tt.remaining_qty) * tt.price), 0.00)::numeric AS total_revenue,
      COALESCE(
        json_agg(
          json_build_object(
            'id', tt.id,
            'name', tt.name,
            'price', tt.price,
            'quantity', tt.quantity,
            'remaining_qty', tt.remaining_qty
          )
        ) FILTER (WHERE tt.id IS NOT NULL), '[]'
      ) AS ticket_types
    FROM events e
    LEFT JOIN ticket_types tt ON e.id = tt.event_id
    WHERE e.organizer_id = $1
    GROUP BY e.id
    ORDER BY e.start_time DESC
    `,
    [organizerId],
  );

  return result.rows;
}

/**
 * Public catalog view: Fetches upcoming events with search capability.
 */
export async function getPublicEventsModel(search?: string): Promise<any[]> {
  let query = `
    SELECT 
      e.id,
      e.title,
      e.details,
      e.venue,
      e.thumbnail_url,
      e.start_time,
      e.end_time,
      u.artist_name AS organizer_name,
      COALESCE(
        json_agg(
          json_build_object(
            'id', tt.id,
            'name', tt.name,
            'price', tt.price,
            'remaining_qty', tt.remaining_qty
          )
        ) FILTER (WHERE tt.id IS NOT NULL), '[]'
      ) AS ticket_types
    FROM events e
    JOIN users u ON e.organizer_id = u.id
    LEFT JOIN ticket_types tt ON e.id = tt.event_id
  `;

  const params: any[] = [];

  if (search && search.trim().length > 0) {
    query += ` WHERE e.title ILIKE $1 OR e.venue ILIKE $1 OR u.artist_name ILIKE $1`;
    params.push(`%${search.trim()}%`);
  }

  query += ` GROUP BY e.id, u.artist_name ORDER BY e.start_time ASC`;

  const result = await sql(query, params);
  return result.rows;
}

/**
 * Fetches single event details by ID along with ticket tiers for purchase/viewing.
 */
export async function getEventByIdModel(eventId: string): Promise<any | null> {
  const eventResult = await sql(
    `
    SELECT 
      e.id,
      e.title,
      e.details,
      e.venue,
      e.thumbnail_url,
      e.start_time,
      e.end_time,
      e.created_at,
      u.id AS organizer_id,
      u.artist_name AS organizer_name
    FROM events e
    JOIN users u ON e.organizer_id = u.id
    WHERE e.id = $1
    `,
    [eventId],
  );

  if (eventResult.rows.length === 0) return null;

  const tiersResult = await sql(
    `
    SELECT id, name, price, quantity, remaining_qty
    FROM ticket_types
    WHERE event_id = $1
    ORDER BY price ASC
    `,
    [eventId],
  );

  return {
    ...eventResult.rows[0],
    ticket_types: tiersResult.rows,
  };
}

/**
 * Deletes an event (ON DELETE CASCADE handles ticket_types, orders, and tickets).
 */
export async function deleteEventModel(
  eventId: string,
  organizerId: string,
): Promise<boolean> {
  const result = await sql(
    `DELETE FROM events WHERE id = $1 AND organizer_id = $2 RETURNING id`,
    [eventId, organizerId],
  );

  return result.rows.length > 0;
}
