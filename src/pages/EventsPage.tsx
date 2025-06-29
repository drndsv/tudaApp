import { useEffect, useState } from "react";
import Header from "../components/Header";
import Filters from "../components/Filters";
import EventCard from "../components/EventCard";
import { Box, Container, Grid, Title } from "@mantine/core";

import { EventControllerService } from "../api/generated/services/EventControllerService";
import { EventResponseDTO } from "../api/generated/models/EventResponseDTO";

export default function EventsPage() {
  const [events, setEvents] = useState<EventResponseDTO[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventResponseDTO[]>([]);

  const [date, setDate] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");

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

  useEffect(() => {
    let filtered = [...events];

    if (date) {
      const selected = new Date(date).toDateString();
      filtered = filtered.filter((event) => {
        if (!event.date) return false;
        return new Date(event.date).toDateString() === selected;
      });
    }

    if (citySearch) {
      filtered = filtered.filter((event) =>
        event.city?.toLowerCase().includes(citySearch.toLowerCase())
      );
    }

    if (eventSearch) {
      filtered = filtered.filter((event) =>
        event.title?.toLowerCase().includes(eventSearch.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [date, citySearch, eventSearch, events]);

  const resetFilters = () => {
    setDate(null);
    setCitySearch("");
    setEventSearch("");
  };

  return (
    <Box style={{ minHeight: "100vh" }}>
      <Header />
      <Container size="lg" px="md" py="xl">
        <Title order={2} mb="lg">
          Мероприятия
        </Title>
        <Filters
          date={date}
          setDate={setDate}
          citySearch={citySearch}
          setCitySearch={setCitySearch}
          eventSearch={eventSearch}
          setEventSearch={setEventSearch}
          resetFilters={resetFilters}
        />
        <Grid mt="lg">
          {filteredEvents.map((event) => (
            <Grid.Col key={event.id} span={{ base: 12, sm: 6, md: 4 }}>
              <EventCard event={event} />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
