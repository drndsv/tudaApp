import { Event } from "../types/models";

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  return (
    <div className="card">
      <div className="h-40 mb-2 rounded-xl overflow-hidden bg-gray-200">
        {event.photo?.filename ? (
          <img
            src={`/uploads/${event.photo.filename}`}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-500">
            Без фото
          </div>
        )}
      </div>
      <h2 className="text-lg font-semibold">{event.title}</h2>
      <p className="text-sm text-olive">
        {new Date(event.date).toLocaleDateString()}
      </p>
      <p className="text-sm">{event.city}</p>
    </div>
  );
}
