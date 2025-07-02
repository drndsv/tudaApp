/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EventParticipantResponseDTO = {
    id?: number;
    fullName?: string;
    status?: boolean;
    role?: EventParticipantResponseDTO.role;
    type?: EventParticipantResponseDTO.type;
};
export namespace EventParticipantResponseDTO {
    export enum role {
        PARTICIPANT = 'PARTICIPANT',
        VOLUNTEER = 'VOLUNTEER',
    }
    export enum type {
        GUEST = 'GUEST',
        APP_USER = 'APP_USER',
    }
}

