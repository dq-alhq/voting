import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { prisma } from "@/lib/prisma";
import { passwordSchema } from "@/lib/zod";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
    requireEmailVerification: false,
  },
  user: {
    changeEmail: {
      enabled: false,
    },
  },
  secret: process.env.NEXT_PUBLIC_BETTER_AUTH_SECRET,
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/reset-password" || ctx.path === "/change-password") {
        const password = ctx.body.password || ctx.body.newPassword;
        const { error } = passwordSchema.safeParse(password);
        if (error) {
          throw new APIError("BAD_REQUEST", {
            message: "Password kurang kuat",
          });
        }
      }
    }),
  },
});

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
