import { Box, Button, Container, Grid, Stack, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import {
  EventControllerService,
  EventRequestDTO,
  PhotoResponseDTO,
} from "../../api/generated";
import { useFullUser } from "../../hooks/useFullUser";
import EventForm from "../../components/EventForm";
import ImageUploadBlock from "../../components/ImageUploadBlock";
import dayjs from "dayjs";
import { uploadImage } from "../../hooks/uploadImage";
import { showNotification } from "@mantine/notifications";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
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
  const [timeValue, setTimeValue] = useState<string>("");
  const [eventStatus, setEventStatus] = useState("WILL");

  const [photo, setPhoto] = useState<PhotoResponseDTO | null>(null);
  const [filename, setFilename] = useState<string | undefined>(undefined);
  const [uploadId, setUploadId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const response = await EventControllerService.getEventById(Number(id));
        if (!response.error && response.result) {
          const e = response.result;
          setTitle(e.title ?? "");
          setDescription(e.description ?? "");
          setVolunteersNumber(e.volunteersNumber ?? undefined);
          setParticipantsNumber(e.participantsNumber ?? undefined);
          setCity(e.city ?? "");
          setEventStatus(e.eventStatus ?? "WILL");

          if (e.date) {
            const parsed = dayjs(e.date);
            setDateValue(parsed.toDate());
            setTimeValue(parsed.format("HH:mm"));
          }

          if (e.photo) {
            setPhoto(e.photo);
            setFilename(e.photo.filename);
            setUploadId(e.photo.uploadId);
          }
        } else {
          showNotification({
            title: "Ошибка загрузки мероприятия",
            message: response.errorMassage,
            color: "red",
          });
        }
      } catch (err) {
        console.error(err);
        showNotification({
          title: "Ошибка",
          message: "Ошибка при загрузке мероприятия",
          color: "red",
        });
      }
    };

    load();
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadImage(file);

    if (result.error) {
      showNotification({
        title: "Ошибка при загрузке изображения",
        message: result.error,
        color: "red",
      });
    } else if (result.photo) {
      setPhoto(result.photo);
      setFilename(result.filename);
      setUploadId(result.uploadId);
    }
  };

  const handleSubmit = async () => {
    if (!dateValue || !id) {
      showNotification({
        title: "Ошибка",
        message: "Укажите дату мероприятия",
        color: "red",
      });
      return;
    }
    console.log("Отправляем filename, uploadId:", filename, uploadId);

    const [h, m] = timeValue.split(":");
    const localDate = dayjs(dateValue)
      .hour(Number(h))
      .minute(Number(m))
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
      const response = await EventControllerService.updateEvent(
        Number(id),
        payload
      );
      if (!response.error) {
        showNotification({
          title: "Успешно",
          message: "Мероприятие обновлено",
          color: "green",
        });
        navigate(`/organizer/events/${id}`);
      } else {
        showNotification({
          title: "Ошибка при обновлении",
          message: response.errorMassage,
          color: "red",
        });
      }
    } catch (err) {
      console.error(err);
      showNotification({
        title: "Системная ошибка",
        message: "Ошибка при обновлении мероприятия",
        color: "red",
      });
    }
  };

  return (
    <Box>
      <Header />
      <Container size="lg" py="xl">
        <Title order={2} mb="lg">
          Редактирование мероприятия
        </Title>

        <Grid gutter="xl">
          {/* Левая часть */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <ImageUploadBlock
              photoUploaded={!!photo}
              onImageUpload={handleImageUpload}
              label="Заменить изображение"
            />
            <Stack mt="md">
              <Button color="green.10" radius="xl" onClick={handleSubmit}>
                Сохранить изменения
              </Button>
              <Button
                variant="default"
                radius="xl"
                onClick={() => navigate(-1)}
              >
                Отмена редактирования
              </Button>
            </Stack>
          </Grid.Col>

          {/* Правая часть */}
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
