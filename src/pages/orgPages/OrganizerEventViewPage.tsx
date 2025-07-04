import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Grid,
  Image,
  Loader,
  Stack,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { EventControllerService, EventResponseDTO } from "../../api/generated";
import { useEventImage } from "../../hooks/useEventImage";
import { useFullUser } from "../../hooks/useFullUser";

export default function OrganizerEventViewPage() {
  const fullUser = useFullUser();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const imageSrc = useEventImage(event?.photo);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const res = await EventControllerService.getEventById(Number(id));
        if (!res.error && res.result) {
          setEvent(res.result);
        } else {
          console.error("Ошибка:", res.errorMassage);
        }
      } catch (err) {
        console.error("Ошибка загрузки:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const getReadableStatus = (status?: string): string => {
    switch (status) {
      case "WILL":
        return "Планируется";
      case "PASSED":
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
          {/* Левая колонка: фото и кнопки */}
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

              {/* Кнопки организатора */}
              <Grid grow gutter="sm">
                <Grid.Col span={6}>
                  <Button
                    fullWidth
                    color="green.10"
                    radius="xl"
                    onClick={() =>
                      navigate(`/organizer/events/${event.id}/requests`)
                    }
                  >
                    Список заявок
                  </Button>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Button
                    fullWidth
                    color="green.10"
                    radius="xl"
                    onClick={() =>
                      navigate(`/organizer/events/${event.id}/edit`)
                    }
                  >
                    Редактировать данные
                  </Button>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Button
                    fullWidth
                    color="green.10"
                    radius="xl"
                    onClick={() =>
                      navigate(`/organizer/events/${event.id}/participants`)
                    }
                  >
                    Список участников
                  </Button>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Button
                    fullWidth
                    color="green.10"
                    radius="xl"
                    onClick={() => {
                      alert("Функция формирования отчёта в разработке.");
                    }}
                  >
                    Сформировать отчёт
                  </Button>
                </Grid.Col>
              </Grid>
            </Stack>
          </Grid.Col>

          {/* Правая колонка: описание и блоки */}
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
                  <Card shadow="sm" radius="xl" padding="md" withBorder>
                    <Text fw={600} mb="xs">
                      Участников
                    </Text>
                    <Text fz="sm">{event.participantsNumber ?? 0}/100</Text>
                  </Card>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Card shadow="sm" radius="xl" padding="md" withBorder>
                    <Text fw={600} mb="xs">
                      Волонтёров
                    </Text>
                    <Text fz="sm">{event.volunteersNumber ?? 0}/100</Text>
                  </Card>
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <Card shadow="sm" radius="xl" padding="md" withBorder>
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
                      <Text>🏢 {event.organization?.name || "Не указано"}</Text>
                    </Stack>
                  </Card>
                </Grid.Col>

                <Grid.Col span={6}>
                  <Card
                    shadow="sm"
                    radius="xl"
                    padding="md"
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
                      <Text>
                        👤{" "}
                        {`${fullUser?.lastName ?? ""} ${fullUser?.name ?? ""} ${
                          fullUser?.patronymic ?? ""
                        }` || "Не указан"}
                      </Text>
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
