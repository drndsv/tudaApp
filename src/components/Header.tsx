import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-beige shadow-md relative">
      {/* Логотип */}
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => (window.location.href = "/")}
      >
        TUDA
      </h1>

      {/* Иконка пользователя */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl text-dark"
        >
          <FaUserCircle />
        </button>

        {menuOpen && (
          <ul className="absolute right-0 mt-2 bg-cream shadow-lg rounded-lg overflow-hidden text-sm w-48 z-10">
            <li className="px-4 py-2 hover:bg-beige cursor-pointer">
              Управление профилем
            </li>
            <li className="px-4 py-2 hover:bg-beige cursor-pointer">
              Мои мероприятия
            </li>
            <li className="px-4 py-2 hover:bg-beige cursor-pointer">
              Выход из аккаунта
            </li>
          </ul>
        )}
      </div>
    </header>
  );
}
