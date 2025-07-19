import { useEffect, useState } from "react";
import Header from "../../components/Header";
import OrganizerEventFilters from "../../components/OrganizerEventFilters";

import EventCard from "../../components/EventCard";
import { Box, Container, Grid, Title } from "@mantine/core";
import { EventControllerService, EventResponseDTO } from "../../api/generated";
import { useAuth } from "../../context/AuthContext";
import { sortByDate } from "../../utils/sortByDate";

export default function OrganizerEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventResponseDTO[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventResponseDTO[]>([]);

  const [date, setDate] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");
  const [eventStatus, setEventStatus] = useState<
    "all" | "WILL" | "PASSED" | "CANCELLED"
  >("all");
  const [role, setRole] = useState<"all" | "PARTICIPANT" | "VOLUNTEER">("all");

  useEffect(() => {
    if (!user?.id) return;

    const fetchEvents = async () => {
      try {
        let response;

        if (role !== "all") {
          response =
            await EventControllerService.getEventsByNeededRoleForOrganizer(
              role,
              user.id!
            );
        } else {
          response =
            await EventControllerService.getOrganizationEventsByOrganizerId(
              user.id!
            );
        }

        if (!response.error && response.result) {
          setEvents(response.result);
        } else {
          console.error("Ошибка в ответе:", response.errorMassage);
        }
      } catch (err) {
        console.error("Ошибка при получении мероприятий:", err);
      }
    };

    fetchEvents();
  }, [user?.id, role]);

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

    if (eventStatus !== "all") {
      filtered = filtered.filter((event) => event.eventStatus === eventStatus);
    }

    setFilteredEvents(sortByDate(filtered));
  }, [date, citySearch, eventSearch, events, eventStatus]);

  const resetFilters = () => {
    setDate(null);
    setCitySearch("");
    setEventSearch("");
    setEventStatus("all");
    setRole("all");
  };

  const uniqueCities = Array.from(
    new Set(
      events.map((event) => event.city).filter((city): city is string => !!city)
    )
  ).sort();

  return (
    <Box style={{ minHeight: "100vh" }}>
      <Header />
      <Container size="lg" px="md" py="xl">
        <Title order={2} mb="lg">
          Мероприятия вашей организации
        </Title>
        <OrganizerEventFilters
          date={date}
          setDate={setDate}
          citySearch={citySearch}
          setCitySearch={setCitySearch}
          eventSearch={eventSearch}
          setEventSearch={setEventSearch}
          eventStatus={eventStatus}
          setEventStatus={setEventStatus}
          role={role}
          setRole={setRole}
          resetFilters={resetFilters}
          cities={uniqueCities}
        />

        <Grid mt="lg">
          {filteredEvents.map((event) => (
            <Grid.Col key={event.id} span={{ base: 12, sm: 6, md: 4 }}>
              <EventCard event={event} navigateTo="organizer" />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
