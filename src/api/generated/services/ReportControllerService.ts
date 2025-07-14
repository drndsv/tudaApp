/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ReportControllerService {
  /**
   * Download PDF report
   * Generates and downloads a PDF report for the specified event
   * @param eventId
   * @returns binary PDF report file
   * @throws ApiError
   */
  public static getPdfReport(eventId: number): CancelablePromise<Blob> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/report/pdf/download",
      query: {
        eventId: eventId,
      },
      errors: {
        404: `Event not found`,
      },
    });
  }
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
    });
  }
}
