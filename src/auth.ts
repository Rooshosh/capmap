import NextAuth from "next-auth"
import Strava from "next-auth/providers/strava"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"
import { Prisma } from "@prisma/client"

interface StravaProfile {
  id: string;
  username?: string;
  resource_state?: number;
  firstname?: string;
  lastname?: string;
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
  sex?: string;
  premium?: boolean;
  summit?: boolean;
  created_at?: string;
  updated_at?: string;
  badge_type_id?: number;
  weight?: number;
  profile?: string;
  profile_medium?: string;
  friend?: number | null;
  follower?: number | null;
  blocked?: boolean;
  can_follow?: boolean;
  follower_count?: number;
  friend_count?: number;
  mutual_friend_count?: number;
  athlete_type?: number;
  date_preference?: string;
  measurement_preference?: string;
  postable_clubs_count?: number;
  is_winback_via_upload?: boolean;
  is_winback_via_view?: boolean;
  clubs?: Prisma.InputJsonValue;
  shoes?: Prisma.InputJsonValue;
}

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
        return {
          id: String(profile.id), // Hack, would have expected provider package to handle this
          name: `${profile.firstname} ${profile.lastname}`,
          email: null,
          image: profile.profile,
        }
      },
      
    })
  ],
  // session: {
  //   strategy: "jwt",
  // },
  // callbacks: {
  //   async signIn({ user, account, profile }) {
  //     // No DB writes here; just allow sign-in
  //     return true;
  //   },
  // },
  events: {
    async signIn({ user, account, profile }) {
      console.log("signIn");
      console.log("User:", user);
      console.log("Account:", account);
      console.log("Profile:", profile);

      if (account?.provider === "strava" && profile) {
        const p = profile as StravaProfile;
        await prisma.stravaAccount.upsert({
          where: { userId: user.id },
          update: {
            stravaId: String(p.id),
            username: p.username,
            resourceState: p.resource_state,
            firstname: p.firstname,
            lastname: p.lastname,
            bio: p.bio,
            city: p.city,
            state: p.state,
            country: p.country,
            sex: p.sex,
            premium: p.premium,
            summit: p.summit,
            createdAtStrava: p.created_at ? new Date(p.created_at) : undefined,
            updatedAtStrava: p.updated_at ? new Date(p.updated_at) : undefined,
            badgeTypeId: p.badge_type_id,
            weight: p.weight,
            profile: p.profile,
            profileMedium: p.profile_medium,
            friend: p.friend,
            follower: p.follower,
            blocked: p.blocked,
            canFollow: p.can_follow,
            followerCount: p.follower_count,
            friendCount: p.friend_count,
            mutualFriendCount: p.mutual_friend_count,
            athleteType: p.athlete_type,
            datePreference: p.date_preference,
            measurementPreference: p.measurement_preference,
            postableClubsCount: p.postable_clubs_count,
            isWinbackViaUpload: p.is_winback_via_upload,
            isWinbackViaView: p.is_winback_via_view,
            clubs: p.clubs,
            shoes: p.shoes,
          },
          create: {
            userId: user.id!,
            stravaId: String(p.id),
            username: p.username,
            resourceState: p.resource_state,
            firstname: p.firstname,
            lastname: p.lastname,
            bio: p.bio,
            city: p.city,
            state: p.state,
            country: p.country,
            sex: p.sex,
            premium: p.premium,
            summit: p.summit,
            createdAtStrava: p.created_at ? new Date(p.created_at) : undefined,
            updatedAtStrava: p.updated_at ? new Date(p.updated_at) : undefined,
            badgeTypeId: p.badge_type_id,
            weight: p.weight,
            profile: p.profile,
            profileMedium: p.profile_medium,
            friend: p.friend,
            follower: p.follower,
            blocked: p.blocked,
            canFollow: p.can_follow,
            followerCount: p.follower_count,
            friendCount: p.friend_count,
            mutualFriendCount: p.mutual_friend_count,
            athleteType: p.athlete_type,
            datePreference: p.date_preference,
            measurementPreference: p.measurement_preference,
            postableClubsCount: p.postable_clubs_count,
            isWinbackViaUpload: p.is_winback_via_upload,
            isWinbackViaView: p.is_winback_via_view,
            clubs: p.clubs,
            shoes: p.shoes,
          }
        });
      }
    },
  },
})