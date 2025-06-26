import { useEffect, useState } from "react";
import { Event } from "../types/models";
import EventCard from "../components/EventCard";
import Header from "../components/Header";
import Filters from "../components/Filters";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Мок-данные. Позже заменим на API
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
    ]);
  }, []);

  return (
    <div className="bg-cream min-h-screen text-dark">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-2">Мероприятия</h1>
        <Filters />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </main>
    </div>
  );
}
