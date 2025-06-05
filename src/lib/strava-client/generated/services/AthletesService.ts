/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { paths_1athlete_1zones_get_responses_200_schema_properties_power_properties_zones } from '../models/paths_1athlete_1zones_get_responses_200_schema_properties_power_properties_zones';
import type { paths_1athlete_get_responses_200_schema } from '../models/paths_1athlete_get_responses_200_schema';
import type { paths_1athlete_get_responses_default_schema } from '../models/paths_1athlete_get_responses_default_schema';
import type { paths_1clubs_1_id_1admins_get_responses_200_schema_items } from '../models/paths_1clubs_1_id_1admins_get_responses_200_schema_items';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AthletesService {
  /**
   * Get Athlete Stats
   * Returns the activity stats of an athlete. Only includes data from activities set to Everyone visibilty.
   * @returns any Activity stats of the athlete.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getStats({
    id,
  }: {
    /**
     * The identifier of the athlete. Must match the authenticated athlete.
     */
    id: number,
  }): CancelablePromise<any | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/athletes/{id}/stats',
      path: {
        'id': id,
      },
    });
  }
  /**
   * Get Authenticated Athlete
   * Returns the currently authenticated athlete. Tokens with profile:read_all scope will receive a detailed athlete representation; all others will receive a summary representation.
   * @returns any Profile information for the authenticated athlete.
   * @throws ApiError
   */
  public static getLoggedInAthlete(): CancelablePromise<paths_1clubs_1_id_1admins_get_responses_200_schema_items> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/athlete',
    });
  }
  /**
   * Update Athlete
   * Update the currently authenticated athlete. Requires profile:write scope.
   * @returns paths_1athlete_get_responses_200_schema Profile information for the authenticated athlete.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static updateLoggedInAthlete({
    weight,
  }: {
    /**
     * The weight of the athlete in kilograms.
     */
    weight: number,
  }): CancelablePromise<paths_1athlete_get_responses_200_schema | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/athlete',
      path: {
        'weight': weight,
      },
    });
  }
  /**
   * Get Zones
   * Returns the the authenticated athlete's heart rate and power zones. Requires profile:read_all.
   * @returns any Heart rate and power zones.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getLoggedInAthleteZones(): CancelablePromise<{
    heart_rate?: {
      /**
       * Whether the athlete has set their own custom heart rate zones
       */
      custom_zones?: boolean;
      zones?: paths_1athlete_1zones_get_responses_200_schema_properties_power_properties_zones;
    };
    power?: {
      zones?: Array<{
        /**
         * The minimum value in the range.
         */
        min?: number;
        /**
         * The maximum value in the range.
         */
        max?: number;
      }>;
    };
  } | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/athlete/zones',
    });
  }
}
