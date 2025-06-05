/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { paths_1activities_post_responses_201_schema } from '../models/paths_1activities_post_responses_201_schema';
import type { paths_1athlete_1activities_get_responses_200_schema_items } from '../models/paths_1athlete_1activities_get_responses_200_schema_items';
import type { paths_1athlete_1activities_get_responses_200_schema_items_allOf_0 } from '../models/paths_1athlete_1activities_get_responses_200_schema_items_allOf_0';
import type { paths_1athlete_1clubs_get_responses_200_schema_items_allOf_1_properties_activity_types_items } from '../models/paths_1athlete_1clubs_get_responses_200_schema_items_allOf_1_properties_activity_types_items';
import type { paths_1athlete_1zones_get_responses_200_schema_properties_power_properties_zones_items } from '../models/paths_1athlete_1zones_get_responses_200_schema_properties_power_properties_zones_items';
import type { paths_1athlete_get_responses_default_schema } from '../models/paths_1athlete_get_responses_default_schema';
import type { paths_1clubs_1_id_1admins_get_responses_200_schema_items } from '../models/paths_1clubs_1_id_1admins_get_responses_200_schema_items';
import type { paths_1clubs_1_id_1admins_get_responses_200_schema_items_allOf_0 } from '../models/paths_1clubs_1_id_1admins_get_responses_200_schema_items_allOf_0';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ActivitiesService {
  /**
   * Create an Activity
   * Creates a manual activity for an athlete, requires activity:write scope.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @returns any The activity's detailed representation.
   * @throws ApiError
   */
  public static createActivity({
    name,
    sportType,
    startDateLocal,
    elapsedTime,
    type,
    description,
    distance,
    trainer,
    commute,
  }: {
    /**
     * The name of the activity.
     */
    name: string,
    /**
     * Sport type of activity. For example - Run, MountainBikeRide, Ride, etc.
     */
    sportType: string,
    /**
     * ISO 8601 formatted date time.
     */
    startDateLocal: string,
    /**
     * In seconds.
     */
    elapsedTime: number,
    /**
     * Type of activity. For example - Run, Ride etc.
     */
    type?: string,
    /**
     * Description of the activity.
     */
    description?: string,
    /**
     * In meters.
     */
    distance?: number,
    /**
     * Set to 1 to mark as a trainer activity.
     */
    trainer?: number,
    /**
     * Set to 1 to mark as commute.
     */
    commute?: number,
  }): CancelablePromise<paths_1athlete_get_responses_default_schema | paths_1athlete_1activities_get_responses_200_schema_items> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/activities',
      formData: {
        'name': name,
        'type': type,
        'sport_type': sportType,
        'start_date_local': startDateLocal,
        'elapsed_time': elapsedTime,
        'description': description,
        'distance': distance,
        'trainer': trainer,
        'commute': commute,
      },
    });
  }
  /**
   * Get Activity
   * Returns the given activity that is owned by the authenticated athlete. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.
   * @returns paths_1activities_post_responses_201_schema The activity's detailed representation.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getActivityById({
    id,
    includeAllEfforts,
  }: {
    /**
     * The identifier of the activity.
     */
    id: number,
    /**
     * To include all segments efforts.
     */
    includeAllEfforts?: boolean,
  }): CancelablePromise<paths_1activities_post_responses_201_schema | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/activities/{id}',
      path: {
        'id': id,
      },
      query: {
        'include_all_efforts': includeAllEfforts,
      },
    });
  }
  /**
   * Update Activity
   * Updates the given activity that is owned by the authenticated athlete. Requires activity:write. Also requires activity:read_all in order to update Only Me activities
   * @returns paths_1activities_post_responses_201_schema The activity's detailed representation.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static updateActivityById({
    id,
    body,
  }: {
    /**
     * The identifier of the activity.
     */
    id: number,
    body?: {
      /**
       * Whether this activity is a commute
       */
      commute?: boolean;
      /**
       * Whether this activity was recorded on a training machine
       */
      trainer?: boolean;
      /**
       * Whether this activity is muted
       */
      hide_from_home?: boolean;
      /**
       * The description of the activity
       */
      description?: string;
      /**
       * The name of the activity
       */
      name?: string;
      /**
       * Deprecated. Prefer to use sport_type. In a request where both type and sport_type are present, this field will be ignored
       */
      type?: paths_1athlete_1clubs_get_responses_200_schema_items_allOf_1_properties_activity_types_items;
      /**
       * An enumeration of the sport types an activity may have. Distinct from ActivityType in that it has new types (e.g. MountainBikeRide)
       */
      sport_type?: 'AlpineSki' | 'BackcountrySki' | 'Badminton' | 'Canoeing' | 'Crossfit' | 'EBikeRide' | 'Elliptical' | 'EMountainBikeRide' | 'Golf' | 'GravelRide' | 'Handcycle' | 'HighIntensityIntervalTraining' | 'Hike' | 'IceSkate' | 'InlineSkate' | 'Kayaking' | 'Kitesurf' | 'MountainBikeRide' | 'NordicSki' | 'Pickleball' | 'Pilates' | 'Racquetball' | 'Ride' | 'RockClimbing' | 'RollerSki' | 'Rowing' | 'Run' | 'Sail' | 'Skateboard' | 'Snowboard' | 'Snowshoe' | 'Soccer' | 'Squash' | 'StairStepper' | 'StandUpPaddling' | 'Surfing' | 'Swim' | 'TableTennis' | 'Tennis' | 'TrailRun' | 'Velomobile' | 'VirtualRide' | 'VirtualRow' | 'VirtualRun' | 'Walk' | 'WeightTraining' | 'Wheelchair' | 'Windsurf' | 'Workout' | 'Yoga';
      /**
       * Identifier for the gear associated with the activity. ‘none’ clears gear from activity
       */
      gear_id?: string;
    },
  }): CancelablePromise<paths_1activities_post_responses_201_schema | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/activities/{id}',
      path: {
        'id': id,
      },
      body: body,
    });
  }
  /**
   * List Athlete Activities
   * Returns the activities of an athlete for a specific identifier. Requires activity:read. Only Me activities will be filtered out unless requested by a token with activity:read_all.
   * @returns any The authenticated athlete's activities
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getLoggedInAthleteActivities({
    before,
    after,
    page,
    perPage = 30,
  }: {
    /**
     * An epoch timestamp to use for filtering activities that have taken place before a certain time.
     */
    before?: number,
    /**
     * An epoch timestamp to use for filtering activities that have taken place after a certain time.
     */
    after?: number,
    /**
     * Page number. Defaults to 1.
     */
    page?: number,
    /**
     * Number of items per page. Defaults to 30.
     */
    perPage?: number,
  }): CancelablePromise<Array<{
    /**
     * The unique identifier of the activity
     */
    id?: number;
  }> | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/athlete/activities',
      query: {
        'before': before,
        'after': after,
        'page': page,
        'per_page': perPage,
      },
    });
  }
  /**
   * List Activity Laps
   * Returns the laps of an activity identified by an identifier. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.
   * @returns any Activity Laps.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getLapsByActivityId({
    id,
  }: {
    /**
     * The identifier of the activity.
     */
    id: number,
  }): CancelablePromise<Array<{
    /**
     * The unique identifier of this lap
     */
    id?: number;
    activity?: paths_1athlete_1activities_get_responses_200_schema_items_allOf_0;
    athlete?: paths_1clubs_1_id_1admins_get_responses_200_schema_items_allOf_0;
    /**
     * The lap's average cadence
     */
    average_cadence?: number;
    /**
     * The lap's average speed
     */
    average_speed?: number;
    /**
     * The lap's distance, in meters
     */
    distance?: number;
    /**
     * The lap's elapsed time, in seconds
     */
    elapsed_time?: number;
    /**
     * The start index of this effort in its activity's stream
     */
    start_index?: number;
    /**
     * The end index of this effort in its activity's stream
     */
    end_index?: number;
    /**
     * The index of this lap in the activity it belongs to
     */
    lap_index?: number;
    /**
     * The maximum speed of this lat, in meters per second
     */
    max_speed?: number;
    /**
     * The lap's moving time, in seconds
     */
    moving_time?: number;
    /**
     * The name of the lap
     */
    name?: string;
    /**
     * The athlete's pace zone during this lap
     */
    pace_zone?: number;
    split?: number;
    /**
     * The time at which the lap was started.
     */
    start_date?: string;
    /**
     * The time at which the lap was started in the local timezone.
     */
    start_date_local?: string;
    /**
     * The elevation gain of this lap, in meters
     */
    total_elevation_gain?: number;
  }> | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/activities/{id}/laps',
      path: {
        'id': id,
      },
    });
  }
  /**
   * Get Activity Zones
   * Summit Feature. Returns the zones of a given activity. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.
   * @returns any Activity Zones.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getZonesByActivityId({
    id,
  }: {
    /**
     * The identifier of the activity.
     */
    id: number,
  }): CancelablePromise<Array<{
    score?: number;
    /**
     * Stores the exclusive ranges representing zones and the time spent in each.
     */
    distribution_buckets?: Array<paths_1athlete_1zones_get_responses_200_schema_properties_power_properties_zones_items>;
    type?: 'heartrate' | 'power';
    sensor_based?: boolean;
    points?: number;
    custom_zones?: boolean;
    max?: number;
  }> | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/activities/{id}/zones',
      path: {
        'id': id,
      },
    });
  }
  /**
   * List Activity Comments
   * Returns the comments on the given activity. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.
   * @returns any Comments.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getCommentsByActivityId({
    id,
    page,
    perPage = 30,
    pageSize = 30,
    afterCursor,
  }: {
    /**
     * The identifier of the activity.
     */
    id: number,
    /**
     * Deprecated. Prefer to use after_cursor.
     */
    page?: number,
    /**
     * Deprecated. Prefer to use page_size.
     */
    perPage?: number,
    /**
     * Number of items per page. Defaults to 30.
     */
    pageSize?: number,
    /**
     * Cursor of the last item in the previous page of results, used to request the subsequent page of results.  When omitted, the first page of results is fetched.
     */
    afterCursor?: string,
  }): CancelablePromise<Array<{
    /**
     * The unique identifier of this comment
     */
    id?: number;
    /**
     * The identifier of the activity this comment is related to
     */
    activity_id?: number;
    /**
     * The content of the comment
     */
    text?: string;
    athlete?: paths_1clubs_1_id_1admins_get_responses_200_schema_items;
    /**
     * The time at which this comment was created.
     */
    created_at?: string;
  }> | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/activities/{id}/comments',
      path: {
        'id': id,
      },
      query: {
        'page': page,
        'per_page': perPage,
        'page_size': pageSize,
        'after_cursor': afterCursor,
      },
    });
  }
  /**
   * List Activity Kudoers
   * Returns the athletes who kudoed an activity identified by an identifier. Requires activity:read for Everyone and Followers activities. Requires activity:read_all for Only Me activities.
   * @returns paths_1clubs_1_id_1admins_get_responses_200_schema_items Comments.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getKudoersByActivityId({
    id,
    page,
    perPage = 30,
  }: {
    /**
     * The identifier of the activity.
     */
    id: number,
    /**
     * Page number. Defaults to 1.
     */
    page?: number,
    /**
     * Number of items per page. Defaults to 30.
     */
    perPage?: number,
  }): CancelablePromise<Array<paths_1clubs_1_id_1admins_get_responses_200_schema_items> | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/activities/{id}/kudos',
      path: {
        'id': id,
      },
      query: {
        'page': page,
        'per_page': perPage,
      },
    });
  }
}
