import { Title, Text, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const catImages = [
  "https://4.downloader.disk.yandex.ru/preview/253afd7d526bc94b2eb5ca4dc733fb62a3be8c3d36f1991d8074422ca1ab7f0b/inf/PJpOgQoG9qOj4pu2Xx_RET9PQTVPBWOys0kRUehGYoJsHPYY0HDz35OKNhbkQahvtca5Zv1XeR5RKTSAzM29lA%3D%3D?uid=98548973&filename=mem1.jpg&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=98548973&tknv=v3&size=2541x1272",
  "catsImages/mem2.jpg",
  "catsImages/mem3.jpg",
  "catsImages/mem4.jpg",
  "catsImages/mem5.jpg",
  "catsImages/mem6.jpg",
  "catsImages/mem7.jpg",
  "catsImages/mem8.jpg",
  "catsImages/mem9.jpg",
  "catsImages/mem10.jpg",
  "catsImages/mem11.jpg",
];

const generateCat = () => ({
  id: crypto.randomUUID(),
  left: Math.random() * 90, // позиция по горизонтали
  size: 90 + Math.random() * 80, // размер картинки
  delay: Math.random() * 5, // задержка анимации
  duration: 10 + Math.random() * 10, // продолжительность падения
  src: catImages[Math.floor(Math.random() * catImages.length)],
});

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [cats, setCats] = useState(() =>
    Array.from({ length: 20 }, generateCat)
  );

  // переодическое добавление новых картинок
  useEffect(() => {
    const interval = setInterval(() => {
      setCats((prev) => [...prev, generateCat()]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        background: "#f0f8ff",
      }}
    >
      {/* снежинки */}
      {cats.map((cat) => (
        <img
          key={cat.id}
          src={cat.src}
          alt="cat"
          style={{
            position: "absolute",
            top: `-${cat.size}px`,
            left: `${cat.left}%`,
            width: `${cat.size}px`,
            animation: `fall ${cat.duration}s linear ${cat.delay}s infinite`,
            pointerEvents: "none",
            opacity: 0.8,
            zIndex: 0,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <Title order={1} style={{ fontSize: 64 }}>
          404
        </Title>
        <Text size="lg">
          Такой страницы не существует. Но зато котики падают!
        </Text>
        <Button mt="md" onClick={() => navigate("/")}>
          На главную
        </Button>
      </div>

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
