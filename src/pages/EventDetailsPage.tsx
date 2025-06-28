import { useParams } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import InfoCard from "../components/InfoCard";
import PrimaryButton from "../components/PrimaryButton";
import { Event } from "../types/models";

const mockEvent: Event = {
  id: 1,
  title: "Волонтёрская уборка парка",
  city: "Москва",
  date: "2025-07-01T18:00:00Z",
  description: "Убираем парк вместе с жителями района!",
  organizer_id: 1,
  participants_number: 100,
  volunteers_number: 5,
  status: "PUBLISHED",
  photo: {
    id: 1,
    upload_id: "uuid",
    filename: "cat.jpg",
  },
};

export default function EventDetailsPage() {
  const { id } = useParams();
  const event = mockEvent;

  const isPast = new Date(event.date) < new Date();

  const [isParticipant, setIsParticipant] = useState(false);
  const [isVolunteerPending, setIsVolunteerPending] = useState(false);

  const handleJoin = () => {
    setIsParticipant(true);
    setIsVolunteerPending(false);
  };

  const handleVolunteer = () => {
    setIsVolunteerPending(true);
    setIsParticipant(false);
  };

  const handleCancel = () => {
    setIsParticipant(false);
    setIsVolunteerPending(false);
  };

  return (
    <div className="bg-cream min-h-screen text-dark">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        <p className="text-lg font-medium text-gray-700 mb-16">
          Статус: {isPast ? "Завершено" : "Активно"}
        </p>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Левая часть */}
          <div className="flex-1 flex flex-col self-stretch">
            <div className="rounded-2xl overflow-hidden bg-gray-200 h-80 mb-4 shadow-md">
              {event.photo?.filename ? (
                <img
                  src={`/uploads/${event.photo.filename}`}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Без фото
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {isVolunteerPending && (
                <div className="text-sm text-gray-600 px-2">
                  Ожидайте одобрения заявки на волонтёрство
                </div>
              )}

              {isParticipant && (
                <div className="text-sm text-gray-600 px-2">
                  Вы зарегистрированы как участник
                </div>
              )}

              {!isParticipant && !isVolunteerPending && (
                <>
                  <PrimaryButton disabled={isPast} onClick={handleJoin}>
                    Участвовать
                  </PrimaryButton>
                  <PrimaryButton disabled={isPast} onClick={handleVolunteer}>
                    Подать заявку на волонтёрство
                  </PrimaryButton>
                </>
              )}

              {(isParticipant || isVolunteerPending) && (
                <PrimaryButton disabled={isPast} onClick={handleCancel}>
                  Отказаться от участия
                </PrimaryButton>
              )}
            </div>
          </div>

          {/* Правая часть */}
          <div className="flex-1 flex flex-col gap-4 self-stretch">
            <InfoCard title="Описание" className="min-h-40">
              {event.description || "Нет описания."}
            </InfoCard>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard title="Участников">
                {event.participants_number}/200
              </InfoCard>
              <InfoCard title="Волонтёров">
                {event.volunteers_number}/100
              </InfoCard>
              <InfoCard title="Основная информация" className="min-h-40">
                <ul className="space-y-1">
                  <li>📅 {new Date(event.date).toLocaleDateString()}</li>
                  <li>
                    🕒{" "}
                    {new Date(event.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </li>
                  <li>📍 {event.city}</li>
                  <li>🏢 Организация ID: {event.organizer_id}</li>
                </ul>
              </InfoCard>
              <InfoCard title="Контактное лицо">
                <ul className="space-y-1">
                  <li>📞 +7 (999) 123-45-67</li>
                  <li>👤 Иван Иванов</li>
                  <li>✉️ ivan@example.com</li>
                </ul>
              </InfoCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
