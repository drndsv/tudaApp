import { useNavigate } from "react-router-dom";
import {
  Card,
  Image,
  Text,
  Box,
  Center,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { EventResponseDTO } from "../api/generated/models/EventResponseDTO";
import { useEventImage } from "../hooks/useEventImage";

interface Props {
  event: EventResponseDTO;
  navigateTo?: "user" | "organizer"; // по умолчанию — user
}

export default function EventCard({ event, navigateTo = "user" }: Props) {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const imageSrc = useEventImage(event.photo);

  const handleClick = () => {
    if (event.id === undefined) return;

    const url =
      navigateTo === "organizer"
        ? `/organizer/events/${event.id}`
        : `/event/${event.id}`;

    navigate(url);
  };

  return (
    <Card
      shadow="lg"
      radius="xl"
      padding="md"
      withBorder
      onClick={handleClick}
      className="transition-transform hover:scale-[1.02]"
      style={{
        cursor: "pointer",
        background: theme.colors.cream?.[1] || "#f2f3ed",
        boxShadow: "8px 8px 16px #bcc4aa, -8px -8px 16px #ffffff",
      }}
    >
      <Box
        h={180}
        mb="sm"
        style={{ borderRadius: rem(16), overflow: "hidden" }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={event.title ?? "Мероприятие"}
            h="100%"
            w="100%"
            fit="cover"
          />
        ) : (
          <Center
            h={180}
            style={{
              backgroundColor: theme.colors.gray[1],
              borderRadius: rem(16),
            }}
          >
            <Text c="gray.6" fz="sm">
              Без фото
            </Text>
          </Center>
        )}
      </Box>

      <Text ta="center" fw={600} fz="lg" mb={4}>
        {event.title ?? "Без названия"}
      </Text>

      <Text ta="center" fz="sm" c="green.6" mb={2}>
        {event.date
          ? new Date(event.date).toLocaleDateString()
          : "Дата не указана"}
      </Text>

      <Text ta="center" fz="sm">
        {event.city ?? "Город не указан"}
      </Text>
    </Card>
  );
}
