import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma";
// import { ActivityTrack } from "@prisma/client/edge";
// @ts-expect-error: No type definitions for @markroland/concave-hull
import concaveHull from "@markroland/concave-hull";
// import * as turf from "@turf/turf";
// import concave from "@turf/concave";
// import rewind from '@turf/rewind';
//import { featureCollection, point } from "@turf/turf";
// import concaveman from "concaveman";
// import concaveman from "@/lib/concaveman-wrapper";
// import concaveman from "concaveman";

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

function subsample(points: [number, number][], maxPoints: number): [number, number][] {
    if (points.length <= maxPoints) return points;
    const step = points.length / maxPoints;
    const result: [number, number][] = [];
    for (let i = 0; i < maxPoints; i++) {
        result.push(points[Math.floor(i * step)]);
    }
    return result;
}

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const take = parseInt(searchParams.get('take') || '10', 10);
    const tracks = await prisma.activityTrack.findMany({
        select: { track: true },
        skip,
        take,
        orderBy: { id: 'desc' },
    });
    const features = tracks
        .filter((track) => Array.isArray(track.track) && track.track.length > 3)
        .map((track) => track.track as GPSTrack)
        .filter(track => isLoop(track))
        .map(track => flipLatLngs(track))
        .map(track => subsample(track, 500))
        .toReversed()
        .map(track => {
            const hullModule = concaveHull();
            const k = 3; // Sensible default for concavity
            const hull = hullModule.calculate(track, k);
            return {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [hull]
                },
            };
        });

    return NextResponse.json({
        type: "FeatureCollection",
        features,
        rawCount: tracks.length,
    });
}
                

/*
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
                return {
                    type: "Feature",
                    // geometry: "geometry" in solid ? solid.geometry : solid,
                    geometry,
                    properties: {  },
                };
            }
            // Ensure correct winding order
            // const solid = rewind({ type: "Feature", geometry, properties: {} }, { reverse: false });
            
        })
} 
*/