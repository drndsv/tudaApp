/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ApiResponseEventUserStatus = {
    error?: boolean;
    errorMassage?: string;
    result?: ApiResponseEventUserStatus.result;
};
export namespace ApiResponseEventUserStatus {
    export enum result {
        USER = 'USER',
        USER_WITH_REQUEST = 'USER_WITH_REQUEST',
        VOLUNTEER = 'VOLUNTEER',
        PARTICIPANT = 'PARTICIPANT',
    }
}

