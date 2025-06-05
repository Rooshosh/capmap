/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { paths_1athlete_get_responses_default_schema } from '../models/paths_1athlete_get_responses_default_schema';
import type { paths_1uploads_post_responses_201_schema } from '../models/paths_1uploads_post_responses_201_schema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UploadsService {
  /**
   * Upload Activity
   * Uploads a new data file to create an activity from. Requires activity:write scope.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @returns any A representation of the created upload.
   * @throws ApiError
   */
  public static createUpload({
    file,
    name,
    description,
    trainer,
    commute,
    dataType,
    externalId,
  }: {
    /**
     * The uploaded file.
     */
    file?: Blob,
    /**
     * The desired name of the resulting activity.
     */
    name?: string,
    /**
     * The desired description of the resulting activity.
     */
    description?: string,
    /**
     * Whether the resulting activity should be marked as having been performed on a trainer.
     */
    trainer?: string,
    /**
     * Whether the resulting activity should be tagged as a commute.
     */
    commute?: string,
    /**
     * The format of the uploaded file.
     */
    dataType?: 'fit' | 'fit.gz' | 'tcx' | 'tcx.gz' | 'gpx' | 'gpx.gz',
    /**
     * The desired external identifier of the resulting activity.
     */
    externalId?: string,
  }): CancelablePromise<paths_1athlete_get_responses_default_schema | {
    /**
     * The unique identifier of the upload
     */
    id?: number;
    /**
     * The unique identifier of the upload in string format
     */
    id_str?: string;
    /**
     * The external identifier of the upload
     */
    external_id?: string;
    /**
     * The error associated with this upload
     */
    error?: string;
    /**
     * The status of this upload
     */
    status?: string;
    /**
     * The identifier of the activity this upload resulted into
     */
    activity_id?: number;
  }> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/uploads',
      formData: {
        'file': file,
        'name': name,
        'description': description,
        'trainer': trainer,
        'commute': commute,
        'data_type': dataType,
        'external_id': externalId,
      },
    });
  }
  /**
   * Get Upload
   * Returns an upload for a given identifier. Requires activity:write scope.
   * @returns paths_1uploads_post_responses_201_schema Representation of the upload.
   * @returns paths_1athlete_get_responses_default_schema Unexpected error.
   * @throws ApiError
   */
  public static getUploadById({
    uploadId,
  }: {
    /**
     * The identifier of the upload.
     */
    uploadId: number,
  }): CancelablePromise<paths_1uploads_post_responses_201_schema | paths_1athlete_get_responses_default_schema> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/uploads/{uploadId}',
      path: {
        'uploadId': uploadId,
      },
    });
  }
}
