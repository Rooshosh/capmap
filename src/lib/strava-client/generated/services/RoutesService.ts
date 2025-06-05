/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { paths_1athlete_get_responses_default_schema } from '../models/paths_1athlete_get_responses_default_schema';
import type { paths_1clubs_1_id_1admins_get_responses_200_schema_items } from '../models/paths_1clubs_1_id_1admins_get_responses_200_schema_items';
import type { paths_1routes_1_id_get_responses_200_schema } from '../models/paths_1routes_1_id_get_responses_200_schema';
import type { paths_1segments_1starred_get_responses_200_schema_items } from '../models/paths_1segments_1starred_get_responses_200_schema_items';
import type { paths_1segments_1starred_get_responses_200_schema_items_properties_end_latlng } from '../models/paths_1segments_1starred_get_responses_200_schema_items_properties_end_latlng';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RoutesService {
  /**
   * Get Route
   * Returns a route using its identifier. Requires read_all scope for private routes.
   * @returns any A representation of the route.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getRouteById({
    id,
  }: {
    /**
     * The identifier of the route.
     */
    id: number,
  }): CancelablePromise<{
    athlete?: paths_1clubs_1_id_1admins_get_responses_200_schema_items;
    /**
     * The description of the route
     */
    description?: string;
    /**
     * The route's distance, in meters
     */
    distance?: number;
    /**
     * The route's elevation gain.
     */
    elevation_gain?: number;
    /**
     * The unique identifier of this route
     */
    id?: number;
    /**
     * The unique identifier of the route in string format
     */
    id_str?: string;
    map?: {
      /**
       * The identifier of the map
       */
      id?: string;
      /**
       * The polyline of the map, only returned on detailed representation of an object
       */
      polyline?: string;
      /**
       * The summary polyline of the map
       */
      summary_polyline?: string;
    };
    /**
     * The name of this route
     */
    name?: string;
    /**
     * Whether this route is private
     */
    private?: boolean;
    /**
     * Whether this route is starred by the logged-in athlete
     */
    starred?: boolean;
    /**
     * An epoch timestamp of when the route was created
     */
    timestamp?: number;
    /**
     * This route's type (1 for ride, 2 for runs)
     */
    type?: number;
    /**
     * This route's sub-type (1 for road, 2 for mountain bike, 3 for cross, 4 for trail, 5 for mixed)
     */
    sub_type?: number;
    /**
     * The time at which the route was created
     */
    created_at?: string;
    /**
     * The time at which the route was last updated
     */
    updated_at?: string;
    /**
     * Estimated time in seconds for the authenticated athlete to complete route
     */
    estimated_moving_time?: number;
    /**
     * The segments traversed by this route
     */
    segments?: Array<paths_1segments_1starred_get_responses_200_schema_items>;
    /**
     * The custom waypoints along this route
     */
    waypoints?: Array<{
      /**
       * The location along the route that the waypoint is closest to
       */
      latlng?: paths_1segments_1starred_get_responses_200_schema_items_properties_end_latlng;
      /**
       * A location off of the route that the waypoint is (optional)
       */
      target_latlng?: paths_1segments_1starred_get_responses_200_schema_items_properties_end_latlng;
      /**
       * Categories that the waypoint belongs to
       */
      categories?: Array<string>;
      /**
       * A title for the waypoint
       */
      title?: string;
      /**
       * A description of the waypoint (optional)
       */
      description?: string;
      /**
       * The number meters along the route that the waypoint is located
       */
      distance_into_route?: number;
    }>;
  } | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/routes/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * List Athlete Routes
   * Returns a list of the routes created by the authenticated athlete. Private routes are filtered out unless requested by a token with read_all scope.
   * @returns paths_1routes_1_id_get_responses_200_schema A representation of the route.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getRoutesByAthleteId({
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
  }): CancelablePromise<Array<paths_1routes_1_id_get_responses_200_schema> | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/athletes/{id}/routes',
      query: {
        'page': page,
        'per_page': perPage,
      },
    });
  }
  /**
   * Export Route GPX
   * Returns a GPX file of the route. Requires read_all scope for private routes.
   * @returns any A GPX file with the route.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getRouteAsGpx({
    id,
  }: {
    /**
     * The identifier of the route.
     */
    id: number,
  }): CancelablePromise<any | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/routes/{id}/export_gpx',
      path: {
        'id': id,
      },
    });
  }
  /**
   * Export Route TCX
   * Returns a TCX file of the route. Requires read_all scope for private routes.
   * @returns any A TCX file with the route.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getRouteAsTcx({
    id,
  }: {
    /**
     * The identifier of the route.
     */
    id: number,
  }): CancelablePromise<any | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/routes/{id}/export_tcx',
      path: {
        'id': id,
      },
    });
  }
}
