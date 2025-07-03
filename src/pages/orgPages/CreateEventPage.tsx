import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  rem,
} from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { useState } from "react";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { EventControllerService } from "../../api/generated/services/EventControllerService";
import { EventRequestDTO } from "../../api/generated/models/EventRequestDTO";

export default function CreateEventPage() {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [volunteersNumber, setVolunteersNumber] = useState<
    number | undefined
  >();
  const [participantsNumber, setParticipantsNumber] = useState<
    number | undefined
  >();
  const [city, setCity] = useState("");
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [timeValue, setTimeValue] = useState<string>("");

  const handleSubmit = async () => {
    if (!dateValue) {
      alert("Укажите дату");
      return;
    }

    const date = new Date(dateValue);
    if (timeValue) {
      const [hours, minutes] = timeValue.split(":");
      date.setHours(Number(hours), Number(minutes));
    }

    const payload: EventRequestDTO = {
      title,
      description,
      city,
      organizationId: user?.organizationId,
      participantsNumber,
      volunteersNumber,
      date: date.toISOString(),
      // filename и uploadId можно добавить позже при реализации загрузки
    };

    try {
      const response = await EventControllerService.addEvent(payload);
      if (!response.error) {
        alert("Мероприятие успешно создано");
        // TODO: navigate("/organizerEvents");
      } else {
        alert("Ошибка: " + response.errorMassage);
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка при создании мероприятия");
    }
  };

  return (
    <Box>
      <Header />
      <Container size="lg" py="xl">
        <Title order={2} mb="lg">
          Создание мероприятия
        </Title>

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Box
              h={320}
              style={{
                borderRadius: rem(16),
                overflow: "hidden",
                border: "1px dashed gray",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>Изображение (загрузка будет реализована позже)</Text>
            </Box>

            <Stack mt="md">
              <Button color="green.10" radius="xl" onClick={handleSubmit}>
                Сохранить
              </Button>
              <Button variant="default" radius="xl">
                Отмена редактирования
              </Button>
              <Button color="red" radius="xl">
                Отменить мероприятие
              </Button>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Название мероприятия"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />

            <Textarea
              label="Описание"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
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
                    setVolunteersNumber(Number(e.currentTarget.value))
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Лимит участников"
                  type="number"
                  value={participantsNumber ?? ""}
                  onChange={(e) =>
                    setParticipantsNumber(Number(e.currentTarget.value))
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
                value={dateValue}
                onChange={(value) => {
                  if (value) {
                    setDateValue(new Date(value));
                  } else {
                    setDateValue(null);
                  }
                }}
              />

              <TimeInput
                label="Время"
                value={timeValue}
                onChange={(event) => setTimeValue(event.currentTarget.value)}
              />

              <TextInput
                label="Город"
                value={city}
                onChange={(e) => setCity(e.currentTarget.value)}
              />
              <TextInput
                label="Организация"
                value={user?.organizationName || ""}
                disabled
              />
            </Card>

            <Card withBorder radius="xl" mt="md" p="md">
              <Title order={5} mb="sm">
                Контактное лицо
              </Title>
              <TextInput
                label="ФИО"
                value={user?.name + " " + user?.lastName}
                disabled
              />
              <TextInput
                label="Номер телефона"
                value={user?.phoneNumber}
                disabled
              />
              <TextInput label="Почта" value={user?.email} disabled />
            </Card>

            <Text mt="md" c="gray.6" fz="xs">
              Организацию и контактное лицо можно поменять только в личном
              кабинете
            </Text>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
