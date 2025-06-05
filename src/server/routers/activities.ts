import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { prisma } from '@/prisma';
import { fetchStravaActivity, fetchStravaTrack } from '@/lib/strava';

export const activitiesRouter = router({
  // Get list of activities with pagination
  list: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      perPage: z.number().min(1).max(100).default(30),
    }))
    .query(async ({ ctx, input }) => {
      const { page, perPage } = input;
      const skip = (page - 1) * perPage;

      const activities = await fetchStravaActivity(skip, perPage);
      return activities;
    }),

  // Get imported activity IDs
  getImportedIds: protectedProcedure
    .query(async () => {
      const activities = await prisma.detailedActivity.findMany({
        select: { id: true },
      });
      return activities.map(a => a.id);
    }),

  // Get activity IDs that have tracks
  getIdsWithTrack: protectedProcedure
    .query(async () => {
      const activities = await prisma.detailedActivity.findMany({
        where: { ActivityTrack: { isNot: null } },
        select: { id: true },
      });
      return activities.map(a => a.id);
    }),

  // Import an activity
  import: protectedProcedure
    .input(z.object({
      activityId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { activityId } = input;
      const activity = await fetchStravaActivity(0, 1, activityId);
      
      if (!activity || activity.length === 0) {
        throw new Error('Activity not found');
      }

      const data = activity[0];
      await prisma.detailedActivity.create({
        data: {
          id: String(data.id),
          name: data.name,
          distance: data.distance,
          moving_time: data.moving_time,
          elapsed_time: data.elapsed_time,
          total_elevation_gain: data.total_elevation_gain,
          type: data.type,
          sport_type: data.type,
          start_date: new Date(data.start_date),
          start_date_local: new Date(data.start_date_local),
          timezone: data.timezone,
          utc_offset: data.utc_offset,
          location_city: data.location_city,
          location_state: data.location_state,
          location_country: data.location_country,
          achievement_count: data.achievement_count,
          kudos_count: data.kudos_count,
          comment_count: data.comment_count,
          athlete_count: data.athlete_count,
          photo_count: data.photo_count,
          total_photo_count: data.total_photo_count,
          map: data.map,
          trainer: data.trainer,
          commute: data.commute,
          manual: data.manual,
          private: data.private,
          visibility: data.visibility,
          flagged: data.flagged,
          gear_id: data.gear_id,
          start_latlng: data.start_latlng,
          end_latlng: data.end_latlng,
          average_speed: data.average_speed,
          max_speed: data.max_speed,
          has_heartrate: data.has_heartrate,
          average_heartrate: data.average_heartrate,
          max_heartrate: data.max_heartrate,
          elev_high: data.elev_high,
          elev_low: data.elev_low,
          upload_id: data.upload_id,
          upload_id_str: data.upload_id_str,
          external_id: data.external_id,
          from_accepted_tag: data.from_accepted_tag,
          pr_count: data.pr_count,
          has_kudoed: data.has_kudoed,
          suffer_score: data.suffer_score,
          athlete: data.athlete,
        },
      });
    }),

  // Fetch GPS track for an activity
  fetchTrack: protectedProcedure
    .input(z.object({
      activityId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { activityId } = input;
      const track = await fetchStravaTrack(activityId);
      
      if (!track) {
        throw new Error('Track not found');
      }

      await prisma.activityTrack.create({
        data: {
          activityId: String(activityId),
          track: track,
        },
      });
    }),
}); 