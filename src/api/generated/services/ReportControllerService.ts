/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ReportControllerService {
  /**
   * @param eventId
   * @returns binary OK
   * @throws ApiError
   */
  public static getCvsReport(eventId: number): CancelablePromise<Blob> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/report/cvs/download",
      query: {
        eventId: eventId,
      },
      responseType: "blob",
    });
  }
}
