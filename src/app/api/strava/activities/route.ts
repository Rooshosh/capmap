import { NextResponse } from "next/server";
import { getValidStravaAccessToken } from "@/strava";
import { auth } from "@/auth";
import { prisma } from '@/prisma';
import { NextRequest } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const accessToken = await getValidStravaAccessToken(session.user.id);

    // Fetch activities from Strava API
    const res = await fetch("https://www.strava.com/api/v3/athlete/activities", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ error }, { status: res.status });
    }

    const activities = await res.json();
    return NextResponse.json(activities);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

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

    // Fetch detailed activity from Strava API
    const res = await fetch(`https://www.strava.com/api/v3/activities/${activityId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ error }, { status: res.status });
    }

    const activity = await res.json();

    // Store in DB (upsert to avoid duplicates)
    const stored = await prisma.detailedActivity.upsert({
      where: { id: activity.id.toString() },
      update: { ...activity, id: activity.id.toString(), upload_id: activity.upload_id?.toString() },
      create: { ...activity, id: activity.id.toString(), upload_id: activity.upload_id?.toString() },
    });

    return NextResponse.json(stored);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
} 