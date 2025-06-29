/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrganizationResponseDTO } from './OrganizationResponseDTO';
export type AppUserResponseDTO = {
    id?: number;
    name?: string;
    lastName?: string;
    patronymic?: string;
    login?: string;
    password?: string;
    organization?: OrganizationResponseDTO;
    phoneNumber?: string;
};

