/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { paths_1athlete_get_responses_default_schema } from '../models/paths_1athlete_get_responses_default_schema';
import type { paths_1segment_efforts_1_id_get_responses_200_schema_allOf_0 } from '../models/paths_1segment_efforts_1_id_get_responses_200_schema_allOf_0';
import type { paths_1segments_1_id_get_responses_200_schema } from '../models/paths_1segments_1_id_get_responses_200_schema';
import type { paths_1segments_1starred_get_responses_200_schema_items } from '../models/paths_1segments_1starred_get_responses_200_schema_items';
import type { paths_1segments_1starred_get_responses_200_schema_items_properties_end_latlng } from '../models/paths_1segments_1starred_get_responses_200_schema_items_properties_end_latlng';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SegmentsService {
  /**
   * Get Segment
   * Returns the specified segment. read_all scope required in order to retrieve athlete-specific segment information, or to retrieve private segments.
   * @returns any Representation of a segment.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getSegmentById({
    id,
  }: {
    /**
     * The identifier of the segment.
     */
    id: number,
  }): CancelablePromise<paths_1segments_1starred_get_responses_200_schema_items | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/segments/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * List Starred Segments
   * List of the authenticated athlete's starred segments. Private segments are filtered out unless requested by a token with read_all scope.
   * @returns any List of the authenticated athlete's starred segments.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getLoggedInAthleteStarredSegments({
    page,
    perPage = 30,
  }: {
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
     * The unique identifier of this segment
     */
    id?: number;
    /**
     * The name of this segment
     */
    name?: string;
    activity_type?: 'Ride' | 'Run';
    /**
     * The segment's distance, in meters
     */
    distance?: number;
    /**
     * The segment's average grade, in percents
     */
    average_grade?: number;
    /**
     * The segments's maximum grade, in percents
     */
    maximum_grade?: number;
    /**
     * The segments's highest elevation, in meters
     */
    elevation_high?: number;
    /**
     * The segments's lowest elevation, in meters
     */
    elevation_low?: number;
    start_latlng?: paths_1segments_1starred_get_responses_200_schema_items_properties_end_latlng;
    /**
     * A pair of latitude/longitude coordinates, represented as an array of 2 floating point numbers.
     */
    end_latlng?: Array<number>;
    /**
     * The category of the climb [0, 5]. Higher is harder ie. 5 is Hors catégorie, 0 is uncategorized in climb_category.
     */
    climb_category?: number;
    /**
     * The segments's city.
     */
    city?: string;
    /**
     * The segments's state or geographical region.
     */
    state?: string;
    /**
     * The segment's country.
     */
    country?: string;
    /**
     * Whether this segment is private.
     */
    private?: boolean;
    athlete_pr_effort?: {
      /**
       * The unique identifier of the activity related to the PR effort.
       */
      pr_activity_id?: number;
      /**
       * The elapsed time ot the PR effort.
       */
      pr_elapsed_time?: number;
      /**
       * The time at which the PR effort was started.
       */
      pr_date?: string;
      /**
       * Number of efforts by the authenticated athlete on this segment.
       */
      effort_count?: number;
    };
    athlete_segment_stats?: paths_1segment_efforts_1_id_get_responses_200_schema_allOf_0;
  }> | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/segments/starred',
      query: {
        'page': page,
        'per_page': perPage,
      },
    });
  }
  /**
   * Star Segment
   * Stars/Unstars the given segment for the authenticated athlete. Requires profile:write scope.
   * @returns paths_1segments_1_id_get_responses_200_schema Representation of a segment.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static starSegment({
    id,
    starred = false,
  }: {
    /**
     * The identifier of the segment to star.
     */
    id: number,
    /**
     * If true, star the segment; if false, unstar the segment.
     */
    starred?: boolean,
  }): CancelablePromise<paths_1segments_1_id_get_responses_200_schema | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/segments/{id}/starred',
      path: {
        'id': id,
      },
      formData: {
        'starred': starred,
      },
    });
  }
  /**
   * Explore segments
   * Returns the top 10 segments matching a specified query.
   * @returns any List of matching segments.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static exploreSegments({
    bounds,
    activityType,
    minCat,
    maxCat,
  }: {
    /**
     * The latitude and longitude for two points describing a rectangular boundary for the search: [southwest corner latitutde, southwest corner longitude, northeast corner latitude, northeast corner longitude]
     */
    bounds: Array<number>,
    /**
     * Desired activity type.
     */
    activityType?: 'running' | 'riding',
    /**
     * The minimum climbing category.
     */
    minCat?: number,
    /**
     * The maximum climbing category.
     */
    maxCat?: number,
  }): CancelablePromise<{
    /**
     * The set of segments matching an explorer request
     */
    segments?: Array<{
      /**
       * The unique identifier of this segment
       */
      id?: number;
      /**
       * The name of this segment
       */
      name?: string;
      /**
       * The category of the climb [0, 5]. Higher is harder ie. 5 is Hors catégorie, 0 is uncategorized in climb_category. If climb_category = 5, climb_category_desc = HC. If climb_category = 2, climb_category_desc = 3.
       */
      climb_category?: number;
      /**
       * The description for the category of the climb
       */
      climb_category_desc?: 'NC' | '4' | '3' | '2' | '1' | 'HC';
      /**
       * The segment's average grade, in percents
       */
      avg_grade?: number;
      start_latlng?: paths_1segments_1starred_get_responses_200_schema_items_properties_end_latlng;
      end_latlng?: paths_1segments_1starred_get_responses_200_schema_items_properties_end_latlng;
      /**
       * The segments's evelation difference, in meters
       */
      elev_difference?: number;
      /**
       * The segment's distance, in meters
       */
      distance?: number;
      /**
       * The polyline of the segment
       */
      points?: string;
    }>;
  } | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/segments/explore',
      query: {
        'bounds': bounds,
        'activity_type': activityType,
        'min_cat': minCat,
        'max_cat': maxCat,
      },
    });
  }
}
