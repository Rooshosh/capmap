import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import * as turf from "@turf/turf";
import concave from "@turf/concave";
import { ActivityTrack } from "@prisma/client/edge";
import rewind from '@turf/rewind';
// import { ActivityTrack } from "@prisma/client";

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
    const dist = haversine(latlngs[0], latlngs[latlngs.length - 1]);
    return dist < closeThreshold;
}

function flipLatLngs(latlngs: GPSTrack): GPSTrack {
    return latlngs.map(([lat, lng]) => [lng, lat]);
}

type GPSTrack = [number, number][];

export async function GET(/* req: NextRequest */) {
    const tracks = await prisma.activityTrack.findMany();
    const features = tracks
        .filter((track: ActivityTrack) => Array.isArray(track.track) && track.track.length > 3)
        .map((track: ActivityTrack) => track.track as GPSTrack)
        .filter(track => isLoop(track))
        .map(track => flipLatLngs(track))
        .map(track => {
            const points = turf.featureCollection(track.map(coord => turf.point(coord)));
            const hull = concave(points, { maxEdge: closeThreshold / 1000 });
            if (!hull) return null;
            let geometry = hull.geometry;
            if (geometry.type === "Polygon") {
                // Only keep the outer ring
                geometry = {
                    ...geometry,
                    coordinates: [geometry.coordinates[0]]
                };
            } else if (geometry.type === "MultiPolygon") {
                // Find the largest polygon by area
                let maxArea = 0;
                let largest = geometry.coordinates[0];
                for (const poly of geometry.coordinates) {
                    const polyGeom = turf.polygon([poly[0]]);
                    const polyArea = turf.area(polyGeom);
                    if (polyArea > maxArea) {
                        maxArea = polyArea;
                        largest = poly;
                    }
                }
                geometry = {
                    type: "Polygon",
                    coordinates: [largest[0]]
                };
            }
            // Ensure correct winding order
            const solid = rewind({ type: "Feature", geometry, properties: {} }, { reverse: false });
            return {
                type: "Feature",
                geometry: "geometry" in solid ? solid.geometry : solid,
                properties: { /* TODO: add activityId and/or similar*/ },
            };
        })
        .filter(Boolean);

    return NextResponse.json({
        type: "FeatureCollection",
        features,
    });
} 