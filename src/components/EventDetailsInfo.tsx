import { useEffect, useState } from "react";
import { Card, Grid, Stack, Text } from "@mantine/core";
import {
  AppUserResponseDTO,
  EventControllerService,
  EventResponseDTO,
} from "../api/generated";

interface EventDetailsInfoProps {
  event: EventResponseDTO;
}

export default function EventDetailsInfo({ event }: EventDetailsInfoProps) {
  const [participantCount, setParticipantCount] = useState<number | null>(null);
  const [volunteerCount, setVolunteerCount] = useState<number | null>(null);
  const [contactPerson, setContactPerson] = useState<AppUserResponseDTO | null>(
    null
  );

  const participantLimit = event.participantsNumber ?? "";
  const volunteerLimit = event.volunteersNumber ?? "";

  useEffect(() => {
    if (!event.id) return;

    EventControllerService.getUserCountWithCertainRoleOnEvent(
      "PARTICIPANT",
      event.id
    ).then((res) => {
      if (!res.error && typeof res.result === "number") {
        setParticipantCount(res.result);
      } else {
        console.warn("Ошибка загрузки участников:", res.errorMassage);
      }
    });

    EventControllerService.getUserCountWithCertainRoleOnEvent(
      "VOLUNTEER",
      event.id
    ).then((res) => {
      if (!res.error && typeof res.result === "number") {
        setVolunteerCount(res.result);
      } else {
        console.warn("Ошибка загрузки волонтёров:", res.errorMassage);
      }
    });

    EventControllerService.getContactPersonOfEvent(event.id).then((res) => {
      if (!res.error && res.result) {
        setContactPerson(res.result);
      } else {
        console.warn("Ошибка загрузки контактного лица:", res.errorMassage);
      }
    });
  }, [event.id]);

  return (
    <Stack gap="md" h="100%">
      {/* Описание */}
      <Card
        shadow="sm"
        radius="xl"
        padding="md"
        bg="white"
        withBorder
        style={{ minHeight: 120 }}
      >
        <Text fw={600} mb="xs">
          Описание
        </Text>
        <Text fz="sm">{event.description || "Нет описания."}</Text>
      </Card>

      {/* Участники и волонтёры */}
      <Grid>
        <Grid.Col span={6}>
          <Card shadow="sm" radius="xl" padding="md" withBorder>
            <Text fw={600} mb="xs">
              Участников
            </Text>
            <Text fz="sm">
              {participantCount !== null
                ? `${participantCount}/${participantLimit}`
                : "Загрузка..."}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={6}>
          <Card shadow="sm" radius="xl" padding="md" withBorder>
            <Text fw={600} mb="xs">
              Волонтёров
            </Text>
            <Text fz="sm">
              {volunteerCount !== null
                ? `${volunteerCount}/${volunteerLimit}`
                : "Загрузка..."}
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Основная информация */}
      <Grid>
        <Grid.Col span={6}>
          <Card shadow="sm" radius="xl" padding="md" withBorder h="100%">
            <Text fw={600} mb="xs">
              Основная информация
            </Text>
            <Stack gap={4} fz="sm">
              <Text>
                📅{" "}
                {event.date ? new Date(event.date).toLocaleDateString() : "—"}
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
                🏢 {event.organization?.name || "Организация не указана"}
              </Text>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Контактное лицо */}
        <Grid.Col span={6}>
          <Card shadow="sm" radius="xl" padding="md" withBorder h="100%">
            <Text fw={600} mb="xs">
              Контактное лицо
            </Text>
            <Stack gap={4} fz="sm">
              <Text>📞 {event.organization?.phoneNumber || "Не указан"}</Text>
              <Text>
                👤{" "}
                {contactPerson
                  ? `${contactPerson.lastName ?? ""} ${
                      contactPerson.name ?? ""
                    } ${contactPerson.patronymic ?? ""}`.trim()
                  : "Не указано"}
              </Text>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
