"use client";
import React, { useState, useEffect, useRef } from "react";
import RandomPointsCell from "./RandomPointsCell";
import TrackCell from "./TrackCell";
import { ActivityTrack, DetailedActivity } from "@prisma/client/edge";
import type { HullAlgorithm } from "./geoUtils";

type TrackWithActivity = ActivityTrack & {
  activity?: Pick<DetailedActivity, "name" | "id">;
};

export default function TestTurfGrid() {
  const [algorithm, setAlgorithm] = useState<HullAlgorithm>("markroland");
  const [tracks, setTracks] = useState<TrackWithActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const batchSize = 8;
  const gridRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(400);

  // Responsive cell size calculation
  useEffect(() => {
    function updateCellSize() {
      if (gridRef.current) {
        const width = gridRef.current.offsetWidth;
        const columns = window.innerWidth >= 900 ? 3 : 1;
        const gap = 24 * (columns - 1);
        const size = Math.floor((width - gap) / columns);
        setCellSize(size > 0 ? size : 400);
      }
    }
    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, []);

  async function fetchTracks(skip: number, take: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/test-turf-tracks?skip=${skip}&take=${take}`);
      if (!res.ok) throw new Error(`Failed to fetch tracks: ${res.statusText}`);
      const data = await res.json();
      setTracks(prev => [...prev, ...data.tracks]);
      setHasMore(data.tracks.length === take);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Unknown error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTracks(0, batchSize);
  }, []);

  const handleLoadMore = () => {
    fetchTracks(tracks.length, batchSize);
  };

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
      {error && <div style={{ color: 'red', marginBottom: 8 }}>Error: {error}</div>}
      <div
        ref={gridRef}
        className="test-turf-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(1, 1fr)",
          gap: 24,
        }}
      >
        <RandomPointsCell width={cellSize} height={cellSize} algorithm={algorithm} />
        {tracks.map((track) => (
          <TrackCell
            key={track.id}
            width={cellSize}
            height={cellSize}
            points={track.track as [number, number][]}
            title={track.activity?.name || track.activityId}
            algorithm={algorithm}
          />
        ))}
      </div>
      {hasMore && (
        <button onClick={handleLoadMore} disabled={loading} style={{ marginTop: 24, fontSize: 18, padding: '8px 24px' }}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
      <style jsx global>{`
        @media (min-width: 900px) {
          .test-turf-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  );
} 