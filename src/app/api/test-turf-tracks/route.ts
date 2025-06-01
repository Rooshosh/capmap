import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const skip = parseInt(searchParams.get("skip") || "0", 10);
  const take = parseInt(searchParams.get("take") || "20", 10);
  const tracks = await prisma.activityTrack.findMany({
    include: {
      activity: {
        select: { name: true, id: true },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });
  return NextResponse.json({ tracks });
} 