import { Box, Button, Container, Grid, Stack } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/Header";
import {
  EventControllerService,
  EventRequestDTO,
  PhotoResponseDTO,
} from "../../api/generated";
import { useFullUser } from "../../hooks/useFullUser";
import ImageUploadBlock from "../../components/ImageUploadBlock";
import EventForm from "../../components/EventForm";
import dayjs from "dayjs";
import { uploadImage } from "../../hooks/uploadImage";
import { showNotification } from "@mantine/notifications";

export default function CreateEventPage() {
  const navigate = useNavigate();
  const fullUser = useFullUser();

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
  const [timeValue, setTimeValue] = useState("");
  const [eventStatus, setEventStatus] = useState("WILL");

  const [photo, setPhoto] = useState<PhotoResponseDTO | null>(null);
  const [filename, setFilename] = useState<string | undefined>(undefined);
  const [uploadId, setUploadId] = useState<string | undefined>(undefined);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadImage(file);

    if (result.error) {
      showNotification({
        title: "Ошибка загрузки изображения",
        message: result.error,
        color: "red",
      });
    } else if (result.photo) {
      setPhoto(result.photo);
      setFilename(result.filename);
      setUploadId(result.uploadId);
      showNotification({
        title: "Изображение загружено",
        message: "Файл успешно загружен",
        color: "green",
      });
    }
  };

  const handleSubmit = async () => {
    if (!dateValue) {
      showNotification({
        title: "Некорректные данные",
        message: "Укажите дату мероприятия",
        color: "red",
      });
      return;
    }

    const [hours, minutes] = timeValue.split(":");
    const localDate = dayjs(dateValue)
      .hour(Number(hours))
      .minute(Number(minutes))
      .second(0)
      .millisecond(0);

    const payload: EventRequestDTO = {
      title,
      description,
      city,
      organizationId: fullUser?.organization?.id,
      participantsNumber,
      volunteersNumber,
      date: localDate.format("YYYY-MM-DDTHH:mm:ss"),
      eventStatus,
      filename,
      uploadId,
    };

    try {
      const response = await EventControllerService.addEvent(payload);
      if (!response.error) {
        showNotification({
          title: "Успех",
          message: "Мероприятие успешно создано",
          color: "green",
        });
        navigate("/");
      } else {
        showNotification({
          title: "Ошибка создания",
          message: response.errorMassage,
          color: "red",
        });
      }
    } catch (err) {
      console.error(err);
      showNotification({
        title: "Системная ошибка",
        message: "Произошла ошибка при создании мероприятия",
        color: "red",
      });
    }
  };

  return (
    <Box>
      <Header />
      <Container size="lg" py="xl">
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <ImageUploadBlock
              photoUploaded={!!photo}
              onImageUpload={handleImageUpload}
            />

            <Stack mt="md">
              <Button color="green.10" radius="xl" onClick={handleSubmit}>
                Сохранить
              </Button>
              <Button
                variant="default"
                radius="xl"
                onClick={() => navigate(-1)}
              >
                Отмена
              </Button>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <EventForm
              title={title}
              description={description}
              volunteersNumber={volunteersNumber}
              participantsNumber={participantsNumber}
              city={city}
              date={dateValue}
              time={timeValue}
              eventStatus={eventStatus}
              onChange={{
                setTitle,
                setDescription,
                setVolunteersNumber,
                setParticipantsNumber,
                setCity,
                setDate: setDateValue,
                setTime: setTimeValue,
                setStatus: setEventStatus,
              }}
            />
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
