import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/artists", "pages/artist/dashboard.tsx"),
  route("/artists/releases", "pages/artist/releases.tsx"),
  route("/artists/upload", "pages/artist/createrelease.tsx"),
  route("/admin/dashboard", "pages/admin/dashboard.tsx"),
  route("/admin/releases", "pages/admin/reviewrelease.tsx"),
  route("/signup", "pages/auth/SignupPage.tsx"),
  route("/login", "pages/auth/LoginPage.tsx"),
] satisfies RouteConfig;
