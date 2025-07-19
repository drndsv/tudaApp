import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Box, Button, Group } from "@mantine/core";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

interface CameraDevice {
  id: string;
  label: string;
}

export default function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const scannerIdRef = useRef(
    "reader-" + Math.random().toString(36).slice(2, 10)
  );
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef(false);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);

  const startScanner = (cameraId: string) => {
    const html5QrCode = html5QrCodeRef.current!;
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
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && isScanningRef.current) {
      await html5QrCodeRef.current.stop().catch((e) => {
        console.warn("Сканер уже остановлен или не запущен:", e.message);
      });

      try {
        html5QrCodeRef.current.clear();
      } catch (e) {
        console.warn("Ошибка при очистке сканера:", (e as Error).message);
      }

      isScanningRef.current = false;
    }
  };

  const switchCamera = async () => {
    if (cameras.length <= 1) return;

    const nextIndex = (currentCameraIndex + 1) % cameras.length;
    await stopScanner();
    setCurrentCameraIndex(nextIndex);
    startScanner(cameras[nextIndex].id);
  };

  useEffect(() => {
    console.log("QRScanner mounted");

    const container = document.getElementById(scannerIdRef.current);
    if (container) container.innerHTML = "";

    const html5QrCode = new Html5Qrcode(scannerIdRef.current);
    html5QrCodeRef.current = html5QrCode;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          const cameraList: CameraDevice[] = devices.map((d) => ({
            id: d.id,
            label: d.label,
          }));
          setCameras(cameraList);
          setCurrentCameraIndex(0);
          startScanner(cameraList[0].id);
        } else {
          console.error("Камеры не найдены");
        }
      })
      .catch((err) => {
        console.error("Ошибка получения камер:", err);
      });

    return () => {
      console.log("QRScanner unmounted");
      stopScanner();
    };
  }, []);

  return (
    <Box>
      <div id={scannerIdRef.current} style={{ width: "100%" }} />
      {cameras.length > 1 && (
        <Group justify="center" mt="md">
          <Button onClick={switchCamera}>Переключить камеру</Button>
        </Group>
      )}
    </Box>
  );
}
