import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: "http://localhost:3000",
  plugins: [
    // Types the `role` additional field on sign-up/sign-in calls
    inferAdditionalFields<typeof auth>(),
  ],
});

export const { signIn, signUp, useSession } = authClient;
