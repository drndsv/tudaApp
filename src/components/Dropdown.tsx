import { useEffect, useRef, useState, ReactNode } from "react";

interface DropdownProps {
  buttonLabel: ReactNode; // Поддерживает любой React-элемент
  children: ReactNode;
  className?: string; // Дополнительные классы для настройки
}

export default function Dropdown({
  buttonLabel,
  children,
  className = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Кнопка для открытия меню */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-4 py-2 bg-beige rounded-xl shadow-md"
      >
        {buttonLabel}
      </button>

      {/* Выпадающий список, центрируем его */}
      <ul
        className={`absolute mt-2 bg-lime-50 shadow-lg w-40 text-sm z-10 transform transition-all duration-300
          ${
            open
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-2 scale-95 pointer-events-none"
          }
          rounded-xl overflow-hidden
          left-1/2 transform -translate-x-1/2  
        `}
      >
        {/* "left-1/2" для центрирования */}
        {children}
      </ul>
    </div>
  );
}
