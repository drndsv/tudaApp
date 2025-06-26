import { FaUserCircle } from "react-icons/fa";
import Dropdown from "./Dropdown";
import "../styles.css";

export default function Header() {
  return (
    <header
      className="flex justify-between items-center px-6 py-4 shadow-md relative rounded-xl mb-12"
      style={{ backgroundColor: "var(--color-green)" }}
    >
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => (window.location.href = "/")}
      >
        TUDA
      </h1>

      {/* Dropdown для выпадающего меню */}
      <Dropdown buttonLabel={<FaUserCircle className="text-2xl text-dark" />}>
        <li className="px-4 py-2 hover:bg-lime-100 cursor-pointer">
          Управление профилем
        </li>
        <li className="px-4 py-2 hover:bg-lime-100 cursor-pointer">
          Мои мероприятия
        </li>
        <li className="px-4 py-2 hover:bg-lime-100 cursor-pointer">
          Выход из аккаунта
        </li>
      </Dropdown>
    </header>
  );
}
