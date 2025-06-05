/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { paths_1athlete_get_responses_default_schema } from '../models/paths_1athlete_get_responses_default_schema';
import type { paths_1segment_efforts_1_id_get_responses_200_schema } from '../models/paths_1segment_efforts_1_id_get_responses_200_schema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SegmentEffortsService {
  /**
   * List Segment Efforts
   * Returns a set of the authenticated athlete's segment efforts for a given segment.  Requires subscription.
   * @returns paths_1segment_efforts_1_id_get_responses_200_schema List of segment efforts.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getEffortsBySegmentId({
    segmentId,
    startDateLocal,
    endDateLocal,
    perPage = 30,
  }: {
    /**
     * The identifier of the segment.
     */
    segmentId: number,
    /**
     * ISO 8601 formatted date time.
     */
    startDateLocal?: string,
    /**
     * ISO 8601 formatted date time.
     */
    endDateLocal?: string,
    /**
     * Number of items per page. Defaults to 30.
     */
    perPage?: number,
  }): CancelablePromise<Array<paths_1segment_efforts_1_id_get_responses_200_schema> | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/segment_efforts',
      query: {
        'segment_id': segmentId,
        'start_date_local': startDateLocal,
        'end_date_local': endDateLocal,
        'per_page': perPage,
      },
    });
  }
  /**
   * Get Segment Effort
   * Returns a segment effort from an activity that is owned by the authenticated athlete. Requires subscription.
   * @returns any Representation of a segment effort.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getSegmentEffortById({
    id,
  }: {
    /**
     * The identifier of the segment effort.
     */
    id: number,
  }): CancelablePromise<{
    /**
     * The unique identifier of this effort
     */
    id?: number;
    /**
     * The unique identifier of the activity related to this effort
     */
    activity_id?: number;
    /**
     * The effort's elapsed time
     */
    elapsed_time?: number;
    /**
     * The time at which the effort was started.
     */
    start_date?: string;
    /**
     * The time at which the effort was started in the local timezone.
     */
    start_date_local?: string;
    /**
     * The effort's distance in meters
     */
    distance?: number;
    /**
     * Whether this effort is the current best on the leaderboard
     */
    is_kom?: boolean;
  } | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/segment_efforts/{id}',
      path: {
        'id': id,
      },
    });
  }
}
