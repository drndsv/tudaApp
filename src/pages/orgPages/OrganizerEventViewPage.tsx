import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Container,
  Grid,
  Loader,
  Menu,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import Header from "../../components/Header";
import { useEventImage } from "../../hooks/useEventImage";
import EventImageBlock from "../../components/EventImageBlock";
import EventDetailsInfo from "../../components/EventDetailsInfo";
import { useEventById } from "../../hooks/useEventById";
import { IconDownload } from "@tabler/icons-react";
import { ReportControllerService } from "../../api/generated/services/ReportControllerService";

export default function OrganizerEventViewPage() {
  const { id } = useParams<{ id: string }>();

  const { event, loading } = useEventById(id);

  const navigate = useNavigate();

  const imageSrc = useEventImage(event?.photo);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  const handleDownloadCSV = async () => {
    if (!event?.id) return;

    try {
      const pdfString = await ReportControllerService.getCvsReport(event.id);
      // Преобразуем строку в Blob (UTF-8)
      const blob = new Blob([pdfString], { type: "text/csv" });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report_event_${event.id}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Ошибка загрузки csv отчета:", err);
    }
  };

  const handleDownloadPDF = async () => {
    if (!event?.id) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/report/pdf/download?eventId=${event.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при получении отчета");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report_event_${event.id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Ошибка загрузки pdf отчета:", err);
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
          {/* Левая часть */}
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
                  <Menu shadow="md" width={200} radius="md" withArrow>
                    <Menu.Target>
                      <Button
                        fullWidth
                        color="green.10"
                        radius="xl"
                        leftSection={<IconDownload size={18} />}
                      >
                        Сформировать отчёт
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item onClick={handleDownloadCSV}>CSV</Menu.Item>
                      <Menu.Item onClick={handleDownloadPDF}>PDF</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Grid.Col>
              </Grid>
            </Stack>
          </Grid.Col>

          {/* Правая часть*/}
          <Grid.Col span={{ base: 12, md: 6 }} h="100%">
            <EventDetailsInfo event={event} />
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
