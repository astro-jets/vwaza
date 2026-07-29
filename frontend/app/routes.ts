import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Public Routes

  route("/albums", "pages/public/albums.tsx"),
  route("/market", "pages/public/market.tsx"),
  route("/album/:id", "pages/public/album.tsx"),
  route("/movies", "pages/movies/landing.tsx"),
  route("/events/:id", "pages/public/eventsingle.tsx"),
  index("pages/public/home.tsx"),

  route("/maurice", "pages/maurice/landing.tsx"),
  route("/maurice/about", "pages/maurice/about.tsx"),
  route("/maurice/services", "pages/maurice/services.tsx"),
  route("/maurice/insights", "pages/maurice/insights.tsx"),
  route("/maurice/contact", "pages/maurice/contacts.tsx"),
  route("/maurice/record", "pages/maurice/record.tsx"),

  // Artist Routes
  route("/artists", "pages/artist/dashboard.tsx"),
  route("/artists/releases", "pages/artist/releases.tsx"),
  route("/artists/releases/:id", "pages/artist/release.tsx"),
  route("/artists/upload", "pages/artist/createrelease.tsx"),
  route("/artists/playlists", "pages/artist/playlists.tsx"),
  route("/artists/events", "pages/artist/events.tsx"),
  route("/artists/playlists/:id", "pages/artist/playlistsingle.tsx"),
  route("/artists/newplaylist", "pages/artist/newPlaylist.tsx"),

  // Admin Routes
  route("/admin/dashboard", "pages/admin/dashboard.tsx"),
  route("/admin/releases", "pages/admin/reviewrelease.tsx"),
  route("/signup", "pages/auth/SignupPage.tsx"),
  route("/login", "pages/auth/LoginPage.tsx"),
] satisfies RouteConfig;
