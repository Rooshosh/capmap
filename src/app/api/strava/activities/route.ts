import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from '@/prisma';
import { NextRequest } from 'next/server';
import { ActivitiesService } from '@/lib/strava-client/generated/services/ActivitiesService';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Read page and per_page from query params, with defaults
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '30';

    // Fetch activities using the generated client
    const activities = await ActivitiesService.getLoggedInAthleteActivities({ page: Number(page), perPage: Number(per_page) });
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

    // Fetch detailed activity using the generated client
    const activity = await ActivitiesService.getActivityById({ id: activityId });

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