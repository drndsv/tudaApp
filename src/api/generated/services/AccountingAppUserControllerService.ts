/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseAccountingAppUserResponseDTO } from "../models/ApiResponseAccountingAppUserResponseDTO";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class AccountingAppUserControllerService {
  /**
   * @param eventId
   * @param userLogin
   * @returns any OK
   * @throws ApiError
   */
  public static delete(
    eventId: number,
    userLogin: string
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/accountingAppUser/refuseToParticipate",
      query: {
        eventId: eventId,
        userLogin: userLogin,
      },
    });
  }
  /**
   * @param eventId
   * @param userLogin
   * @returns ApiResponseAccountingAppUserResponseDTO OK
   * @throws ApiError
   */
  public static markPresence(
    eventId: number,
    userLogin: string
  ): CancelablePromise<ApiResponseAccountingAppUserResponseDTO> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/accountingAppUser/markPresence",
      query: {
        eventId: eventId,
        userLogin: userLogin,
      },
    });
  }
  /**
   * @param eventId
   * @param userLogin
   * @returns ApiResponseAccountingAppUserResponseDTO OK
   * @throws ApiError
   */
  public static saveAsVolunteerForEvent(
    eventId: number,
    userLogin: string
  ): CancelablePromise<ApiResponseAccountingAppUserResponseDTO> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/accountingAppUser/addAsVolunteerForEvent",
      query: {
        eventId: eventId,
        userLogin: userLogin,
      },
    });
  }
  /**
   * @param eventId
   * @param userLogin
   * @returns ApiResponseAccountingAppUserResponseDTO OK
   * @throws ApiError
   */
  public static saveAsParticipantForEvent(
    eventId: number,
    userLogin: string
  ): CancelablePromise<ApiResponseAccountingAppUserResponseDTO> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/accountingAppUser/addAsParticipantForEvent",
      query: {
        eventId: eventId,
        userLogin: userLogin,
      },
    });
  }
}
