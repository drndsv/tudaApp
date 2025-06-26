import { useState } from "react";

export default function Filters() {
  const [cityOpen, setCityOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  return (
    <div className="my-6">
      {/* Поисковая строка */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Найти мероприятие"
          className="flex-1 px-4 py-2 rounded-xl border border-olive shadow-inner text-sm"
        />
        <button className="px-4 py-2 bg-olive text-white rounded-xl shadow-md">
          🔍
        </button>
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-3">
        {/* Город */}
        <div className="relative">
          <button
            onClick={() => setCityOpen(!cityOpen)}
            className="px-4 py-2 bg-beige rounded-xl shadow-md"
          >
            Все города
          </button>
          {cityOpen && (
            <ul className="absolute mt-2 bg-cream shadow-lg rounded-xl w-40 text-sm z-10">
              {["Москва", "Санкт-Петербург", "Казань"].map((city) => (
                <li
                  key={city}
                  className="px-4 py-2 hover:bg-beige cursor-pointer"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Дата */}
        <input
          type="date"
          className="px-4 py-2 bg-beige rounded-xl shadow-md text-sm"
        />

        {/* Роль */}
        <div className="relative">
          <button
            onClick={() => setRoleOpen(!roleOpen)}
            className="px-4 py-2 bg-beige rounded-xl shadow-md"
          >
            Требуемая роль
          </button>
          {roleOpen && (
            <ul className="absolute mt-2 bg-cream shadow-lg rounded-xl w-40 text-sm z-10">
              <li className="px-4 py-2 hover:bg-beige cursor-pointer">
                Волонтёр
              </li>
              <li className="px-4 py-2 hover:bg-beige cursor-pointer">
                Участник
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
