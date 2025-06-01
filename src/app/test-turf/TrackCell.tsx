"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Projector, hullPathWithObject } from "./geoUtils";
import type { HullAlgorithm } from "./geoUtils";

type Props = {
  width: number;
  height: number;
  points: [number, number][];
  title: string;
  algorithm?: HullAlgorithm;
};

export default function TrackCell({ width, height, points, title, algorithm = "markroland" }: Props) {
  const [scaleDown, setScaleDown] = useState(1); // 1 = all points, 100 = every 100th point
  const [param, setParam] = useState(algorithm === "turf" ? 100 : 3);
  const [showHull, setShowHull] = useState(false);
  const [hullPath, setHullPath] = useState("");
  const [hull, setHull] = useState<[number, number][] | null>(null);

  // Reset param when algorithm changes
  useEffect(() => {
    setParam(algorithm === "turf" ? 100 : 3);
  }, [algorithm]);

  // Subsampled points for display and hull calculation
  const scaledPoints = useMemo(() => {
    if (scaleDown <= 1) return points;
    return points.filter((_, i) => i % scaleDown === 0);
  }, [points, scaleDown]);

  const { project } = useMemo(() => Projector(scaledPoints, width, height), [scaledPoints, width, height]);

  // Only recalculate hull when button is pressed (markroland) or auto (turf)
  const regenerateHull = () => {
    const value = algorithm === "turf" ? Math.max(1, param) : Math.max(3, Math.floor(param));
    const { path, hull } = hullPathWithObject(
      scaledPoints,
      value,
      (pt) => project(pt) as [number, number],
      algorithm
    );
    setHullPath(path);
    setHull(hull);
  };

  // Auto-regenerate for Turf
  useEffect(() => {
    if (algorithm === "turf") {
      regenerateHull();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm, scaledPoints, param, project]);

  // return <div style={{ background: '#222', color: '#fff', padding: 24 }}>TrackCell minimal test: width={width}, height={height}</div>;

  return (
    <div style={{ background: 'var(--cell-bg, rgb(30 30 30 / 0.9))', borderRadius: 12, boxShadow: "0 2px 8px #0003", padding: 12, border: '1px solid var(--border, #333)' }}>
      <h2 style={{ color: 'var(--foreground, CanvasText)' }}>{title}</h2>
      <div style={{ color: 'var(--foreground, CanvasText)', marginBottom: 8 }}>Points: {points.length}</div>
      <div style={{ color: 'var(--foreground, CanvasText)', marginBottom: 8 }}>Scaled down: {scaleDown}x ({scaledPoints.length} points used)</div>
      <div style={{ margin: "16px 0" }}>
        <label style={{ color: 'var(--foreground, CanvasText)', marginRight: 16 }}>
          Scaled down:
          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={scaleDown}
            onChange={e => setScaleDown(Number(e.target.value))}
            style={{ width: 120, margin: "0 8px" }}
          />
          <span>{scaleDown}x</span>
        </label>
        <label style={{ color: 'var(--foreground, CanvasText)' }}>
          {algorithm === "turf" ? "maxEdge (meters):" : "k (concavity):"}
          <input
            type="range"
            min={algorithm === "turf" ? 1 : 3}
            max={algorithm === "turf" ? 1000 : Math.max(3, scaledPoints.length)}
            step={1}
            value={param}
            onChange={e => setParam(Number(e.target.value))}
            style={{ width: 120, margin: "0 8px" }}
            disabled={algorithm === "turf" ? false : scaledPoints.length < 3}
          />
          <span>{param}</span>
        </label>
        {algorithm !== "turf" && (
          <button
            style={{
              marginLeft: 16,
              background: 'var(--button-bg, #22c55e)',
              color: 'var(--button-fg, #fff)',
              border: 'none',
              borderRadius: 6,
              padding: '8px 16px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
            onClick={regenerateHull}
          >
            Regenerate hull
          </button>
        )}
      </div>
      <svg width={width} height={height} style={{ border: "1px solid var(--border, #333)", background: 'var(--svg-bg, #18181b)' }}>
        {/* Draw concave hull */}
        {hullPath ? (
          <path d={hullPath} fill="var(--hull-fill, #e6394622)" stroke="var(--hull-stroke, #e63946)" strokeWidth={2} />
        ) : (
          <text x="20" y="40" fill="var(--error, #f87171)">No concave hull generated</text>
        )}
        {/* Draw points */}
        {scaledPoints.map(([lon, lat], i) => {
          const [x, y] = project([lon, lat]) as [number, number];
          return <circle key={i} cx={x} cy={y} r={4} fill="var(--point-fill, #60a5fa)" />;
        })}
      </svg>
      {hull && (
        <div style={{ marginTop: 12 }}>
          <button onClick={() => setShowHull(v => !v)} style={{ cursor: 'pointer', background: 'var(--button-bg, #18181b)', color: 'var(--button-fg, #fff)', border: '1px solid var(--border, #333)', borderRadius: 4, padding: '4px 12px', fontSize: 14 }}>
            {showHull ? 'Hide' : 'Show'} hull object
          </button>
          {showHull && (
            <pre style={{ marginTop: 8, maxHeight: 200, overflow: 'auto', background: '#222', color: '#fff', fontSize: 12, borderRadius: 4, padding: 8 }}>
              {JSON.stringify(hull, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
} 