/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppUserResponseDTO } from "./AppUserResponseDTO";
import type { EventResponseDTO } from "./EventResponseDTO";
export type AccountingAppUserResponseDTO = {
  id?: number;
  event?: EventResponseDTO;
  appUser?: AppUserResponseDTO;
  status?: boolean;
  userRole?: string;
  keyId?: string;
};
