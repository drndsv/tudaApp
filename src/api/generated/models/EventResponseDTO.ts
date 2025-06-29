/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrganizationResponseDTO } from './OrganizationResponseDTO';
import type { PhotoResponseDTO } from './PhotoResponseDTO';
export type EventResponseDTO = {
    id?: number;
    organization?: OrganizationResponseDTO;
    city?: string;
    date?: string;
    title?: string;
    description?: string;
    participantsNumber?: number;
    volunteersNumber?: number;
    eventStatus?: string;
    photo?: PhotoResponseDTO;
};

