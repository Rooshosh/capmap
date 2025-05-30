import axios from "axios";
import { prisma } from "@/prisma";

export async function getValidStravaAccessToken(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "strava" },
  });

  if (!account) throw new Error("No Strava account found");

  // If expires_at is missing, force a refresh
  if (account.expires_at && account.expires_at * 1000 > Date.now()) {
    return account.access_token;
  }

  // Refresh token
  const response = await axios.post("https://www.strava.com/oauth/token", {
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: account.refresh_token,
  });

  const { access_token, refresh_token, expires_at } = response.data;

  // Update DB
  await prisma.account.update({
    where: { provider_providerAccountId: { provider: "strava", providerAccountId: account.providerAccountId } },
    data: { access_token, refresh_token, expires_at },
  });

  return access_token;
} 