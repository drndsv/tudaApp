/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseAppUserResponseDTO } from '../models/ApiResponseAppUserResponseDTO';
import type { AppUserRequestDTO } from '../models/AppUserRequestDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserControllerService {
    /**
     * @param login
     * @param requestBody
     * @returns ApiResponseAppUserResponseDTO OK
     * @throws ApiError
     */
    public static changeUserRefs(
        login: string,
        requestBody: AppUserRequestDTO,
    ): CancelablePromise<ApiResponseAppUserResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/update',
            query: {
                'login': login,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns ApiResponseAppUserResponseDTO OK
     * @throws ApiError
     */
    public static getUser(
        id: number,
    ): CancelablePromise<ApiResponseAppUserResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/getById/{id}',
            path: {
                'id': id,
            },
        });
    }
}
