/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JwtLoginRequestDTO } from '../models/JwtLoginRequestDTO';
import type { JwtSignUpRequestDTO } from '../models/JwtSignUpRequestDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthControllerService {
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static register(
        requestBody: JwtSignUpRequestDTO,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static authenticate(
        requestBody: JwtLoginRequestDTO,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
