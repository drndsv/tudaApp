import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Box } from "@mantine/core";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const scannerIdRef = useRef(
    "reader-" + Math.random().toString(36).slice(2, 10)
  );
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);

  useEffect(() => {
    console.log("QRScanner mounted");

    const container = document.getElementById(scannerIdRef.current);
    if (container) container.innerHTML = "";

    const html5QrCode = new Html5Qrcode(scannerIdRef.current);
    html5QrCodeRef.current = html5QrCode;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0 && !isScanningRef.current) {
          const cameraId = devices[0].id;
          html5QrCode
            .start(
              cameraId,
              { fps: 10, qrbox: 250 },
              (decodedText) => {
                if (!isScanningRef.current) return;
                isScanningRef.current = false;

                onScanSuccess(decodedText);

                html5QrCode
                  .stop()
                  .then(() => {
                    try {
                      html5QrCode.clear();
                    } catch (e) {
                      console.warn(
                        "Ошибка при очистке сканера:",
                        (e as Error).message
                      );
                    }
                  })
                  .then(() => onClose())
                  .catch((err) => {
                    console.error("Ошибка при остановке сканера:", err);
                  });
              },
              (errorMessage) => {
                console.warn("QR scan error:", errorMessage);
              }
            )
            .then(() => {
              isScanningRef.current = true;
              console.log("QR scanner started");
            })
            .catch((err) => {
              console.error("Ошибка при запуске сканера:", err);
            });
        } else if (!devices || devices.length === 0) {
          console.error("Камеры не найдены");
        }
      })
      .catch((err) => {
        console.error("Ошибка получения камер:", err);
      });

    return () => {
      console.log("QRScanner unmounted");
      if (html5QrCodeRef.current && isScanningRef.current) {
        html5QrCodeRef.current
          .stop()
          .catch((e) => {
            console.warn("Сканер уже остановлен или не запущен:", e.message);
          })
          .finally(() => {
            try {
              html5QrCodeRef.current?.clear();
            } catch (e) {
              console.warn("Ошибка при очистке сканера:", (e as Error).message);
            }
            isScanningRef.current = false;
            console.log("QR scanner stopped and cleared");
          });
      }
    };
  }, [onScanSuccess, onClose]);

  return (
    <Box>
      <div id={scannerIdRef.current} style={{ width: "100%" }} />
    </Box>
  );
}
