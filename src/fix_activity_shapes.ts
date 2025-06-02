import "dotenv/config";
// @ts-expect-error: No type definitions for @markroland/concave-hull
import concaveHull from "@markroland/concave-hull";
import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

// Types
// [lat, lng] for DB, [lng, lat] for hull
// GPSTrack: [number, number][]
type GPSTrack = [number, number][];

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

const BATCH_SIZE = 10;

async function main() {
  const total = await prisma.activityTrack.count();
  console.log(`Found ${total} activity tracks to process.`);
  let processed = 0;
  let updated = 0;
  let skip = 0;
  while (skip < total) {
    const batch = await prisma.activityTrack.findMany({
      select: { id: true, activityId: true, track: true },
      orderBy: { id: "asc" },
      skip,
      take: BATCH_SIZE,
    });
    if (batch.length === 0) break;
    for (const row of batch) {
      processed++;
      const rawTrack = row.track as GPSTrack; // [lat, lng]
      let shape: GPSTrack | null = null;
      try {
        if (rawTrack.length > 3 && isLoop(rawTrack)) {
          const prepared = subsample(flipLatLngs(rawTrack), 500); // [lng, lat]
          const hullModule = concaveHull();
          const k = 3;
          shape = hullModule.calculate(prepared, k) as GPSTrack;
        }
        await prisma.activityTrack.update({
          where: { id: row.id },
          data: { shape: shape ?? Prisma.JsonNull },
        });
        updated++;
        if (processed % 10 === 0 || processed === total) {
          console.log(`Processed ${processed}/${total}...`);
        }
      } catch (err) {
        console.error(`Error processing activityTrack id=${row.id}, activityId=${row.activityId}:`, err);
      }
    }
    skip += BATCH_SIZE;
  }
  console.log(`Done. Updated ${updated} activity tracks with shapes.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Fatal error in script:", e);
  process.exit(1);
}); 