import { FastifyRequest, FastifyReply } from "fastify";
import { createUser, findUserByEmail, userExists } from "../models/auth.models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserRole } from "../types/user";

// Helper function to sign a JWT
const signToken = (user: User) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "fallback_secret_must_be_changed", // Use env var or fall back
    { expiresIn: "7d" }
  );
};

export class AuthController {
  // --- ARTIST REGISTRATION (DEFAULT ROLE) ---
  static async registerArtist(req: FastifyRequest, reply: FastifyReply) {
    const { username, email, password } = req.body as any;
    const defaultRole: UserRole = "artist";

    if (!email || !password) {
      return reply
        .code(400)
        .send({ error: "Email and password are required." });
    }

    if (await userExists(email)) {
      return reply.code(409).send({ error: "User already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await createUser(email, hashed, username, defaultRole);

    // Return token on successful registration
    const token = signToken(newUser as User);
    return reply.code(201).send({
      token,
      user: {
        id: (newUser as User).id,
        username: (newUser as User).username,
        email: (newUser as User).email,
        role: (newUser as User).role,
      },
    });
  }

  // --- ADMIN REGISTRATION (Special Route) ---
  static async registerAdmin(req: FastifyRequest, reply: FastifyReply) {
    const { username, email, password } = req.body as any;
    const adminRole: UserRole = "admin";

    if (!email || !password) {
      return reply
        .code(400)
        .send({ error: "Email and password are required." });
    }

    if (await userExists(email)) {
      return reply
        .code(409)
        .send({ error: "Admin already exists with this email." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await createUser(email, hashed, username, adminRole);

    const token = signToken(newUser as User);
    return reply.code(201).send({
      token,
      user: {
        id: (newUser as User).id,
        email: (newUser as User).email,
        role: (newUser as User).role,
      },
    });
  }

  // --- LOGIN ---
  static async login(req: FastifyRequest, reply: FastifyReply) {
    const { email, password } = req.body as any;

    if (!email || !password) {
      return reply
        .code(400)
        .send({ error: "Email and password are required." });
    }

    const user = await findUserByEmail(email);
    if (!user) return reply.code(401).send({ error: "Invalid credentials" });

    // Check password validity
    const valid = await bcrypt.compare(password, user.password!);
    if (!valid) return reply.code(401).send({ error: "Invalid credentials" });

    // Generate and return JWT
    const token = signToken(user);

    // Avoid sending the password hash back
    const { password: _, ...userPayload } = user;

    return reply.send({ token, user: userPayload });
  }
}
