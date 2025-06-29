/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Organization } from './Organization';
export type AppUser = {
    id?: number;
    createdAt?: string;
    updatedAt?: string;
    name?: string;
    lastName?: string;
    patronymic?: string;
    login?: string;
    password?: string;
    organization?: Organization;
    phoneNumber?: string;
};

