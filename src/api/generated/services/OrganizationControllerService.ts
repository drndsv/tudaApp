/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseOrganizationResponseDTO } from '../models/ApiResponseOrganizationResponseDTO';
import type { OrganizationRequestDTO } from '../models/OrganizationRequestDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrganizationControllerService {
    /**
     * @param requestBody
     * @returns ApiResponseOrganizationResponseDTO OK
     * @throws ApiError
     */
    public static addOrganization(
        requestBody: OrganizationRequestDTO,
    ): CancelablePromise<ApiResponseOrganizationResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/organization/add',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
