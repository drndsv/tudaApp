/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseGuestResponseDTO } from '../models/ApiResponseGuestResponseDTO';
import type { GuestRequestDTO } from '../models/GuestRequestDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GuestControllerService {
    /**
     * @param requestBody
     * @returns ApiResponseGuestResponseDTO OK
     * @throws ApiError
     */
    public static addGuest(
        requestBody: GuestRequestDTO,
    ): CancelablePromise<ApiResponseGuestResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/guest/add',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
