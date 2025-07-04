import { TextInput, Button, Group, Menu, Box, ActionIcon } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { FaSearch } from "react-icons/fa";
// import { useEffect, useRef, useState } from "react";

type UserEventFiltersProps = {
  date: string | null;
  setDate: (value: string | null) => void;
  citySearch: string;
  setCitySearch: (value: string) => void;
  eventSearch: string;
  setEventSearch: (value: string) => void;
  visitStatus: "all" | "visited" | "notVisited";
  setVisitStatus: (value: "all" | "visited" | "notVisited") => void;
  resetFilters: () => void;
  cities: string[];
};

export default function UserEventFilters({
  date,
  setDate,
  citySearch,
  setCitySearch,
  eventSearch,
  setEventSearch,
  setVisitStatus,
  resetFilters,
  cities,
}: UserEventFiltersProps) {
  //   const roleRef = useRef<HTMLDivElement | null>(null);

  //   const [roleOpen, setRoleOpen] = useState(false);

  //   useEffect(() => {
  //     const handleClickOutside = (event: MouseEvent) => {
  //       if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
  //         setRoleOpen(false);
  //       }
  //     };
  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => document.removeEventListener("mousedown", handleClickOutside);
  //   }, []);

  return (
    <Box my="xl">
      <Group mb="md" wrap="wrap">
        <TextInput
          placeholder="Найти мероприятие"
          value={eventSearch}
          onChange={(e) => setEventSearch(e.currentTarget.value)}
          radius="xl"
          className="flex-1"
        />
        <Button radius="xl">
          <FaSearch />
        </Button>
        <Button variant="outline" radius="xl" onClick={resetFilters}>
          Сбросить фильтры
        </Button>
      </Group>

      <Group wrap="wrap" gap="sm">
        {/* Города */}
        <Menu shadow="md" width={200} radius="md" withArrow>
          <Menu.Target>
            <Button variant="default" radius="xl">
              Все города
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <TextInput
              placeholder="Поиск города"
              value={citySearch}
              onChange={(e) => setCitySearch(e.currentTarget.value)}
              mb="xs"
              size="xs"
            />
            {cities.map((city) => (
              <Menu.Item key={city} onClick={() => setCitySearch(city)}>
                {city}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>

        {/* фильтр по дате */}
        <DateInput
          placeholder="Выбрать дату"
          value={date}
          onChange={setDate}
          radius="xl"
          size="sm"
          w={200}
          valueFormat="DD MMMM YYYY"
          rightSection={
            date ? (
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={() => setDate(null)}
              >
                <IconX size={16} />
              </ActionIcon>
            ) : null
          }
        />

        {/* Статус посещения */}
        <Menu shadow="md" width={200} radius="md" withArrow>
          <Menu.Target>
            <Button variant="default" radius="xl" disabled>
              Любой статус (в разработке)
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => setVisitStatus("visited")}>
              Посетил
            </Menu.Item>
            <Menu.Item onClick={() => setVisitStatus("notVisited")}>
              Не посетил
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        {/* Заглушка под фильтр ролей */}
        <Button variant="default" radius="xl" disabled>
          Роль (в разработке)
        </Button>
      </Group>
    </Box>
  );
}
