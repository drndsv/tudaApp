import { useEffect, useState } from "react";
import { EventControllerService, EventResponseDTO } from "../api/generated";

export function useEventById(id?: string | number) {
  const [event, setEvent] = useState<EventResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const response = await EventControllerService.getEventById(Number(id));
        if (!response.error && response.result) {
          setEvent(response.result);
        } else {
          console.error("Ошибка в ответе:", response.errorMassage);
        }
      } catch (e) {
        console.error("Ошибка при загрузке мероприятия:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  return { event, loading, setEvent };
}
