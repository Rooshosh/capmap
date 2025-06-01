"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Projector, hullPathWithObject } from "./geoUtils";
import type { HullAlgorithm } from "./geoUtils";

type Props = { width: number; height: number; algorithm?: HullAlgorithm };

function generateRandomPoints(count = 20, bbox = [6.515, 43.275, 6.525, 43.285]): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const lon = Math.random() * (bbox[2] - bbox[0]) + bbox[0];
    const lat = Math.random() * (bbox[3] - bbox[1]) + bbox[1];
    points.push([lon, lat]);
  }
  return points;
}

// Helper to get SVG path for a polygon or ring
function getPolygonPath(coords: [number, number][][], project: (pt: [number, number]) => [number, number]) {
  let path = "";
  coords.forEach(ring => {
    ring.forEach(([lon, lat], i) => {
      const [x, y] = project([lon, lat]);
      path += (i === 0 ? `M${x},${y}` : `L${x},${y}`);
    });
    path += "Z";
  });
  return path;
}

export default function RandomPointsCell({ width, height, algorithm = "markroland" }: Props) {
    console.log("RandomPointsCell rendered");
    
  const [numPoints, setNumPoints] = useState(20);
  const [points, setPoints] = useState<[number, number][]>([]);
  const [param, setParam] = useState(algorithm === "turf" ? 100 : 3);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<[number, number] | null>(null);
  const [showHull, setShowHull] = useState(false);
  const [hullPath, setHullPath] = useState("");
  const [hull, setHull] = useState<[number, number][] | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setParam(algorithm === "turf" ? 100 : 3);
  }, [algorithm]);

  useEffect(() => {
    setPoints(generateRandomPoints(numPoints));
  }, [numPoints]);

  const { project, unproject } = useMemo(() => Projector(points, width, height), [points, width, height]);

  // When the slider changes, generate new random points
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNum = Number(e.target.value);
    setNumPoints(newNum);
    setPoints(generateRandomPoints(newNum));
  };

  // Only recalculate hull when button is pressed (markroland) or auto (turf)
  const regenerateHull = () => {
    const value = algorithm === "turf" ? Math.max(1, param) : Math.max(3, Math.floor(param));
    const { path, hull } = hullPathWithObject(points, value, (pt) => project(pt) as [number, number], algorithm);
    setHullPath(path);
    setHull(hull);
  };

  // Auto-regenerate for Turf
  useEffect(() => {
    if (algorithm === "turf") {
      regenerateHull();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm, points, param, project]);

  function onPointerDown(e: React.PointerEvent, idx: number) {
    e.preventDefault();
    setDragIndex(idx);
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    const ptVal = points[idx];
    if (!ptVal || ptVal.length !== 2) {
      console.warn("Invalid point encountered in drag handler:", ptVal, "at index", idx);
      return;
    }
    const [px, py] = project(ptVal as [number, number]);
    setDragOffset([cursor.x - px, cursor.y - py]);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }
  function onPointerMove(e: PointerEvent) {
    if (dragIndex === null) return;
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    const offset = dragOffset || [0, 0];
    const [x, y] = [cursor.x - offset[0], cursor.y - offset[1]];
    const geo = unproject([x, y]);
    setPoints(pts => (pts.map((p, i) => (i === dragIndex ? geo : p)) as [number, number][]));
  }
  function onPointerUp() {
    setDragIndex(null);
    setDragOffset(null);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }
  function onSvgClick(e: React.MouseEvent) {
    if (e.target instanceof SVGCircleElement) return;
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    const geo = unproject([cursor.x, cursor.y]);
    setPoints(pts => ([...pts, geo] as [number, number][]));
  }
  function onPointClick(e: React.MouseEvent, idx: number) {
    if (e.type === "contextmenu" || e.shiftKey) {
      e.preventDefault();
      setPoints(pts => (pts.filter((_, i) => i !== idx) as [number, number][]));
    }
  }

  return (
    <div style={{ background: 'var(--cell-bg, rgb(30 30 30 / 0.9))', borderRadius: 12, boxShadow: "0 2px 8px #0003", padding: 12, border: '1px solid var(--border, #333)' }}>
      <h2 style={{ color: 'var(--foreground, CanvasText)' }}>Random Points</h2>
      <div style={{ margin: "16px 0" }}>
        <label style={{ color: 'var(--foreground, CanvasText)', marginRight: 16 }}>
          Number of points:
          <input
            type="range"
            min={1}
            max={1000}
            step={1}
            value={numPoints}
            onChange={handleSliderChange}
            style={{ width: 120, margin: "0 8px" }}
          />
          <span>{numPoints}</span>
        </label>
        <label style={{ color: 'var(--foreground, CanvasText)' }}>
          {algorithm === "turf" ? "maxEdge (meters):" : "k (concavity):"}
          <input
            type="range"
            min={algorithm === "turf" ? 1 : 3}
            max={algorithm === "turf" ? 1000 : Math.max(3, points.length)}
            step={1}
            value={param}
            onChange={e => setParam(Number(e.target.value))}
            style={{ width: 120, margin: "0 8px" }}
            disabled={algorithm === "turf" ? false : points.length < 3}
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
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ border: "1px solid var(--border, #333)", touchAction: "none", cursor: dragIndex !== null ? "grabbing" : "pointer", background: 'var(--svg-bg, #18181b)' }}
        onClick={onSvgClick}
      >
        {/* Draw concave hull */}
        {points.length === 0 ? (
          <text x="20" y="40" fill="var(--error, #f87171)">Generating random points…</text>
        ) : hullPath ? (
          <path d={hullPath} fill="var(--hull-fill, #e6394622)" stroke="var(--hull-stroke, #e63946)" strokeWidth={2} />
        ) : (
          <text x="20" y="40" fill="var(--error, #f87171)">No concave hull generated</text>
        )}
        {/* Draw points */}
        {points.map(([lon, lat], i) => {
          const [x, y] = project([lon, lat]);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={8}
              fill="var(--point-fill, #60a5fa)"
              stroke="var(--point-stroke, #fff)"
              strokeWidth={2}
              style={{ cursor: "grab" }}
              onPointerDown={e => onPointerDown(e, i)}
              onClick={e => onPointClick(e, i)}
              onContextMenu={e => onPointClick(e, i)}
            />
          );
        })}
      </svg>
      <button style={{ marginTop: 16, background: 'var(--button-bg, #2563eb)', color: 'var(--button-fg, #fff)', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }} onClick={() => setPoints(generateRandomPoints(numPoints))}>Regenerate random points</button>
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