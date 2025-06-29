/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Organization } from './Organization';
import type { Photo } from './Photo';
export type Event = {
    id?: number;
    createdAt?: string;
    updatedAt?: string;
    organization?: Organization;
    city?: string;
    date?: string;
    title?: string;
    description?: string;
    participantsNumber?: number;
    volunteersNumber?: number;
    eventStatus?: Event.eventStatus;
    photo?: Photo;
};
export namespace Event {
    export enum eventStatus {
        PASSED = 'PASSED',
        WILL = 'WILL',
        CANCELLED = 'CANCELLED',
    }
}

