import { useState, useEffect, useRef } from "react";
import Dropdown from "./Dropdown";

export default function Filters() {
  const [citySearch, setCitySearch] = useState(""); // Состояние для поиска городов
  const [eventSearch, setEventSearch] = useState(""); // Состояние для поиска мероприятий
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]); // Состояние для выбранных ролей
  const [roleOpen, setRoleOpen] = useState(false); // Состояние открытия списка ролей

  const roleRef = useRef<HTMLDivElement | null>(null); // Ссылка на выпадающий список ролей

  const filteredCities = ["Москва", "Санкт-Петербург", "Казань"].filter(
    (city) => city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleRoleChange = (role: string) => {
    setSelectedRoles((prevSelectedRoles) =>
      prevSelectedRoles.includes(role)
        ? prevSelectedRoles.filter((r) => r !== role)
        : [...prevSelectedRoles, role]
    );
  };

  // Закрытие списка ролей при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setRoleOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="my-6">
      {/* Поисковая строка для мероприятий */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Найти мероприятие"
          className="flex-1 px-4 py-2 rounded-xl border border-olive shadow-inner text-sm"
          value={eventSearch}
          onChange={(e) => setEventSearch(e.target.value)}
        />
        <button className="px-4 py-2 bg-olive text-white rounded-xl shadow-md">
          🔍
        </button>
      </div>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-3">
        {/* Город */}
        <Dropdown buttonLabel="Все города">
          <div>
            <input
              type="text"
              placeholder="Поиск города"
              className="px-4 py-2 rounded-xl border border-olive shadow-inner mb-2 text-sm w-36"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
            />
            {filteredCities.map((city) => (
              <li
                key={city}
                className="px-4 py-2 hover:bg-lime-100 cursor-pointer"
                onClick={() => setCitySearch(city)}
              >
                {city}
              </li>
            ))}
          </div>
        </Dropdown>

        {/* Дата */}
        <input
          type="date"
          className="px-4 py-2 bg-beige rounded-xl shadow-md text-sm"
        />

        {/* Роль */}
        <div ref={roleRef} className="relative">
          <button
            onClick={() => setRoleOpen((prev) => !prev)}
            className="px-4 py-2 bg-beige rounded-xl shadow-md"
          >
            Требуемая роль
          </button>
          {roleOpen && (
            <ul className="absolute mt-2 bg-lime-50 shadow-lg w-40 text-sm z-10 transform transition-all duration-300 rounded-xl overflow-hidden">
              {["Волонтёр", "Участник"].map((role) => (
                <li key={role} className="px-4 py-2 cursor-pointer">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => handleRoleChange(role)}
                      className="form-checkbox"
                    />
                    {role}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
