import { useEffect, useState } from "react";
import Header from "../components/Header";
import UserEventFilters from "../components/UserEventFilters";
import EventCard from "../components/EventCard";
import { Box, Container, Grid, Title } from "@mantine/core";
import { EventControllerService } from "../api/generated/services/EventControllerService";
import { EventResponseDTO } from "../api/generated/models/EventResponseDTO";
import { useAuth } from "../context/AuthContext";

export default function UserEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventResponseDTO[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventResponseDTO[]>([]);

  const [date, setDate] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");
  const [visitStatus, setVisitStatus] = useState<
    "all" | "visited" | "notVisited"
  >("all");

  useEffect(() => {
    if (!user?.id) return;

    EventControllerService.getEventsByUserId(user.id)
      .then((response) => {
        console.log("Ответ от сервера:", response);
        if (!response.error && response.result) {
          setEvents(response.result);
        } else {
          console.error("Ошибка в ответе:", response.errorMassage);
        }
      })
      .catch((err) => {
        console.error("Ошибка при получении мероприятий:", err);
      });
  }, [user?.id]);

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

    // if (visitStatus !== "all") {
    //   filtered = filtered.filter((event) =>
    //     visitStatus === "visited"
    //       ? event.status === true
    //       : event.status === false
    //   );
    // }

    setFilteredEvents(filtered);
  }, [
    date,
    citySearch,
    eventSearch,
    events,
    // timeFilter,
    // roleFilter,
    visitStatus,
  ]);

  const resetFilters = () => {
    setDate(null);
    setCitySearch("");
    setEventSearch("");
    // setTimeFilter("all");
    // setRoleFilter([]);
    setVisitStatus("all");
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
          Ваши мероприятия
        </Title>
        <UserEventFilters
          date={date}
          setDate={setDate}
          citySearch={citySearch}
          setCitySearch={setCitySearch}
          eventSearch={eventSearch}
          setEventSearch={setEventSearch}
          visitStatus={visitStatus}
          setVisitStatus={setVisitStatus}
          resetFilters={resetFilters}
          cities={uniqueCities}
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
