import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET(req: NextRequest) {
  const tracks = await prisma.activityTrack.findMany();
  const features = tracks
    .filter(track => Array.isArray(track.track))
    .map(track => {
      const latlngs = track.track as [number, number][];
      if (latlngs.length < 2) return null;
      const coordinates = latlngs.map(([lat, lng]) => [lng, lat]);
      return {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates,
        },
        properties: { activityId: track.activityId, type: "line" },
      };
    })
    .filter(Boolean);
  return NextResponse.json({
    type: "FeatureCollection",
    features,
  });
} 