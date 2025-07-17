import { useEffect, useState } from "react";
import { PhotoResponseDTO } from "../api/generated/models/PhotoResponseDTO";

export function useEventImage(photo?: PhotoResponseDTO): string | null {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!photo?.uploadId || !photo.filename) return;

      try {
        const response = await fetch(
          `https://45.67.56.19:8080/image/get/${photo.uploadId}`
          // `http://localhost:8080/image/get/${photo.uploadId}`
        );

        if (!response.ok) throw new Error("Ошибка при получении изображения");

        const base64 = await response.text();

        const ext = photo.filename?.split(".").pop()?.toLowerCase();
        const mimeMap: Record<string, string> = {
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          gif: "image/gif",
          bmp: "image/bmp",
          webp: "image/webp",
          svg: "image/svg+xml",
        };
        const mimeType = mimeMap[ext || ""] ?? "image/jpeg";
        setImageSrc(`data:${mimeType};base64,${base64}`);
      } catch (e) {
        console.error("Ошибка загрузки через fetch:", e);
      }
    };

    fetchImage();
  }, [photo?.uploadId, photo?.filename]);

  return imageSrc;
}
