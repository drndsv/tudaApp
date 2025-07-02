/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponsePhotoResponseDTO } from "../models/ApiResponsePhotoResponseDTO";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class ImageControllerService {
  /**
   * @param formData
   * @returns ApiResponsePhotoResponseDTO OK
   * @throws ApiError
   */
  public static uploadImage(formData?: {
    file: Blob;
  }): CancelablePromise<ApiResponsePhotoResponseDTO> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/image/upload",
      formData: formData,
      mediaType: "multipart/form-data",
    });
  }
  /**
   * @param filename
   * @returns any OK
   * @throws ApiError
   */
  public static deleteImage(filename: string): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/image/delete",
      query: {
        filename: filename,
      },
    });
  }
  /**
   * @param uuid
   * @returns string OK
   * @throws ApiError
   */
  public static getImageByUuid(uuid: string): CancelablePromise<string> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/image/get/{uuid}",
      path: {
        uuid: uuid,
      },
      // headers: {
      //   Accept: "text/plain",
      // },
    });
  }
}
