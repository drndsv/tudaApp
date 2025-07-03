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
  Select,
} from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { EventControllerService } from "../../api/generated/services/EventControllerService";
import { EventRequestDTO } from "../../api/generated/models/EventRequestDTO";
import { UserControllerService } from "../../api/generated/services/UserControllerService";
import { AppUserResponseDTO } from "../../api/generated/models/AppUserResponseDTO";
import { ImageControllerService } from "../../api/generated/services/ImageControllerService";
import { PhotoResponseDTO } from "../../api/generated/models/PhotoResponseDTO";
import { useNavigate } from "react-router-dom";

export default function CreateEventPage() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const [fullUser, setFullUser] = useState<AppUserResponseDTO | null>(null);

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
  const [eventStatus, setEventStatus] = useState("WILL");

  const [photo, setPhoto] = useState<PhotoResponseDTO | null>(null);
  const [filename, setFilename] = useState<string | undefined>(undefined);
  const [uploadId, setUploadId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (user?.id) {
      UserControllerService.getUser(user.id)
        .then((res) => {
          if (!res.error && res.result) {
            setFullUser(res.result);
          } else {
            console.error("Ошибка получения пользователя:", res.errorMassage);
          }
        })
        .catch((err) => {
          console.error("Ошибка при получении данных пользователя:", err);
        });
    }
  }, [user?.id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await ImageControllerService.uploadImage({ file });
      if (!response.error && response.result) {
        setPhoto(response.result);
        setFilename(response.result.filename);
        setUploadId(response.result.uploadId);
      } else {
        alert(
          "Ошибка при загрузке изображения (возможно слишком большой объем): " +
            response.errorMassage
        );
      }
    } catch (err) {
      console.error("Ошибка загрузки изображения", err);
      alert("Ошибка при загрузке изображения");
    }
  };

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
      organizationId: fullUser?.organization?.id,
      participantsNumber,
      volunteersNumber,
      date: date.toISOString(),
      eventStatus,
      filename,
      uploadId,
    };

    try {
      const response = await EventControllerService.addEvent(payload);
      if (!response.error) {
        alert("Мероприятие успешно создано");
        navigate("/");
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
                flexDirection: "column",
              }}
            >
              {photo ? (
                <Text c="green">Изображение загружено</Text>
              ) : (
                <Text>Изображение не выбрано</Text>
              )}

              <label htmlFor="file-upload">
                <Button component="span" mt="sm" radius="xl">
                  Выбрать изображение
                </Button>
              </label>

              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
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
                onChange={(value) =>
                  value ? setDateValue(new Date(value)) : setDateValue(null)
                }
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

              <Select
                label="Статус мероприятия"
                value={eventStatus}
                onChange={(val) => setEventStatus(val || "WILL")}
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
              Организацию и контактное лицо можно поменять только в личном
              кабинете
            </Text>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
