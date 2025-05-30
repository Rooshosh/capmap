import NextAuth from "next-auth"
import Strava from "next-auth/providers/strava"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  
  adapter: PrismaAdapter(prisma),
  providers: [
    Strava({
      authorization: {
        params: {
          scope: "profile:read_all,activity:read,activity:read_all",
        },
      },
      profile(profile) {
        console.log(profile)
        return {
          id: String(profile.id), // Hack, would have expected provider package to handle this
          name: `${profile.firstname} ${profile.lastname}`,
          email: null,
          image: profile.profile,
        }
      },
    })
  ],
  /*
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
  */
})