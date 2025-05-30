import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET() {
  try {
    const tracks = await prisma.activityTrack.findMany({ select: { activityId: true } });
    const ids = tracks.map(t => t.activityId);
    return NextResponse.json(ids);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
} 