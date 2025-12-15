import { createAuthClient } from "better-auth/react";

export const { signIn, signOut, useSession, signUp } = createAuthClient({
  // The URL of your app, e.g. http://localhost:3000
  baseURL: process.env.BETTER_AUTH_URL!,
  // The secret used to sign JWTs
  secret: process.env.BETTER_AUTH_SECRET!,
});
