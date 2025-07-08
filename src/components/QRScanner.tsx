import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Box } from "@mantine/core";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false); // 👈 добавили флаг

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCodeRef.current = html5QrCode;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          const cameraId = devices[0].id;
          html5QrCode
            .start(
              cameraId,
              {
                fps: 10,
                qrbox: 250,
              },
              (decodedText) => {
                if (!isScanningRef.current) return;
                isScanningRef.current = false;

                onScanSuccess(decodedText);

                html5QrCode.stop().then(() => {
                  onClose();
                });
              },
              (errorMessage) => {
                // Можно логировать, если нужно
              }
            )
            .then(() => {
              isScanningRef.current = true;
            })
            .catch((err) => {
              console.error("Ошибка при запуске сканера:", err);
            });
        }
      })
      .catch((err) => {
        console.error("Ошибка получения камеры:", err);
      });

    return () => {
      if (html5QrCodeRef.current && isScanningRef.current) {
        html5QrCodeRef.current
          .stop()
          .catch((e) => {
            console.warn("Сканер уже остановлен или не запущен:", e.message);
          })
          .finally(() => {
            isScanningRef.current = false;
          });
      }
    };
  }, []);

  return (
    <Box>
      <div ref={scannerRef} id="reader" style={{ width: "100%" }} />
    </Box>
  );
}
