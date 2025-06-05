/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { paths_1athlete_get_responses_default_schema } from '../models/paths_1athlete_get_responses_default_schema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GearsService {
  /**
   * Get Equipment
   * Returns an equipment using its identifier.
   * @returns any A representation of the gear.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getGearById({
    id,
  }: {
    /**
     * The identifier of the gear.
     */
    id: string,
  }): CancelablePromise<{
    /**
     * The gear's unique identifier.
     */
    id?: string;
    /**
     * Resource state, indicates level of detail. Possible values: 2 -> "summary", 3 -> "detail"
     */
    resource_state?: number;
    /**
     * Whether this gear's is the owner's default one.
     */
    primary?: boolean;
    /**
     * The gear's name.
     */
    name?: string;
    /**
     * The distance logged with this gear.
     */
    distance?: number;
  } | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/gear/{id}',
      path: {
        'id': id,
      },
    });
  }
}
