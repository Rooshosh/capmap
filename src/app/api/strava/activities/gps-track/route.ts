import { NextRequest, NextResponse } from "next/server";
import { getValidStravaAccessToken } from "@/strava";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { activityId } = await req.json();
    if (!activityId) {
      return NextResponse.json({ error: "Missing activityId" }, { status: 400 });
    }

    const accessToken = await getValidStravaAccessToken(session.user.id);

    // Fetch GPS stream from Strava
    const url = `https://www.strava.com/api/v3/activities/${activityId}/streams?keys=latlng&key_by_type=true`;
    const stravaRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!stravaRes.ok) {
      const error = await stravaRes.json();
      return NextResponse.json({ error: error.message || "Failed to fetch activity streams from Strava" }, { status: stravaRes.status });
    }

    const data = await stravaRes.json();

    // Store GPS track in ActivityTrack if latlng stream is present
    if (data && data.latlng && Array.isArray(data.latlng.data)) {
      const activityIdStr = activityId.toString();
      await prisma.activityTrack.upsert({
        where: { activityId: activityIdStr },
        update: { track: data.latlng.data },
        create: { activityId: activityIdStr, track: data.latlng.data },
      });
    }

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
} 