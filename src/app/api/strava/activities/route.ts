import { NextResponse } from "next/server";
import { getValidStravaAccessToken } from "@/strava";
import { auth } from "@/auth";
import { prisma } from '@/prisma';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const accessToken = await getValidStravaAccessToken(session.user.id);

    // Read page and per_page from query params, with defaults
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '30';

    // Fetch activities from Strava API
    const stravaUrl = `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${per_page}`;
    const res = await fetch(stravaUrl, {
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
    const id = activity.id.toString();

    const stored = await prisma.detailedActivity.upsert({
      where: { id },
      update: {
        ...activity,
        id,
        upload_id: activity.upload_id ? activity.upload_id.toString() : undefined,
        upload_id_str: activity.upload_id_str ? activity.upload_id_str.toString() : undefined,
      },
      create: {
        ...activity,
        id,
        upload_id: activity.upload_id ? activity.upload_id.toString() : undefined,
        upload_id_str: activity.upload_id_str ? activity.upload_id_str.toString() : undefined,
      },
    });

    return NextResponse.json(stored);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
} 