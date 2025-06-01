import { prisma } from "@/prisma";
import { ActivityTrack, DetailedActivity } from "@prisma/client/edge";
import TestTurfGrid from "@/app/test-turf/TestTurfGrid";
import React from "react";

type TrackWithActivity = ActivityTrack & {
  activity?: Pick<DetailedActivity, "name" | "id">;
};

export default async function TestTurfPage() {
  // Fetch all tracks with related activity title
  const tracks: TrackWithActivity[] = await prisma.activityTrack.findMany({
    include: {
      activity: {
        select: { name: true, id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <TestTurfGrid tracks={tracks} />;
}

// --- RandomPointsCell.tsx (client component, to be created) ---
// - Accepts width, height as props
// - Implements random points, numPoints slider (1-1000), maxEdge slider (1-1000 meters, default 100), all logic client-side
//
// --- TrackCell.tsx (client component, to be created) ---
// - Accepts width, height, points, title as props
// - Implements maxEdge slider (1-1000 meters, default 100), hull logic client-side
// - Renders title and points 