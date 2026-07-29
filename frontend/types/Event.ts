export interface TicketType {
  id?: string;
  name: string;
  price: number;
  quantity?: number;
  remaining_qty: number;
}

export interface Event {
  id: string;
  title: string;
  details?: string;
  venue: string;
  thumbnail_url?: string;
  start_time: string;
  end_time: string;
  organizer_name?: string;
  ticket_types?: TicketType[];
}
