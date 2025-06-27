import { FaUserCircle } from "react-icons/fa";
import Dropdown from "./Dropdown";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header
      className="flex justify-between items-center px-6 py-4 shadow-md relative rounded-xl mb-10"
      style={{ backgroundColor: "var(--color-green)" }}
    >
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        TUDA
      </h1>

      <Dropdown buttonLabel={<FaUserCircle className="text-2xl text-dark" />}>
        <li
          className="px-4 py-2 hover:bg-lime-100 cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          Управление профилем
        </li>
        <li
          className="px-4 py-2 hover:bg-lime-100 cursor-pointer"
          onClick={() => navigate("/my-events")}
        >
          Мои мероприятия
        </li>
        <li
          className="px-4 py-2 hover:bg-lime-100 cursor-pointer"
          onClick={() => {
            // Здесь позже добавим логику выхода
            console.log("Выход из аккаунта");
          }}
        >
          Выход из аккаунта
        </li>
      </Dropdown>
    </header>
  );
}
