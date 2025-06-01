import TestTurfGrid from "@/app/test-turf/TestTurfGrid";
import React from "react";

export default function TestTurfPage() {
  return <TestTurfGrid />;
}

// --- RandomPointsCell.tsx (client component, to be created) ---
// - Accepts width, height as props
// - Implements random points, numPoints slider (1-1000), maxEdge slider (1-1000 meters, default 100), all logic client-side
//
// --- TrackCell.tsx (client component, to be created) ---
// - Accepts width, height, points, title as props
// - Implements maxEdge slider (1-1000 meters, default 100), hull logic client-side
// - Renders title and points 