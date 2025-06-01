"use client";
import React, { useState } from "react";
import RandomPointsCell from "./RandomPointsCell";
import TrackCell from "./TrackCell";
import { ActivityTrack, DetailedActivity } from "@prisma/client/edge";
import type { HullAlgorithm } from "./geoUtils";

const width = 500;
const height = 500;

type TrackWithActivity = ActivityTrack & {
  activity?: Pick<DetailedActivity, "name" | "id">;
};

type Props = {
  tracks: TrackWithActivity[];
};

export default function TestTurfGrid({ tracks }: Props) {
  const [algorithm, setAlgorithm] = useState<HullAlgorithm>("markroland");
  return (
    <div style={{ padding: 24, colorScheme: 'light dark', background: 'var(--background, Canvas)', color: 'var(--foreground, CanvasText)' }}>
      <h1 style={{ color: 'var(--foreground, CanvasText)' }}>Test Turf.js Concave (Grid: Random + GPS Tracks)</h1>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 500, marginRight: 8 }}>Hull Algorithm:</label>
        <select value={algorithm} onChange={e => setAlgorithm(e.target.value as HullAlgorithm)} style={{ fontSize: 16, padding: '4px 8px' }}>
          <option value="markroland">@markroland/concave-hull</option>
          <option value="turf">Turf.js concave</option>
        </select>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(520px, 1fr))",
          gap: 24,
        }}
      >
        <RandomPointsCell width={width} height={height} algorithm={algorithm} />
        {tracks.map((track) => (
          <TrackCell
            key={track.id}
            width={width}
            height={height}
            points={track.track as [number, number][]}
            title={track.activity?.name || track.activityId}
            algorithm={algorithm}
          />
        ))}
      </div>
    </div>
  );
} 