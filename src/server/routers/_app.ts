import { router } from '../trpc';
import { activitiesRouter } from './activities';
import { tracksRouter } from './tracks';
import type { GeoJSONFeatureCollection } from './tracks';

// Define the activity preview type
export type ActivityPreviewType = {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  start_date: string;
  start_date_local: string;
  imported?: boolean;
};

export const appRouter = router({
  activities: activitiesRouter,
  tracks: tracksRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

// This type will be used to infer the return types of our procedures
export type RouterOutputs = {
  activities: {
    list: ActivityPreviewType[];
    getImportedIds: string[];
    getIdsWithTrack: string[];
  };
  tracks: {
    list: GeoJSONFeatureCollection;
    getShapes: GeoJSONFeatureCollection;
  };
}; 