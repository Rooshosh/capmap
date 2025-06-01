// @ts-expect-error: No type definitions for @markroland/concave-hull
import concaveHull from "@markroland/concave-hull";
import concave from "@turf/concave";
import { featureCollection, point } from "@turf/helpers";

export type HullAlgorithm = "markroland" | "turf";

export function getBounds(points: [number, number][]) {
  const lons = points.map(p => p[0]);
  const lats = points.map(p => p[1]);
  return {
    minLon: Math.min(...lons),
    maxLon: Math.max(...lons),
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
  };
}

export function Projector(points: [number, number][], width: number, height: number) {
  const { minLon, maxLon, minLat, maxLat } = getBounds(points);
  return {
    project: ([lon, lat]: [number, number]) => [
      ((lon - minLon) / (maxLon - minLon || 1)) * (width - 40) + 20,
      height - (((lat - minLat) / (maxLat - minLat || 1)) * (height - 40) + 20),
    ] as [number, number],
    unproject: ([x, y]: [number, number]) => [
      ((x - 20) / (width - 40)) * (maxLon - minLon || 1) + minLon,
      ((height - y - 20) / (height - 40)) * (maxLat - minLat || 1) + minLat,
    ] as [number, number],
  };
}

export function hullPathWithObject(
  points: [number, number][],
  k: number,
  project: (pt: [number, number]) => [number, number],
  algorithm: HullAlgorithm = "markroland"
) {
  if (!points.length) return { path: "", hull: null };
  let hull: [number, number][] | null = null;

  if (algorithm === "markroland") {
    const hullModule = concaveHull();
    hull = hullModule.calculate(points, k);
  } else if (algorithm === "turf") {
    // Turf expects GeoJSON features
    const fc = featureCollection(points.map(pt => point(pt)));
    // maxEdge is in kilometers for turf
    const maxEdge = k * 0.1; // scale k to something reasonable (tweak as needed)
    const turfHull = concave(fc, { maxEdge });
    if (turfHull && turfHull.geometry && turfHull.geometry.coordinates.length > 0) {
      hull = turfHull.geometry.coordinates[0] as [number, number][];
    }
  }

  let path = "";
  if (hull && hull.length > 0) {
    hull.forEach(([lon, lat]: [number, number], i: number) => {
      const [x, y] = project([lon, lat]);
      path += (i === 0 ? `M${x},${y}` : `L${x},${y}`);
    });
    path += "Z";
  }
  return { path, hull };
} 