import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Container,
  Grid,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import Header from "../../components/Header";
import { useEventImage } from "../../hooks/useEventImage";
import { useFullUser } from "../../hooks/useFullUser";
import EventImageBlock from "../../components/EventImageBlock";
import EventDetailsInfo from "../../components/EventDetailsInfo";
import { useEventById } from "../../hooks/useEventById";

export default function OrganizerEventViewPage() {
  const fullUser = useFullUser();

  const { id } = useParams<{ id: string }>();

  const { event, loading } = useEventById(id);

  const navigate = useNavigate();

  const imageSrc = useEventImage(event?.photo);

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
              <EventImageBlock
                src={imageSrc}
                alt={event.title || "Мероприятие"}
              />

              {/* Кнопки */}
              <Grid grow gutter="sm">
                <Grid.Col span={6}>
                  <Button
                    fullWidth
                    color="green.10"
                    radius="xl"
                    onClick={() =>
                      navigate(`/organizer/events/${event.id}/requests`)
                    }
                    disabled
                  >
                    Список заявок (в разработке)
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
                    disabled
                  >
                    Сформировать отчёт (в разработке)
                  </Button>
                </Grid.Col>
              </Grid>
            </Stack>
          </Grid.Col>

          {/* Правая колонка: описание и блоки */}
          <Grid.Col span={{ base: 12, md: 6 }} h="100%">
            <EventDetailsInfo event={event} fullUser={fullUser} />
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
