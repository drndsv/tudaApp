import { useState, useEffect, useRef } from "react";
import {
  TextInput,
  Button,
  Group,
  Menu,
  Box,
  Checkbox,
  Paper,
  Stack,
  Transition,
  useMantineTheme,
  ActionIcon,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import { FaSearch } from "react-icons/fa";

type FiltersProps = {
  date: string | null;
  setDate: (value: string | null) => void;
  citySearch: string;
  setCitySearch: (value: string) => void;
  eventSearch: string;
  setEventSearch: (value: string) => void;
  resetFilters: () => void;
  cities: string[];
  selectedRoles: string[];
  setSelectedRoles: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function Filters({
  date,
  setDate,
  citySearch,
  setCitySearch,
  eventSearch,
  setEventSearch,
  resetFilters,
  cities,
  selectedRoles,
  setSelectedRoles,
}: FiltersProps) {
  const theme = useMantineTheme();
  const [roleOpen, setRoleOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement | null>(null);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleRoleChange = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setRoleOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box my="xl">
      <Group mb="md">
        <TextInput
          placeholder="Найти мероприятие"
          value={eventSearch}
          onChange={(e) => setEventSearch(e.currentTarget.value)}
          radius="xl"
          className="flex-1"
        />
        <Button
          radius="xl"
          styles={{ root: { backgroundColor: theme.colors.green[10] } }}
        >
          <FaSearch />
        </Button>
        <Button variant="outline" radius="xl" onClick={resetFilters}>
          Сбросить фильтры
        </Button>
      </Group>

      <Group gap="sm" wrap="wrap">
        {/* Выбор города */}
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
              Сбросить
            </Menu.Item>
            {filteredCities.map((city) => (
              <Menu.Item key={city} onClick={() => setCitySearch(city)}>
                {city}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>

        {/* Дата */}
        <DateInput
          locale="ru"
          placeholder="Выбрать дату"
          value={date}
          onChange={setDate}
          radius="xl"
          size="sm"
          valueFormat="DD MMMM YYYY"
          w={200}
          rightSection={
            date ? (
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={() => setDate(null)}
                aria-label="Очистить дату"
              >
                <IconX size={16} />
              </ActionIcon>
            ) : null
          }
        />

        {/* Роли */}
        <Box ref={roleRef} pos="relative">
          <Button
            radius="xl"
            variant="default"
            onClick={() => setRoleOpen((v) => !v)}
            styles={{ root: { fontWeight: 500 } }}
          >
            {selectedRoles.length > 0
              ? selectedRoles
                  .map((r) => (r === "VOLUNTEER" ? "Волонтёр" : "Участник"))
                  .join(", ")
              : "Все роли"}
          </Button>

          <Transition
            mounted={roleOpen}
            transition="scale-y"
            duration={200}
            timingFunction="ease"
          >
            {(styles) => (
              <Paper
                shadow="md"
                radius="md"
                style={{
                  position: "absolute",
                  zIndex: 10,
                  top: "100%",
                  marginTop: 8,
                  width: 180,
                  backgroundColor: theme.colors.cream?.[0] || "#fff",
                  ...styles,
                }}
              >
                <Stack p="xs" gap="xs">
                  {[
                    { label: "Волонтёр", value: "VOLUNTEER" },
                    { label: "Участник", value: "PARTICIPANT" },
                  ].map(({ label, value }) => (
                    <Checkbox
                      key={value}
                      label={label}
                      checked={selectedRoles.includes(value)}
                      onChange={() => handleRoleChange(value)}
                    />
                  ))}
                </Stack>
              </Paper>
            )}
          </Transition>
        </Box>
      </Group>
    </Box>
  );
}
