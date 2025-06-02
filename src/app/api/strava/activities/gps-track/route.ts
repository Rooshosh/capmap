import { NextRequest, NextResponse } from "next/server";
import { getValidStravaAccessToken } from "@/strava";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Prisma } from "@prisma/client";
// @ts-expect-error: No type definitions for @markroland/concave-hull
import concaveHull from "@markroland/concave-hull";

type GPSTrack = [number, number][]; // [lat, lng]

// Haversine distance in meters between two [lat, lng] points
function haversine([lat1, lng1]: [number, number], [lat2, lng2]: [number, number]) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const closeThreshold = 100; // meters

function isLoop(latlngs: GPSTrack): boolean {
  if (latlngs.length < 2) return false;
  const dist = haversine(latlngs[0], latlngs[latlngs.length - 1]);
  return dist < closeThreshold;
}

function flipLatLngs(latlngs: GPSTrack): GPSTrack {
  return latlngs.map(([lat, lng]) => [lng, lat]);
}

function subsample(points: GPSTrack, maxPoints: number): GPSTrack {
  if (points.length <= maxPoints) return points;
  const step = points.length / maxPoints;
  const result: GPSTrack = [];
  for (let i = 0; i < maxPoints; i++) {
    result.push(points[Math.floor(i * step)]);
  }
  return result;
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

    // Store GPS track (and precalculated shape) in ActivityTrack if latlng stream is present
    if (data && data.latlng && Array.isArray(data.latlng.data)) {
      const rawTrack = data.latlng.data as GPSTrack; // [lat, lng]
      const activityIdStr = activityId.toString();

      let shape: GPSTrack | null = null;
      try {
        if (rawTrack.length > 3 && isLoop(rawTrack)) {
          const prepared = subsample(flipLatLngs(rawTrack), 500); // [lng, lat]
          const hullModule = concaveHull();
          const k = 3;
          shape = hullModule.calculate(prepared, k) as GPSTrack;
        }
      } catch (err) {
        console.error("Failed to compute concave hull for activity", activityIdStr, err);
        shape = null;
      }

      await prisma.activityTrack.upsert({
        where: { activityId: activityIdStr },
        update: { track: rawTrack, shape: shape ?? Prisma.JsonNull },
        create: { activityId: activityIdStr, track: rawTrack, shape: shape ?? Prisma.JsonNull },
      });
    }

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
} 