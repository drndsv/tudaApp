import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  Loader,
} from "@mantine/core";
import Header from "../components/Header";
import { EventResponseDTO } from "../api/generated/models/EventResponseDTO";
import { EventControllerService } from "../api/generated/services/EventControllerService";
import { useEventImage } from "../hooks/useEventImage";

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const [isParticipant, setIsParticipant] = useState(false);
  const [isVolunteerPending, setIsVolunteerPending] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const response = await EventControllerService.getEventById(Number(id));
        if (!response.error && response.result) {
          setEvent(response.result);
        } else {
          console.error("Ошибка в ответе:", response.errorMassage);
        }
      } catch (e) {
        console.error("Ошибка при загрузке мероприятия:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const imageSrc = useEventImage(event?.photo);

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

  const getReadableStatus = (status?: string): string => {
    switch (status) {
      case "WILL":
        return "Планируется";
      case "PUBLISHED":
        return "Опубликовано";
      case "FINISHED":
        return "Завершено";
      case "CANCELLED":
        return "Отменено";
      default:
        return "Неизвестно";
    }
  };

  if (loading) {
    return (
      <Box>
        <Header />
        <Container size="lg" py="xl">
          <Center>
            <Loader />
          </Center>
        </Container>
      </Box>
    );
  }

  if (!event) {
    return (
      <Box>
        <Header />
        <Container size="lg" py="xl">
          <Text>Мероприятие не найдено.</Text>
        </Container>
      </Box>
    );
  }

  const isPast = new Date(event.date || "") < new Date();

  return (
    <Box>
      <Header />
      <Container size="lg" py="xl">
        <Title order={2} mb="sm">
          {event.title || "Без названия"}
        </Title>

        <Text fz="lg" fw={500} mb="xl" c="gray.7">
          Статус: {getReadableStatus(event.eventStatus)}
        </Text>

        <Grid gutter="xl" align="stretch">
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
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={event.title || "Мероприятие"}
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
                    <Text fz="sm">{event.participantsNumber ?? 0}/200</Text>
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
                    <Text fz="sm">{event.volunteersNumber ?? 0}/100</Text>
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
                        📅{" "}
                        {event.date
                          ? new Date(event.date).toLocaleDateString()
                          : "—"}
                      </Text>
                      <Text>
                        🕒{" "}
                        {event.date
                          ? new Date(event.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </Text>
                      <Text>📍 {event.city || "Город не указан"}</Text>
                      <Text>
                        🏢{" "}
                        {event.organization?.name || "Организация не указана"}
                      </Text>
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
                      <Text>
                        📞 {event.organization?.phoneNumber || "Не указан"}
                      </Text>
                      <Text>👤 —</Text>
                      <Text>✉️ —</Text>
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
