import { Card, Grid, Stack, Text } from "@mantine/core";
import { EventResponseDTO } from "../api/generated";
// import { UserFull } from "../types"; // тип для fullUser — если у тебя есть, или можешь заменить на any

interface EventDetailsInfoProps {
  event: EventResponseDTO;
  fullUser?: any | null; // подставь правильный тип или используй any
}

export default function EventDetailsInfo({
  event,
  fullUser,
}: EventDetailsInfoProps) {
  return (
    <Stack gap="md" h="100%">
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

      <Grid>
        <Grid.Col span={6}>
          <Card shadow="sm" radius="xl" padding="md" withBorder>
            <Text fw={600} mb="xs">
              Участников
            </Text>
            <Text fz="sm">{event.participantsNumber ?? 0}/200</Text>
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

        <Grid.Col span={6}>
          <Card shadow="sm" radius="xl" padding="md" withBorder h="100%">
            <Text fw={600} mb="xs">
              Контактное лицо
            </Text>
            <Stack gap={4} fz="sm">
              <Text>📞 {event.organization?.phoneNumber || "Не указан"}</Text>
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
  );
}
