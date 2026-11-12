import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL as string);
const db = client.db("hireloopdb");

export const USER_ROLES = ["seeker", "recruiter", "admin"] as const;


export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },

  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      role: {
        // "string" type stored on the user document in Mongo
        type: "string",
        // allow the client to pass `role` during sign-up
        input: true,
        required: false,
        defaultValue: "seeker",
      },
    },
  },

  // Whitelist the role value server-side so clients can't store arbitrary data
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;

      const role = (ctx.body as { role?: unknown } | undefined)?.role;
      if (role !== undefined && !USER_ROLES.includes(role as (typeof USER_ROLES)[number])) {
        throw new APIError("BAD_REQUEST", { message: "Invalid role" });
      }
    }),
  },
});