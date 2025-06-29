import { useEffect, useState } from "react";
import { Event } from "../types/models";
import EventCard from "../components/EventCard";
import Header from "../components/Header";
import Filters from "../components/Filters";
import { Box, Container, Grid, Title } from "@mantine/core";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Мок-данные
    setEvents([
      {
        id: 1,
        title: "Волонтёрская уборка парка",
        city: "Москва",
        date: "2025-07-01T18:00:00Z",
        description: "",
        organizer_id: 1,
        participants_number: 20,
        volunteers_number: 10,
        status: "PUBLISHED",
        photo: {
          id: 1,
          upload_id: "uuid",
          filename: "cat.jpg",
        },
      },
      {
        id: 2,
        title: "Концерт молодежных групп",
        city: "Санкт-Петербург",
        date: "2025-07-05T20:00:00Z",
        description: "",
        organizer_id: 2,
        participants_number: 100,
        volunteers_number: 5,
        status: "PUBLISHED",
      },
      {
        id: 3,
        title: "Сбор помощи приюту",
        city: "Казань",
        date: "2025-07-10T12:00:00Z",
        description: "",
        organizer_id: 3,
        participants_number: 15,
        volunteers_number: 3,
        status: "PUBLISHED",
      },
      {
        id: 4,
        title: "Волонтёрская уборка парка",
        city: "Москва",
        date: "2025-07-01T18:00:00Z",
        description: "",
        organizer_id: 1,
        participants_number: 20,
        volunteers_number: 10,
        status: "PUBLISHED",
        photo: {
          id: 1,
          upload_id: "uuid",
          filename: "cat.jpg",
        },
      },
      {
        id: 5,
        title: "Волонтёрская уборка парка",
        city: "Москва",
        date: "2025-07-01T18:00:00Z",
        description: "",
        organizer_id: 1,
        participants_number: 20,
        volunteers_number: 10,
        status: "PUBLISHED",
        photo: {
          id: 1,
          upload_id: "uuid",
          filename: "cat.jpg",
        },
      },
    ]);
  }, []);

  return (
    <Box style={{ minHeight: "100vh" }}>
      <Header />
      <Container size="lg" px="md" py="xl">
        <Title order={2} mb="lg">
          Мероприятия
        </Title>

        <Filters />

        <Grid mt="lg">
          {events.map((event) => (
            <Grid.Col key={event.id} span={{ base: 12, sm: 6, md: 4 }}>
              <EventCard event={event} />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
