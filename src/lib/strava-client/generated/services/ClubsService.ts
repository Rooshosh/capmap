/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { paths_1activities_1_id_put_parameters_1_schema_properties_sport_type } from '../models/paths_1activities_1_id_put_parameters_1_schema_properties_sport_type';
import type { paths_1athlete_1clubs_get_responses_200_schema_items } from '../models/paths_1athlete_1clubs_get_responses_200_schema_items';
import type { paths_1athlete_1clubs_get_responses_200_schema_items_allOf_1_properties_activity_types_items } from '../models/paths_1athlete_1clubs_get_responses_200_schema_items_allOf_1_properties_activity_types_items';
import type { paths_1athlete_get_responses_default_schema } from '../models/paths_1athlete_get_responses_default_schema';
import type { paths_1clubs_1_id_1admins_get_responses_200_schema_items_allOf_0 } from '../models/paths_1clubs_1_id_1admins_get_responses_200_schema_items_allOf_0';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClubsService {
  /**
   * Get Club
   * Returns a given club using its identifier.
   * @returns any The detailed representation of a club.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getClubById({
    id,
  }: {
    /**
     * The identifier of the club.
     */
    id: number,
  }): CancelablePromise<paths_1athlete_1clubs_get_responses_200_schema_items | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/clubs/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * List Club Members
   * Returns a list of the athletes who are members of a given club.
   * @returns any A list of club athlete representations.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getClubMembersById({
    id,
    page,
    perPage = 30,
  }: {
    /**
     * The identifier of the club.
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
  }): CancelablePromise<Array<{
    /**
     * Resource state, indicates level of detail. Possible values: 1 -> "meta", 2 -> "summary", 3 -> "detail"
     */
    resource_state?: number;
    /**
     * The athlete's first name.
     */
    firstname?: string;
    /**
     * The athlete's last initial.
     */
    lastname?: string;
    /**
     * The athlete's member status.
     */
    member?: string;
    /**
     * Whether the athlete is a club admin.
     */
    admin?: boolean;
    /**
     * Whether the athlete is club owner.
     */
    owner?: boolean;
  }> | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/clubs/{id}/members',
      path: {
        'id': id,
      },
      query: {
        'page': page,
        'per_page': perPage,
      },
    });
  }
  /**
   * List Club Administrators
   * Returns a list of the administrators of a given club.
   * @returns any A list of summary athlete representations.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getClubAdminsById({
    id,
    page,
    perPage = 30,
  }: {
    /**
     * The identifier of the club.
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
  }): CancelablePromise<Array<{
    /**
     * The unique identifier of the athlete
     */
    id?: number;
  }> | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/clubs/{id}/admins',
      path: {
        'id': id,
      },
      query: {
        'page': page,
        'per_page': perPage,
      },
    });
  }
  /**
   * List Club Activities
   * Retrieve recent activities from members of a specific club. The authenticated athlete must belong to the requested club in order to hit this endpoint. Pagination is supported. Athlete profile visibility is respected for all activities.
   * @returns any A list of activities.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getClubActivitiesById({
    id,
    page,
    perPage = 30,
  }: {
    /**
     * The identifier of the club.
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
  }): CancelablePromise<Array<{
    athlete?: paths_1clubs_1_id_1admins_get_responses_200_schema_items_allOf_0;
    /**
     * The name of the activity
     */
    name?: string;
    /**
     * The activity's distance, in meters
     */
    distance?: number;
    /**
     * The activity's moving time, in seconds
     */
    moving_time?: number;
    /**
     * The activity's elapsed time, in seconds
     */
    elapsed_time?: number;
    /**
     * The activity's total elevation gain.
     */
    total_elevation_gain?: number;
    /**
     * Deprecated. Prefer to use sport_type
     */
    type?: paths_1athlete_1clubs_get_responses_200_schema_items_allOf_1_properties_activity_types_items;
    sport_type?: paths_1activities_1_id_put_parameters_1_schema_properties_sport_type;
    /**
     * The activity's workout type
     */
    workout_type?: number;
  }> | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/clubs/{id}/activities',
      path: {
        'id': id,
      },
      query: {
        'page': page,
        'per_page': perPage,
      },
    });
  }
  /**
   * List Athlete Clubs
   * Returns a list of the clubs whose membership includes the authenticated athlete.
   * @returns any A list of summary club representations.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getLoggedInAthleteClubs({
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
     * The club's unique identifier.
     */
    id?: number;
    /**
     * Resource state, indicates level of detail. Possible values: 1 -> "meta", 2 -> "summary", 3 -> "detail"
     */
    resource_state?: number;
    /**
     * The club's name.
     */
    name?: string;
  }> | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/athlete/clubs',
      query: {
        'page': page,
        'per_page': perPage,
      },
    });
  }
}
