/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JwtRefreshRequestDTO } from '../models/JwtRefreshRequestDTO';
import type { JwtResponseDTO } from '../models/JwtResponseDTO';
import type { JwtSignInRequestDTO } from '../models/JwtSignInRequestDTO';
import type { JwtSignUpRequestDTO } from '../models/JwtSignUpRequestDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthControllerService {
    /**
     * @param requestBody
     * @returns JwtResponseDTO OK
     * @throws ApiError
     */
    public static signUp(
        requestBody: JwtSignUpRequestDTO,
    ): CancelablePromise<JwtResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns JwtResponseDTO OK
     * @throws ApiError
     */
    public static getNewRefreshToken(
        requestBody: JwtRefreshRequestDTO,
    ): CancelablePromise<JwtResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns JwtResponseDTO OK
     * @throws ApiError
     */
    public static signIn(
        requestBody: JwtSignInRequestDTO,
    ): CancelablePromise<JwtResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
