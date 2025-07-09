import { ImageControllerService, PhotoResponseDTO } from "../api/generated";

export async function uploadImage(file: File): Promise<{
  photo: PhotoResponseDTO | null;
  filename?: string;
  uploadId?: string;
  error?: string;
}> {
  try {
    const response = await ImageControllerService.uploadImage({ file });
    if (!response.error && response.result) {
      const { filename, uploadId } = response.result;
      return { photo: response.result, filename, uploadId };
    } else {
      return { photo: null, error: response.errorMassage || "Ошибка загрузки" };
    }
  } catch (err) {
    console.error("Ошибка загрузки изображения", err);
    return { photo: null, error: "Ошибка при загрузке изображения" };
  }
}
