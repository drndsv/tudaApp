import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Image,
  Text,
  Title,
  Stack,
  Card,
  Button,
  rem,
  Center,
} from "@mantine/core";
import Header from "../components/Header";
import { Event } from "../types/models";

const mockEvent: Event = {
  id: 1,
  title: "Волонтёрская уборка парка",
  city: "Москва",
  date: "2025-07-01T18:00:00Z",
  description: "Убираем парк вместе с жителями района!",
  organizer_id: 1,
  participants_number: 100,
  volunteers_number: 5,
  status: "PUBLISHED",
  photo: {
    id: 1,
    upload_id: "uuid",
    filename: "cat.jpg",
  },
};

export default function EventDetailsPage() {
  const { id } = useParams();
  const event = mockEvent;

  const isPast = new Date(event.date) < new Date();

  const [isParticipant, setIsParticipant] = useState(false);
  const [isVolunteerPending, setIsVolunteerPending] = useState(false);

  const handleJoin = () => {
    setIsParticipant(true);
    setIsVolunteerPending(false);
  };

  const handleVolunteer = () => {
    setIsVolunteerPending(true);
    setIsParticipant(false);
  };

  const handleCancel = () => {
    setIsParticipant(false);
    setIsVolunteerPending(false);
  };

  return (
    <Box>
      <Header />
      <Container size="lg" py="xl">
        <Title order={2} mb="sm">
          {event.title}
        </Title>

        <Text fz="lg" fw={500} mb="xl" c="gray.7">
          Статус: {isPast ? "Завершено" : "Активно"}
        </Text>

        <Grid gutter="xl" align="stretch">
          {/* Левая колонка */}
          <Grid.Col span={{ base: 12, md: 6 }} h="100%">
            <Stack h="100%" justify="space-between">
              <Box
                h={320}
                style={{
                  borderRadius: rem(16),
                  overflow: "hidden",
                  boxShadow: "8px 8px 16px #bcc4aa, -8px -8px 16px #ffffff",
                }}
              >
                {event.photo?.filename ? (
                  <Image
                    src={`/uploads/${event.photo.filename}`}
                    alt={event.title}
                    h="100%"
                    w="100%"
                    fit="cover"
                  />
                ) : (
                  <Center h="100%" bg="gray.0">
                    <Text c="gray.6">Без фото</Text>
                  </Center>
                )}
              </Box>

              <Stack gap="sm">
                {isVolunteerPending && (
                  <Text fz="sm" c="gray.6">
                    Ожидайте одобрения заявки на волонтёрство
                  </Text>
                )}

                {isParticipant && (
                  <Text fz="sm" c="gray.6">
                    Вы зарегистрированы как участник
                  </Text>
                )}

                {!isParticipant && !isVolunteerPending && (
                  <>
                    <Button
                      fullWidth
                      color="green.10"
                      radius="xl"
                      disabled={isPast}
                      onClick={handleJoin}
                    >
                      Участвовать
                    </Button>
                    <Button
                      fullWidth
                      color="green.10"
                      radius="xl"
                      disabled={isPast}
                      onClick={handleVolunteer}
                    >
                      Подать заявку на волонтёрство
                    </Button>
                  </>
                )}

                {(isParticipant || isVolunteerPending) && (
                  <Button
                    fullWidth
                    color="red"
                    radius="xl"
                    disabled={isPast}
                    onClick={handleCancel}
                  >
                    Отказаться от участия
                  </Button>
                )}
              </Stack>
            </Stack>
          </Grid.Col>

          {/* Правая колонка */}
          <Grid.Col span={{ base: 12, md: 6 }} h="100%">
            <Stack gap="md" h="100%">
              <Card
                shadow="sm"
                radius="xl"
                padding="md"
                bg="white"
                withBorder
                style={{ minHeight: "120px" }}
              >
                <Text fw={600} mb="xs">
                  Описание
                </Text>
                <Text fz="sm">{event.description || "Нет описания."}</Text>
              </Card>

              <Grid>
                <Grid.Col span={6}>
                  <Card
                    shadow="sm"
                    radius="xl"
                    padding="md"
                    bg="white"
                    withBorder
                  >
                    <Text fw={600} mb="xs">
                      Участников
                    </Text>
                    <Text fz="sm">{event.participants_number}/200</Text>
                  </Card>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Card
                    shadow="sm"
                    radius="xl"
                    padding="md"
                    bg="white"
                    withBorder
                  >
                    <Text fw={600} mb="xs">
                      Волонтёров
                    </Text>
                    <Text fz="sm">{event.volunteers_number}/100</Text>
                  </Card>
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <Card
                    shadow="sm"
                    radius="xl"
                    padding="md"
                    bg="white"
                    withBorder
                    h="100%"
                  >
                    <Text fw={600} mb="xs">
                      Основная информация
                    </Text>
                    <Stack gap={4} fz="sm">
                      <Text>
                        📅 {new Date(event.date).toLocaleDateString()}
                      </Text>
                      <Text>
                        🕒{" "}
                        {new Date(event.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                      <Text>📍 {event.city}</Text>
                      <Text>🏢 Организация ID: {event.organizer_id}</Text>
                    </Stack>
                  </Card>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Card
                    shadow="sm"
                    radius="xl"
                    padding="md"
                    bg="white"
                    withBorder
                    h="100%"
                  >
                    <Text fw={600} mb="xs">
                      Контактное лицо
                    </Text>
                    <Stack gap={4} fz="sm">
                      <Text>📞 +7 (999) 123-45-67</Text>
                      <Text>👤 Иван Иванов</Text>
                      <Text>✉️ ivan@example.com</Text>
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
