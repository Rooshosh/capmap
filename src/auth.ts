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
  // session: {
  //   strategy: "jwt",
  // },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only remove athlete field for Strava accounts
      if (account?.provider === "strava" && profile) {
        await prisma.stravaAccount.upsert({
          where: { userId: user.id },
          update: {
            stravaId: String(profile.id),
            username: profile.username,
            resourceState: profile.resource_state,
            firstname: profile.firstname,
            lastname: profile.lastname,
            bio: profile.bio,
            city: profile.city,
            state: profile.state,
            country: profile.country,
            sex: profile.sex,
            premium: profile.premium,
            summit: profile.summit,
            createdAtStrava: profile.created_at ? new Date(profile.created_at) : undefined,
            updatedAtStrava: profile.updated_at ? new Date(profile.updated_at) : undefined,
            badgeTypeId: profile.badge_type_id,
            weight: profile.weight,
            profile: profile.profile,
            profileMedium: profile.profile_medium,
            friend: profile.friend,
            follower: profile.follower,
            blocked: profile.blocked,
            canFollow: profile.can_follow,
            followerCount: profile.follower_count,
            friendCount: profile.friend_count,
            mutualFriendCount: profile.mutual_friend_count,
            athleteType: profile.athlete_type,
            datePreference: profile.date_preference,
            measurementPreference: profile.measurement_preference,
            postableClubsCount: profile.postable_clubs_count,
            isWinbackViaUpload: profile.is_winback_via_upload,
            isWinbackViaView: profile.is_winback_via_view,
            clubs: profile.clubs,
            shoes: profile.shoes,
          },
          create: {
            userId: user.id,
            stravaId: String(profile.id),
            username: profile.username,
            resourceState: profile.resource_state,
            firstname: profile.firstname,
            lastname: profile.lastname,
            bio: profile.bio,
            city: profile.city,
            state: profile.state,
            country: profile.country,
            sex: profile.sex,
            premium: profile.premium,
            summit: profile.summit,
            createdAtStrava: profile.created_at ? new Date(profile.created_at) : undefined,
            updatedAtStrava: profile.updated_at ? new Date(profile.updated_at) : undefined,
            badgeTypeId: profile.badge_type_id,
            weight: profile.weight,
            profile: profile.profile,
            profileMedium: profile.profile_medium,
            friend: profile.friend,
            follower: profile.follower,
            blocked: profile.blocked,
            canFollow: profile.can_follow,
            followerCount: profile.follower_count,
            friendCount: profile.friend_count,
            mutualFriendCount: profile.mutual_friend_count,
            athleteType: profile.athlete_type,
            datePreference: profile.date_preference,
            measurementPreference: profile.measurement_preference,
            postableClubsCount: profile.postable_clubs_count,
            isWinbackViaUpload: profile.is_winback_via_upload,
            isWinbackViaView: profile.is_winback_via_view,
            clubs: profile.clubs,
            shoes: profile.shoes,
          }
        })
      }
      return true;
    },
  },
})