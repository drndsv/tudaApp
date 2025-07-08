import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Text,
  Title,
  Stack,
  Button,
  Center,
  Loader,
} from "@mantine/core";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useFullUser } from "../hooks/useFullUser";
import { useEventImage } from "../hooks/useEventImage";
import {
  UserControllerService,
  AccountingAppUserControllerService,
  RequestControllerService,
  EventControllerService,
  EventResponseDTO,
} from "../api/generated";
import EventImageBlock from "../components/EventImageBlock";
import EventDetailsInfo from "../components/EventDetailsInfo";

export default function EventDetailsPage() {
  const { user } = useAuth();
  const fullUser = useFullUser();

  const { id } = useParams();
  const [event, setEvent] = useState<EventResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [isParticipant, setIsParticipant] = useState(false);
  const [isVolunteerPending, setIsVolunteerPending] = useState(false);
  const [isVolunteerConfirmed, setIsVolunteerConfirmed] = useState(false);

  const isOrganizer = user?.roles?.includes("ROLE_ORGANIZER");

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

  useEffect(() => {
    if (isOrganizer) return;

    const fetchStatus = async () => {
      if (user?.id && event?.id) {
        try {
          const res = await UserControllerService.getUserEventStatus(
            user.id,
            event.id
          );
          const status = res.result;
          if (status === "PARTICIPANT") {
            setIsParticipant(true);
          } else if (status === "USER_WITH_REQUEST") {
            setIsVolunteerPending(true);
          } else if (status === "VOLUNTEER") {
            setIsVolunteerConfirmed(true);
          }
        } catch (err) {
          console.error("Ошибка при получении статуса:", err);
        }
      }
    };

    fetchStatus();
  }, [user?.id, event?.id, isOrganizer]);

  const imageSrc = useEventImage(event?.photo);

  const handleJoin = async () => {
    if (!user?.sub || !event?.id) return;
    try {
      const res =
        await AccountingAppUserControllerService.saveAsParticipantForEvent(
          event.id,
          user.sub
        );
      if (!res.error) {
        setIsParticipant(true);
        setIsVolunteerPending(false);
        setIsVolunteerConfirmed(false);
      } else {
        alert("Ошибка при записи на участие: " + res.errorMassage);
      }
    } catch (err) {
      console.error("Ошибка при участии:", err);
    }
  };

  const handleVolunteer = async () => {
    if (!user?.sub || !event?.id) return;
    try {
      const res = await RequestControllerService.addRequest(event.id, user.sub);
      if (!res.error) {
        setIsVolunteerPending(true);
        setIsParticipant(false);
        setIsVolunteerConfirmed(false);
      } else {
        alert("Ошибка при подаче заявки: " + res.errorMassage);
      }
    } catch (err) {
      console.error("Ошибка при подаче заявки:", err);
    }
  };

  const handleCancel = async () => {
    if (!user?.sub || !event?.id) return;

    try {
      if (isVolunteerPending) {
        await RequestControllerService.deleteRequest(event.id, user.sub);
      } else if (isParticipant || isVolunteerConfirmed) {
        await AccountingAppUserControllerService.delete(event.id, user.sub);
      }
      setIsParticipant(false);
      setIsVolunteerPending(false);
      setIsVolunteerConfirmed(false);
    } catch (err) {
      console.error("Ошибка при отказе от участия:", err);
    }
  };

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
              <EventImageBlock
                src={imageSrc}
                alt={event.title || "Мероприятие"}
              />

              <Stack gap="sm">
                {isParticipant && (
                  <Text fz="sm" c="gray.6">
                    Вы зарегистрированы как участник
                  </Text>
                )}

                {isVolunteerConfirmed && (
                  <Text fz="sm" c="gray.6">
                    Вы зарегистрированы как волонтёр
                  </Text>
                )}

                {isVolunteerPending && (
                  <Text fz="sm" c="gray.6">
                    Ожидайте одобрения заявки на волонтёрство
                  </Text>
                )}

                {!isParticipant &&
                  !isVolunteerPending &&
                  !isVolunteerConfirmed && (
                    <>
                      <Button
                        fullWidth
                        color="green.10"
                        radius="xl"
                        disabled={isPast || isOrganizer}
                        onClick={handleJoin}
                      >
                        Участвовать
                      </Button>
                      <Button
                        fullWidth
                        color="green.10"
                        radius="xl"
                        disabled={isPast || isOrganizer}
                        onClick={handleVolunteer}
                      >
                        Подать заявку на волонтёрство
                      </Button>
                    </>
                  )}

                {(isParticipant ||
                  isVolunteerPending ||
                  isVolunteerConfirmed) && (
                  <Button
                    fullWidth
                    color="red"
                    radius="xl"
                    disabled={isPast || isOrganizer}
                    onClick={handleCancel}
                  >
                    Отказаться от участия
                  </Button>
                )}

                {isOrganizer && (
                  <Text fz="xs" c="gray.6" ta="center">
                    Действия недоступны для аккаунта организатора
                  </Text>
                )}
              </Stack>
            </Stack>
          </Grid.Col>

          {/* Правая колонка */}
          <Grid.Col span={{ base: 12, md: 6 }} h="100%">
            <EventDetailsInfo event={event} fullUser={fullUser} />
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
