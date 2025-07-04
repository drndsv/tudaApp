/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListRequestResponseDTO } from '../models/ApiResponseListRequestResponseDTO';
import type { ApiResponseRequestResponseDTO } from '../models/ApiResponseRequestResponseDTO';
import type { ApiResponseString } from '../models/ApiResponseString';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RequestControllerService {
    /**
     * @param eventId
     * @param userLogin
     * @returns ApiResponseRequestResponseDTO OK
     * @throws ApiError
     */
    public static rejectRequest(
        eventId: number,
        userLogin: string,
    ): CancelablePromise<ApiResponseRequestResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/request/rejectVolunteerForEventById',
            query: {
                'eventId': eventId,
                'userLogin': userLogin,
            },
        });
    }
    /**
     * @param eventId
     * @param userLogin
     * @returns ApiResponseRequestResponseDTO OK
     * @throws ApiError
     */
    public static addRequest(
        eventId: number,
        userLogin: string,
    ): CancelablePromise<ApiResponseRequestResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/request/add',
            query: {
                'eventId': eventId,
                'userLogin': userLogin,
            },
        });
    }
    /**
     * @param eventId
     * @returns ApiResponseListRequestResponseDTO OK
     * @throws ApiError
     */
    public static getAllEventRequests(
        eventId: number,
    ): CancelablePromise<ApiResponseListRequestResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/request/getAll',
            query: {
                'eventId': eventId,
            },
        });
    }
    /**
     * @param eventId
     * @param userLogin
     * @returns ApiResponseString OK
     * @throws ApiError
     */
    public static deleteRequest(
        eventId: number,
        userLogin: string,
    ): CancelablePromise<ApiResponseString> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/request/refuseToVolunteering',
            query: {
                'eventId': eventId,
                'userLogin': userLogin,
            },
        });
    }
}
