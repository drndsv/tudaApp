import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

import { useEventImage } from "../hooks/useEventImage";
import {
  UserControllerService,
  AccountingAppUserControllerService,
  RequestControllerService,
} from "../api/generated";
import EventImageBlock from "../components/EventImageBlock";
import EventDetailsInfo from "../components/EventDetailsInfo";
import { showNotification } from "@mantine/notifications";

import GuestJoinModal from "../components/GuestJoinModal";
import { GuestControllerService } from "../api/generated";
import { useEventById } from "../hooks/useEventById";

export default function EventDetailsPage() {
  const { user } = useAuth();

  const { id } = useParams();

  const { event, loading } = useEventById(id);

  const [isParticipant, setIsParticipant] = useState(false);
  const [isVolunteerPending, setIsVolunteerPending] = useState(false);
  const [isVolunteerConfirmed, setIsVolunteerConfirmed] = useState(false);

  const isOrganizer = user?.roles?.includes("ROLE_ORGANIZER");
  const imageSrc = useEventImage(event?.photo);

  const [guestModalOpened, setGuestModalOpened] = useState(false);

  const navigate = useNavigate();

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

  const handleJoin = async () => {
    if (!event?.id) return;

    if (!user?.sub) {
      setGuestModalOpened(true);
      return;
    }

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
        showNotification({
          title: "Ошибка при записи на участие",
          message: res.errorMassage,
          color: "red",
        });
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
        showNotification({
          title: "Ошибка при подаче заявки",
          message: res.errorMassage,
          color: "red",
        });
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

  const handleGuestSubmit = async (fullName: string, mail: string) => {
    if (!event?.id) return;
    try {
      const res = await GuestControllerService.addGuest({
        event: event.id,
        fullName,
        mail,
        status: true,
      });
      if (!res.error) {
        showNotification({
          title: "Вы успешно зарегистрированы как участник",
          message: "",
          color: "green",
        });
        setGuestModalOpened(false);
      } else {
        showNotification({
          title: "Ошибка",
          message: res.errorMassage,
          color: "red",
        });
      }
    } catch (err) {
      console.error("Ошибка регистрации гостя:", err);
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

  {
    /* Доступ к кнопкам */
  }
  const isPast = new Date(event.date || "") < new Date();
  const isInactiveStatus =
    event.eventStatus === "CANCELLED" || event.eventStatus === "PASSED";

  const isDisabled = isPast || isInactiveStatus || isOrganizer;

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
                        disabled={isDisabled}
                        onClick={handleJoin}
                      >
                        Участвовать
                      </Button>
                      <Button
                        fullWidth
                        color="green.10"
                        radius="xl"
                        disabled={isDisabled || !user}
                        onClick={handleVolunteer}
                      >
                        Подать заявку на волонтёрство
                      </Button>

                      {!user && (
                        <Text fz="xs" c="gray.6" ta="center">
                          Доступно только для авторизованных пользователей
                        </Text>
                      )}
                    </>
                  )}

                {(isParticipant ||
                  isVolunteerPending ||
                  isVolunteerConfirmed) && (
                  <Button
                    fullWidth
                    color="red"
                    radius="xl"
                    disabled={isDisabled}
                    onClick={handleCancel}
                  >
                    Отказаться от участия
                  </Button>
                )}

                {isVolunteerConfirmed && (
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
            {/* <EventDetailsInfo event={event} fullUser={fullUser} /> */}
            <EventDetailsInfo event={event} />
          </Grid.Col>
        </Grid>
      </Container>

      <GuestJoinModal
        opened={guestModalOpened}
        onClose={() => setGuestModalOpened(false)}
        onSubmit={handleGuestSubmit}
      />
    </Box>
  );
}
