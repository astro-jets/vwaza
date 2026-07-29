import { Pool } from "pg";

export async function initDb(pool: Pool) {
  try {
    await pool.query(`
      -- =====================================================
      -- EXTENSIONS
      -- =====================================================
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      CREATE EXTENSION IF NOT EXISTS "pg_trgm";

      -- =====================================================
      -- USERS
      -- =====================================================
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        artist_name VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      -- =====================================================
      -- TRACKS
      -- =====================================================
      CREATE TABLE IF NOT EXISTS tracks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        genre VARCHAR(100),
        isrc_code VARCHAR(50),
        audio_url TEXT NOT NULL,
        duration_ms INTEGER NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      -- =====================================================
      -- RELEASES
      -- =====================================================
      CREATE TABLE IF NOT EXISTS releases (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        release_type VARCHAR(50) NOT NULL,
        release_date DATE NOT NULL,
        cover_url TEXT NOT NULL,
        primary_artist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        is_published BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      -- =====================================================
      -- RELEASE TRACKS
      -- =====================================================
      CREATE TABLE IF NOT EXISTS release_tracks (
        release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
        track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
        track_number INTEGER NOT NULL,

        PRIMARY KEY (release_id, track_id),
        UNIQUE (release_id, track_number)
      );

      -- =====================================================
      -- TRACK ARTISTS
      -- =====================================================
      CREATE TABLE IF NOT EXISTS track_artists (
        track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
        artist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL,

        PRIMARY KEY (track_id, artist_id)
      );

      -- =====================================================
      -- PLAYLISTS
      -- =====================================================
      CREATE TABLE IF NOT EXISTS playlists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        cover_url TEXT,
        is_public BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      -- =====================================================
      -- PLAYLIST TRACKS
      -- =====================================================
      CREATE TABLE IF NOT EXISTS playlist_tracks (
        playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
        track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
        position INTEGER NOT NULL,
        added_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (playlist_id, track_id),
        UNIQUE (playlist_id, position)
      );

      -- =====================================================
      -- EVENTS
      -- =====================================================
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        details TEXT,
        venue VARCHAR(255) NOT NULL,
        thumbnail_url TEXT,
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      -- =====================================================
      -- TICKET TYPES
      -- =====================================================
      CREATE TABLE IF NOT EXISTS ticket_types (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        quantity INTEGER NOT NULL,
        remaining_qty INTEGER NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      -- =====================================================
      -- ORDERS
      -- =====================================================
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        total_amount DECIMAL(10, 2) NOT NULL,
        payment_ref VARCHAR(255) UNIQUE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      -- =====================================================
      -- TICKETS
      -- =====================================================
      CREATE TABLE IF NOT EXISTS tickets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        ticket_type_id UUID NOT NULL REFERENCES ticket_types(id) ON DELETE RESTRICT,
        ticket_code VARCHAR(255) UNIQUE NOT NULL,
        price_paid DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'valid',
        checked_in_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      -- =====================================================
      -- INDEXES
      -- =====================================================

      -- Users
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_artist_name ON users(artist_name);
      CREATE INDEX IF NOT EXISTS idx_users_username_trgm ON users USING gin (username gin_trgm_ops);
      CREATE INDEX IF NOT EXISTS idx_users_artist_name_trgm ON users USING gin (artist_name gin_trgm_ops);

      -- Tracks
      CREATE INDEX IF NOT EXISTS idx_tracks_title ON tracks(title);
      CREATE INDEX IF NOT EXISTS idx_tracks_genre ON tracks(genre);
      CREATE INDEX IF NOT EXISTS idx_tracks_title_trgm ON tracks USING gin (title gin_trgm_ops);

      -- Releases
      CREATE INDEX IF NOT EXISTS idx_releases_artist ON releases(primary_artist_id);
      CREATE INDEX IF NOT EXISTS idx_releases_date ON releases(release_date);
      CREATE INDEX IF NOT EXISTS idx_releases_title_trgm ON releases USING gin (title gin_trgm_ops);

      -- Playlists
      CREATE INDEX IF NOT EXISTS idx_playlists_user ON playlists(user_id);
      CREATE INDEX IF NOT EXISTS idx_playlists_title_trgm ON playlists USING gin (title gin_trgm_ops);

      -- Relationship Tables
      CREATE INDEX IF NOT EXISTS idx_release_tracks_release ON release_tracks(release_id);
      CREATE INDEX IF NOT EXISTS idx_release_tracks_track ON release_tracks(track_id);
      CREATE INDEX IF NOT EXISTS idx_track_artists_artist ON track_artists(artist_id);
      CREATE INDEX IF NOT EXISTS idx_track_artists_track ON track_artists(track_id);
      CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist ON playlist_tracks(playlist_id);
      CREATE INDEX IF NOT EXISTS idx_playlist_tracks_track ON playlist_tracks(track_id);

      -- Ticketing & Events
      CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
      CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
      CREATE INDEX IF NOT EXISTS idx_events_title_trgm ON events USING gin (title gin_trgm_ops);
      CREATE INDEX IF NOT EXISTS idx_ticket_types_event ON ticket_types(event_id);
      CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_event ON orders(event_id);
      CREATE INDEX IF NOT EXISTS idx_tickets_order ON tickets(order_id);
      CREATE INDEX IF NOT EXISTS idx_tickets_code ON tickets(ticket_code);
      CREATE INDEX IF NOT EXISTS idx_tickets_type ON tickets(ticket_type_id);

      -- =====================================================
      -- DEFAULT ADMIN USER
      -- Password: admin123
      -- =====================================================
      INSERT INTO users (
        email,
        username,
        password,
        role,
        artist_name
      )
      VALUES (
        'admin@studiox.com',
        'admin',
        '$2b$10$feY8I4RBFN2blDBwrlDar.jN9nidENCez6NEo1m0jBJqhxpWImA5O',
        'admin',
        'Studio X'
      )
      ON CONFLICT (email) DO NOTHING;
    `);

    console.log("✅ Studio X database initialized successfully.");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}
