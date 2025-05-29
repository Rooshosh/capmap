import NextAuth from "next-auth"
import Strava from "next-auth/providers/strava"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/app/lib/prisma"

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Strava({
            clientId: process.env.STRAVA_CLIENT_ID!,
            clientSecret: process.env.STRAVA_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "profile:read_all,activity:read,activity:read_all",
                    approval_prompt: "auto",
                }, 
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
          // Only remove athlete field for Strava accounts
          if (account?.provider === "strava" && account.athlete) {
            delete account.athlete;
          }
          return true;
        },
      },
})

export { handler as GET, handler as POST }