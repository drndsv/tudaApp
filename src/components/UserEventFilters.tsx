import {
  TextInput,
  Button,
  Group,
  Box,
  ActionIcon,
  Select,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { FaSearch } from "react-icons/fa";

type UserEventFiltersProps = {
  date: string | null;
  setDate: (value: string | null) => void;
  citySearch: string;
  setCitySearch: (value: string) => void;
  eventSearch: string;
  setEventSearch: (value: string) => void;
  visitStatus: "all" | "visited" | "notVisited";
  setVisitStatus: (value: "all" | "visited" | "notVisited") => void;
  role: "all" | "PARTICIPANT" | "VOLUNTEER";
  setRole: (value: "all" | "PARTICIPANT" | "VOLUNTEER") => void;
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
  visitStatus,
  setVisitStatus,
  role,
  setRole,
  resetFilters,
  cities,
}: UserEventFiltersProps) {
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
        {/* Город */}
        <Select
          placeholder="Все города"
          value={citySearch || null}
          onChange={(value) => setCitySearch(value || "")}
          data={[
            { value: "", label: "Все города" },
            ...cities.map((city) => ({ value: city, label: city })),
          ]}
          radius="xl"
          size="sm"
          w={200}
        />

        {/* Дата */}
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
        <Select
          placeholder="Любой статус"
          value={visitStatus}
          onChange={(value) =>
            setVisitStatus((value as "all" | "visited" | "notVisited") || "all")
          }
          data={[
            { value: "all", label: "Любой статус" },
            { value: "visited", label: "Посетил" },
            { value: "notVisited", label: "Не посетил" },
          ]}
          radius="xl"
          size="sm"
          w={200}
        />

        {/* Роль */}
        <Select
          placeholder="Любая роль"
          value={role}
          onChange={(value) =>
            setRole((value as "all" | "PARTICIPANT" | "VOLUNTEER") || "all")
          }
          data={[
            { value: "all", label: "Любая роль" },
            { value: "PARTICIPANT", label: "Участник" },
            { value: "VOLUNTEER", label: "Волонтёр" },
          ]}
          radius="xl"
          size="sm"
          w={200}
        />
      </Group>
    </Box>
  );
}
