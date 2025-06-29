import { useEffect, useState } from "react";
import Header from "../components/Header";
import Filters from "../components/Filters";
import EventCard from "../components/EventCard";
import { Box, Container, Grid, Title } from "@mantine/core";

import { EventControllerService } from "../api/generated/services/EventControllerService";
import { EventResponseDTO } from "../api/generated/models/EventResponseDTO";

export default function EventsPage() {
  const [events, setEvents] = useState<EventResponseDTO[]>([]);

  useEffect(() => {
    EventControllerService.getAllEvents()
      .then((response) => {
        if (!response.error && response.result) {
          setEvents(response.result);
        } else {
          console.error("Ошибка в ответе:", response.errorMassage);
        }
      })
      .catch((err) => {
        console.error("Ошибка при получении мероприятий:", err);
      });
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
