import {
  Card,
  Grid,
  Select,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { useFullUser } from "../hooks/useFullUser";

type Props = {
  title: string;
  description: string;
  volunteersNumber?: number;
  participantsNumber?: number;
  city: string;
  date: Date | null;
  time: string;
  eventStatus: string;
  onChange: {
    setTitle: (val: string) => void;
    setDescription: (val: string) => void;
    setVolunteersNumber: (val: number) => void;
    setParticipantsNumber: (val: number) => void;
    setCity: (val: string) => void;
    setDate: (val: Date | null) => void;
    setTime: (val: string) => void;
    setStatus: (val: string) => void;
  };
};

export default function EventForm({
  title,
  description,
  volunteersNumber,
  participantsNumber,
  city,
  date,
  time,
  eventStatus,
  onChange,
}: Props) {
  const fullUser = useFullUser();

  return (
    <>
      <TextInput
        label="Название мероприятия"
        value={title}
        onChange={(e) => onChange.setTitle(e.currentTarget.value)}
      />

      <Textarea
        label="Описание"
        value={description}
        onChange={(e) => onChange.setDescription(e.currentTarget.value)}
        minRows={4}
        mt="md"
      />

      <Grid mt="md">
        <Grid.Col span={6}>
          <TextInput
            label="Лимит волонтёров"
            type="number"
            value={volunteersNumber ?? ""}
            onChange={(e) =>
              onChange.setVolunteersNumber(Number(e.currentTarget.value))
            }
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Лимит участников"
            type="number"
            value={participantsNumber ?? ""}
            onChange={(e) =>
              onChange.setParticipantsNumber(Number(e.currentTarget.value))
            }
          />
        </Grid.Col>
      </Grid>

      <Card withBorder radius="xl" mt="md" p="md">
        <Title order={5} mb="sm">
          Основная информация
        </Title>

        <DateInput
          label="Дата"
          value={date}
          onChange={(val) => onChange.setDate(val as Date | null)}
        />
        <TimeInput
          label="Время"
          value={time}
          onChange={(e) => onChange.setTime(e.currentTarget.value)}
        />
        <TextInput
          label="Город"
          value={city}
          onChange={(e) => onChange.setCity(e.currentTarget.value)}
        />
        <Select
          label="Статус мероприятия"
          value={eventStatus}
          onChange={(val) => onChange.setStatus(val || "WILL")}
          data={[
            { value: "WILL", label: "Планируется" },
            { value: "PASSED", label: "Завершено" },
            { value: "CANCELLED", label: "Отменено" },
          ]}
          mt="md"
        />
        <TextInput
          label="Организация"
          value={fullUser?.organization?.name || ""}
          disabled
        />
      </Card>

      <Card withBorder radius="xl" mt="md" p="md">
        <Title order={5} mb="sm">
          Контактное лицо
        </Title>
        <TextInput
          label="ФИО"
          value={`${fullUser?.lastName ?? ""} ${fullUser?.name ?? ""} ${
            fullUser?.patronymic ?? ""
          }`}
          disabled
        />
        <TextInput
          label="Номер телефона"
          value={fullUser?.phoneNumber || ""}
          disabled
        />
      </Card>

      <Text mt="md" c="gray.6" fz="xs">
        Организацию и контактное лицо можно поменять только в личном кабинете
      </Text>
    </>
  );
}
