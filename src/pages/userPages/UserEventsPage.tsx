import { useEffect, useState } from "react";
import Header from "../../components/Header";
import UserEventFilters from "../../components/UserEventFilters";
import EventCard from "../../components/EventCard";
import { Box, Container, Grid, Title } from "@mantine/core";
import { EventControllerService, EventResponseDTO } from "../../api/generated";
import { useAuth } from "../../context/AuthContext";
import { sortByDate } from "../../utils/sortByDate";

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
  const [role, setRole] = useState<"all" | "PARTICIPANT" | "VOLUNTEER">("all");

  useEffect(() => {
    if (!user?.id) return;

    const fetchEvents = async () => {
      try {
        if (visitStatus === "all" && role === "all") {
          const res = await EventControllerService.getEventsByUserId(user.id!);
          if (!res.error && res.result) setEvents(res.result);
          return;
        }

        if (visitStatus !== "all" && role === "all") {
          const statusParam =
            visitStatus === "visited" ? "PRESENTED" : "ABSENT";
          const res =
            await EventControllerService.getEventsByAppUserIdAndAttendanceStatus(
              user.id!,
              statusParam
            );
          if (!res.error && res.result) setEvents(res.result);
          return;
        }

        if (visitStatus === "all" && role !== "all") {
          const res = await EventControllerService.getEventsByAppUserIdAndRole(
            user.id!,
            role as "PARTICIPANT" | "VOLUNTEER"
          );
          if (!res.error && res.result) setEvents(res.result);
          return;
        }

        const statusParam = visitStatus === "visited" ? "PRESENTED" : "ABSENT";

        const [statusRes, roleRes] = await Promise.all([
          EventControllerService.getEventsByAppUserIdAndAttendanceStatus(
            user.id!,
            statusParam
          ),
          EventControllerService.getEventsByAppUserIdAndRole(
            user.id!,
            role as "PARTICIPANT" | "VOLUNTEER"
          ),
        ]);

        if (
          !statusRes.error &&
          !roleRes.error &&
          statusRes.result &&
          roleRes.result
        ) {
          const statusIds = new Set(statusRes.result.map((e) => e.id));
          const commonEvents = roleRes.result.filter((e) =>
            statusIds.has(e.id)
          );
          setEvents(commonEvents);
        }
      } catch (err) {
        console.error("Ошибка при загрузке мероприятий:", err);
      }
    };

    fetchEvents();
  }, [user?.id, visitStatus, role]);

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
          role={role}
          setRole={setRole}
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
