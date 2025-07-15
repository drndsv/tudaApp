import {
  TextInput,
  Button,
  Group,
  Menu,
  Box,
  ActionIcon,
  Select,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { FaSearch } from "react-icons/fa";

type OrganizerEventFiltersProps = {
  date: string | null;
  setDate: (value: string | null) => void;
  citySearch: string;
  setCitySearch: (value: string) => void;
  eventSearch: string;
  setEventSearch: (value: string) => void;
  eventStatus: "all" | "WILL" | "PASSED" | "CANCELLED";
  setEventStatus: (value: "all" | "WILL" | "PASSED" | "CANCELLED") => void;
  role: "all" | "PARTICIPANT" | "VOLUNTEER";
  setRole: (value: "all" | "PARTICIPANT" | "VOLUNTEER") => void;
  resetFilters: () => void;
  cities: string[];
};

export default function OrganizerEventFilters({
  date,
  setDate,
  citySearch,
  setCitySearch,
  eventSearch,
  setEventSearch,
  eventStatus,
  setEventStatus,
  role,
  setRole,
  resetFilters,
  cities,
}: OrganizerEventFiltersProps) {
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
        <Menu shadow="md" width={200} radius="md" withArrow>
          <Menu.Target>
            <Button
              variant="default"
              radius="xl"
              styles={{ root: { fontWeight: 500 } }}
            >
              {citySearch ? citySearch : "Все города"}
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

            <Menu.Item onClick={() => setCitySearch("")} c="green">
              Сбросить фильтр
            </Menu.Item>

            {cities.map((city) => (
              <Menu.Item key={city} onClick={() => setCitySearch(city)}>
                {city}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>

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

        {/* Статус мероприятия */}
        <Select
          placeholder="Все статусы"
          value={eventStatus}
          onChange={(value) =>
            setEventStatus(
              (value as "all" | "WILL" | "PASSED" | "CANCELLED") || "all"
            )
          }
          radius="xl"
          size="sm"
          w={200}
          data={[
            { value: "all", label: "Все" },
            { value: "WILL", label: "Планируется" },
            { value: "PASSED", label: "Завершено" },
            { value: "CANCELLED", label: "Отменено" },
          ]}
        />

        <Select
          placeholder="Любая роль"
          value={role}
          onChange={(value) =>
            setRole((value as "all" | "PARTICIPANT" | "VOLUNTEER") || "all")
          }
          radius="xl"
          size="sm"
          w={200}
          data={[
            { value: "all", label: "Любая роль" },
            { value: "PARTICIPANT", label: "Участник" },
            { value: "VOLUNTEER", label: "Волонтёр" },
          ]}
        />
      </Group>
    </Box>
  );
}
