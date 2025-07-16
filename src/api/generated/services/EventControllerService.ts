/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseAppUserResponseDTO } from '../models/ApiResponseAppUserResponseDTO';
import type { ApiResponseEventResponseDTO } from '../models/ApiResponseEventResponseDTO';
import type { ApiResponseListEventParticipantResponseDTO } from '../models/ApiResponseListEventParticipantResponseDTO';
import type { ApiResponseListEventResponseDTO } from '../models/ApiResponseListEventResponseDTO';
import type { ApiResponseLong } from '../models/ApiResponseLong';
import type { ApiResponseObject } from '../models/ApiResponseObject';
import type { EventRequestDTO } from '../models/EventRequestDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EventControllerService {
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseEventResponseDTO OK
     * @throws ApiError
     */
    public static updateEvent(
        id: number,
        requestBody: EventRequestDTO,
    ): CancelablePromise<ApiResponseEventResponseDTO> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/event/update',
            query: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param key
     * @returns ApiResponseObject OK
     * @throws ApiError
     */
    public static markPresence(
        key: string,
    ): CancelablePromise<ApiResponseObject> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/event/markPresence',
            query: {
                'key': key,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseEventResponseDTO OK
     * @throws ApiError
     */
    public static addEvent(
        requestBody: EventRequestDTO,
    ): CancelablePromise<ApiResponseEventResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/event/add',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns ApiResponseListEventParticipantResponseDTO OK
     * @throws ApiError
     */
    public static getParticipantsByEventId(
        id: number,
    ): CancelablePromise<ApiResponseListEventParticipantResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/{id}/participants',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param role
     * @param eventId
     * @returns ApiResponseLong OK
     * @throws ApiError
     */
    public static getUserCountWithCertainRoleOnEvent(
        role: 'PARTICIPANT' | 'VOLUNTEER',
        eventId: number,
    ): CancelablePromise<ApiResponseLong> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/getUserCountWithCertainRoleOnEvent',
            query: {
                'role': role,
                'eventId': eventId,
            },
        });
    }
    /**
     * @param organizerId
     * @returns ApiResponseListEventResponseDTO OK
     * @throws ApiError
     */
    public static getOrganizationEventsByOrganizerId(
        organizerId: number,
    ): CancelablePromise<ApiResponseListEventResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/getEventsByOrganizerId',
            query: {
                'organizerId': organizerId,
            },
        });
    }
    /**
     * @param role
     * @returns ApiResponseListEventResponseDTO OK
     * @throws ApiError
     */
    public static getEventsByNeededRoleForUser(
        role: 'PARTICIPANT' | 'VOLUNTEER',
    ): CancelablePromise<ApiResponseListEventResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/getEventsByNeededRoleForUser',
            query: {
                'role': role,
            },
        });
    }
    /**
     * @param role
     * @param appUserId
     * @returns ApiResponseListEventResponseDTO OK
     * @throws ApiError
     */
    public static getEventsByNeededRoleForOrganizer(
        role: 'PARTICIPANT' | 'VOLUNTEER',
        appUserId: number,
    ): CancelablePromise<ApiResponseListEventResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/getEventsByNeededRoleForOrganizer',
            query: {
                'role': role,
                'appUserId': appUserId,
            },
        });
    }
    /**
     * @param appUserId
     * @param role
     * @returns ApiResponseListEventResponseDTO OK
     * @throws ApiError
     */
    public static getEventsByAppUserIdAndRole(
        appUserId: number,
        role: 'PARTICIPANT' | 'VOLUNTEER',
    ): CancelablePromise<ApiResponseListEventResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/getEventsByAppUserIdAndRole',
            query: {
                'appUserId': appUserId,
                'role': role,
            },
        });
    }
    /**
     * @param appUserId
     * @param status
     * @returns ApiResponseListEventResponseDTO OK
     * @throws ApiError
     */
    public static getEventsByAppUserIdAndAttendanceStatus(
        appUserId: number,
        status: 'PRESENTED' | 'ABSENT',
    ): CancelablePromise<ApiResponseListEventResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/getEventsByAppUserIdAndAttendanceStatus',
            query: {
                'appUserId': appUserId,
                'status': status,
            },
        });
    }
    /**
     * @param eventId
     * @returns ApiResponseAppUserResponseDTO OK
     * @throws ApiError
     */
    public static getContactPersonOfEvent(
        eventId: number,
    ): CancelablePromise<ApiResponseAppUserResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/getContactPersonOfEvent',
            query: {
                'eventId': eventId,
            },
        });
    }
    /**
     * @param id
     * @returns ApiResponseListEventResponseDTO OK
     * @throws ApiError
     */
    public static getEventsByUserId(
        id: number,
    ): CancelablePromise<ApiResponseListEventResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/getByUserId/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns ApiResponseEventResponseDTO OK
     * @throws ApiError
     */
    public static getEventById(
        id: number,
    ): CancelablePromise<ApiResponseEventResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/getById/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns ApiResponseListEventResponseDTO OK
     * @throws ApiError
     */
    public static getAllEvents(): CancelablePromise<ApiResponseListEventResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/getAll',
        });
    }
    /**
     * @param status
     * @param appUserId
     * @returns ApiResponseListEventResponseDTO OK
     * @throws ApiError
     */
    public static getEventsByStatusAndAppUserIdForUser(
        status: 'PASSED' | 'WILL' | 'CANCELLED',
        appUserId: number,
    ): CancelablePromise<ApiResponseListEventResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/filterByStatusAndAppUserIdForUser',
            query: {
                'status': status,
                'appUserId': appUserId,
            },
        });
    }
    /**
     * @param status
     * @param appUserId
     * @returns ApiResponseListEventResponseDTO OK
     * @throws ApiError
     */
    public static getEventsByStatusAndAppUserIdForOrganizer(
        status: 'PASSED' | 'WILL' | 'CANCELLED',
        appUserId: number,
    ): CancelablePromise<ApiResponseListEventResponseDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/event/filterByStatusAndAppUserIdForOrganizer',
            query: {
                'status': status,
                'appUserId': appUserId,
            },
        });
    }
}
