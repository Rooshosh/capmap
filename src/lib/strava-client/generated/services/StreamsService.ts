/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { paths_1athlete_get_responses_default_schema } from '../models/paths_1athlete_get_responses_default_schema';
import type { paths_1routes_1_id_1streams_get_responses_200_schema } from '../models/paths_1routes_1_id_1streams_get_responses_200_schema';
import type { paths_1routes_1_id_1streams_get_responses_200_schema_properties_time_allOf_0 } from '../models/paths_1routes_1_id_1streams_get_responses_200_schema_properties_time_allOf_0';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StreamsService {
  /**
   * Get Activity Streams
   * Returns the given activity's streams. Requires activity:read scope. Requires activity:read_all scope for Only Me activities.
   * @returns paths_1routes_1_id_1streams_get_responses_200_schema The set of requested streams.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getActivityStreams({
    id,
    keys,
    keyByType = true,
  }: {
    /**
     * The identifier of the activity.
     */
    id: number,
    /**
     * Desired stream types.
     */
    keys: Array<string>,
    /**
     * Must be true.
     */
    keyByType?: boolean,
  }): CancelablePromise<paths_1routes_1_id_1streams_get_responses_200_schema | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/activities/{id}/streams',
      path: {
        'id': id,
      },
      query: {
        'keys': keys,
        'key_by_type': keyByType,
      },
    });
  }
  /**
   * Get Segment Effort Streams
   * Returns a set of streams for a segment effort completed by the authenticated athlete. Requires read_all scope.
   * @returns paths_1routes_1_id_1streams_get_responses_200_schema The set of requested streams.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getSegmentEffortStreams({
    id,
    keys,
    keyByType = true,
  }: {
    /**
     * The identifier of the segment effort.
     */
    id: number,
    /**
     * The types of streams to return.
     */
    keys: Array<string>,
    /**
     * Must be true.
     */
    keyByType?: boolean,
  }): CancelablePromise<paths_1routes_1_id_1streams_get_responses_200_schema | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/segment_efforts/{id}/streams',
      path: {
        'id': id,
      },
      query: {
        'keys': keys,
        'key_by_type': keyByType,
      },
    });
  }
  /**
   * Get Segment Streams
   * Returns the given segment's streams. Requires read_all scope for private segments.
   * @returns paths_1routes_1_id_1streams_get_responses_200_schema The set of requested streams.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getSegmentStreams({
    id,
    keys,
    keyByType = true,
  }: {
    /**
     * The identifier of the segment.
     */
    id: number,
    /**
     * The types of streams to return.
     */
    keys: Array<string>,
    /**
     * Must be true.
     */
    keyByType?: boolean,
  }): CancelablePromise<paths_1routes_1_id_1streams_get_responses_200_schema | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/segments/{id}/streams',
      path: {
        'id': id,
      },
      query: {
        'keys': keys,
        'key_by_type': keyByType,
      },
    });
  }
  /**
   * Get Route Streams
   * Returns the given route's streams. Requires read_all scope for private routes.
   * @returns any The set of requested streams.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getRouteStreams({
    id,
  }: {
    /**
     * The identifier of the route.
     */
    id: number,
  }): CancelablePromise<{
    time?: {
      /**
       * The number of data points in this stream
       */
      original_size?: number;
      /**
       * The level of detail (sampling) in which this stream was returned
       */
      resolution?: 'low' | 'medium' | 'high';
      /**
       * The base series used in the case the stream was downsampled
       */
      series_type?: 'distance' | 'time';
    };
    distance?: paths_1routes_1_id_1streams_get_responses_200_schema_properties_time_allOf_0;
    latlng?: paths_1routes_1_id_1streams_get_responses_200_schema_properties_time_allOf_0;
    altitude?: paths_1routes_1_id_1streams_get_responses_200_schema_properties_time_allOf_0;
    velocity_smooth?: paths_1routes_1_id_1streams_get_responses_200_schema_properties_time_allOf_0;
    heartrate?: paths_1routes_1_id_1streams_get_responses_200_schema_properties_time_allOf_0;
    cadence?: paths_1routes_1_id_1streams_get_responses_200_schema_properties_time_allOf_0;
    watts?: paths_1routes_1_id_1streams_get_responses_200_schema_properties_time_allOf_0;
    temp?: paths_1routes_1_id_1streams_get_responses_200_schema_properties_time_allOf_0;
    moving?: paths_1routes_1_id_1streams_get_responses_200_schema_properties_time_allOf_0;
    grade_smooth?: paths_1routes_1_id_1streams_get_responses_200_schema_properties_time_allOf_0;
  } | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/routes/{id}/streams',
      path: {
        'id': id,
      },
    });
  }
}
