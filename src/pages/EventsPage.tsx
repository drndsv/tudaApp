import { useEffect, useState } from "react";
import Header from "../components/Header";
import Filters from "../components/Filters";
import EventCard from "../components/EventCard";
import { Box, Container, Grid, Title } from "@mantine/core";
import { EventControllerService, EventResponseDTO } from "../api/generated";
import { sortByDate } from "../utils/sortByDate";

export default function EventsPage() {
  const [events, setEvents] = useState<EventResponseDTO[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventResponseDTO[]>([]);

  const [date, setDate] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        let response;
        if (selectedRoles.length === 1) {
          response = await EventControllerService.getEventsByNeededRoleForUser(
            selectedRoles[0] as "PARTICIPANT" | "VOLUNTEER"
          );
        } else {
          response = await EventControllerService.getAllEvents();
        }

        if (!response.error && response.result) {
          setEvents(response.result);
        } else {
          console.error("Ошибка в ответе:", response.errorMassage);
          setEvents([]);
        }
      } catch (err) {
        console.error("Ошибка при получении мероприятий:", err);
        setEvents([]);
      }
    };

    loadEvents();
  }, [selectedRoles]);

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

    setFilteredEvents(sortByDate(filtered));
  }, [date, citySearch, eventSearch, events]);

  const resetFilters = () => {
    setDate(null);
    setCitySearch("");
    setEventSearch("");
    setSelectedRoles([]);
  };

  const uniqueCities = Array.from(
    new Set(
      events
        .map((event) => event.city)
        .filter((city): city is string => typeof city === "string")
    )
  ).sort();

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
          cities={uniqueCities}
          selectedRoles={selectedRoles}
          setSelectedRoles={setSelectedRoles}
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
