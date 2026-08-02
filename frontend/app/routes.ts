import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Public Routes

  route("/albums", "pages/public/albums.tsx"),
  route("/discover", "pages/public/discover.tsx"),
  route("/market", "pages/public/market.tsx"),
  route("/album/:id", "pages/public/album.tsx"),
  route("/movies", "pages/movies/landing.tsx"),
  route("/playlists", "pages/public/PlaylistCatalogue.tsx"),
  route("/playlists/:id", "pages/public/PlaylistSingle.tsx"),
  route("/events", "pages/public/events.tsx"),
  route("/events/:id", "pages/public/eventsingle.tsx"),
  index("pages/public/home.tsx"),

  // Artist Routes
  route("/artists", "pages/public/artists.tsx"),
  route("/artists/releases", "pages/artist/Releases.tsx"),
  route("/artists/releases/:id", "pages/artist/Release.tsx"),
  route("/artists/upload", "pages/artist/CreateRelease.tsx"),
  route("/artists/playlists", "pages/artist/Playlists.tsx"),
  route("/artists/events", "pages/artist/Events.tsx"),
  route("/artists/playlists/:id", "pages/artist/PlaylistSingle.tsx"),
  route("/artists/newplaylist", "pages/artist/NewPlaylist.tsx"),

  // Admin Routes
  // route("/admin/dashboard", "pages/admin/dashboard.tsx"),
  // route("/admin/releases", "pages/admin/reviewrelease.tsx"),
  // route("/signup", "pages/auth/SignupPage.tsx"),
  // route("/login", "pages/auth/LoginPage.tsx"),
] satisfies RouteConfig;
