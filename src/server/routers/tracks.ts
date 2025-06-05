import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { prisma } from '@/prisma';
import { Prisma } from '@prisma/client';

export type GeoJSONFeature = {
  type: "Feature";
  geometry: {
    type: "LineString" | "Polygon";
    coordinates: number[][];
  };
  properties: {
    activityId?: string;
    type?: string;
    user?: string | null;
    color?: string | null;
  };
};

export type GeoJSONFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
  rawCount?: number;
};

export const tracksRouter = router({
  // Get list of tracks with pagination
  list: protectedProcedure
    .input(z.object({
      skip: z.number().default(0),
      take: z.number().default(10),
    }))
    .query(async ({ input }) => {
      const tracks = await prisma.activityTrack.findMany({
        select: { track: true, activityId: true },
        skip: input.skip,
        take: input.take,
        orderBy: { id: 'desc' },
      });

      const features = tracks
        .filter(track => Array.isArray(track.track))
        .map(track => {
          const latlngs = track.track as [number, number][];
          if (latlngs.length < 2) return null;
          const coordinates = latlngs.map(([lat, lng]) => [lng, lat]);
          return {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates,
            },
            properties: { activityId: track.activityId, type: "line" },
          };
        })
        .filter(Boolean);

      return {
        type: "FeatureCollection",
        features,
        rawCount: tracks.length,
      } as GeoJSONFeatureCollection;
    }),

  // Get activity shapes
  getShapes: protectedProcedure
    .query(async () => {
      const rows = await prisma.activityTrack.findMany({
        where: { shape: { not: Prisma.JsonNull } },
        select: {
          shape: true,
          activity: {
            select: {
              fakeUser: {
                select: { name: true, color: true }
              }
            }
          }
        },
        orderBy: { id: "desc" },
      });

      const features = rows
        .filter(row => Array.isArray(row.shape) && row.shape.length > 0)
        .map(row => ({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [row.shape],
          },
          properties: {
            user: row.activity?.fakeUser?.name ?? null,
            color: row.activity?.fakeUser?.color ?? null,
          },
        }));

      return {
        type: "FeatureCollection",
        features,
      } as GeoJSONFeatureCollection;
    }),
}); 