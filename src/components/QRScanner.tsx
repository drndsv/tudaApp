import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Box, Button } from "@mantine/core";

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
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

  useEffect(() => {
    const container = document.getElementById(scannerIdRef.current);
    if (container) container.innerHTML = "";

    const html5QrCode = new Html5Qrcode(scannerIdRef.current);
    html5QrCodeRef.current = html5QrCode;

    // Получаем доступные камеры
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          setSelectedCamera(devices[0].id); // По умолчанию выбираем первую камеру
        }
      })
      .catch((err) => {
        console.error("Ошибка получения камер:", err);
      });

    return () => {
      if (html5QrCodeRef.current && isScanningRef.current) {
        html5QrCodeRef.current
          .stop()
          .catch((e) => {
            console.warn("Сканер уже остановлен или не запущен:", e.message);
          })
          .finally(() => {
            html5QrCodeRef.current?.clear();
            isScanningRef.current = false;
          });
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedCamera) return;

    const html5QrCode = html5QrCodeRef.current;

    // Останавливаем старую камеру, если она была запущена
    if (isScanningRef.current) {
      html5QrCode?.stop().then(() => {
        html5QrCode?.start(
          selectedCamera,
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            if (!isScanningRef.current) return;
            isScanningRef.current = false;
            onScanSuccess(decodedText);

            html5QrCode?.stop().then(() => {
              html5QrCode?.clear();
              onClose();
            });
          },
          (errorMessage) => {
            console.warn("QR scan error:", errorMessage);
          }
        );
      });
    } else {
      html5QrCode?.start(
        selectedCamera,
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          if (!isScanningRef.current) return;
          isScanningRef.current = false;
          onScanSuccess(decodedText);

          html5QrCode?.stop().then(() => {
            html5QrCode?.clear();
            onClose();
          });
        },
        (errorMessage) => {
          console.warn("QR scan error:", errorMessage);
        }
      );
    }
    isScanningRef.current = true;
  }, [selectedCamera, onScanSuccess, onClose]);

  const handleCameraSwitch = (cameraId: string) => {
    setSelectedCamera(cameraId);
  };

  return (
    <Box>
      <div
        id={scannerIdRef.current}
        style={{
          width: "100%",
        }}
      />

      <div style={{ marginTop: "10px" }}>
        <Button onClick={() => handleCameraSwitch(cameras[0]?.id)}>
          Переключить на основную камеру
        </Button>
        <Button onClick={() => handleCameraSwitch(cameras[1]?.id)}>
          Переключить на фронтальную камеру
        </Button>
      </div>
    </Box>
  );
}
