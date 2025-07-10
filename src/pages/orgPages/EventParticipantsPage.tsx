import {
  Box,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Menu,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import { EventControllerService } from "../../api/generated";
import { EventParticipantResponseDTO } from "../../api/generated/models/EventParticipantResponseDTO";
import { FaSearch } from "react-icons/fa";
import PillBadge from "../../components/PillBadge";
import QRScanner from "../../components/QRScanner";

export default function EventParticipantsPage() {
  const { id } = useParams<{ id: string }>();
  const [participants, setParticipants] = useState<
    EventParticipantResponseDTO[]
  >([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"Участник" | "Волонтёр" | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<
    "Пришёл" | "Не пришёл" | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const res = await EventControllerService.getParticipantsByEventId(
          Number(id)
        );
        if (!res.error && res.result) {
          setParticipants(res.result);
        } else {
          console.error("Ошибка загрузки участников:", res.errorMassage);
        }
      } catch (err) {
        console.error("Ошибка запроса:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const filtered = participants.filter((p) => {
    const fullName = p.fullName?.toLowerCase() || "";
    const matchesName = fullName.includes(search.toLowerCase());

    const matchesRole = roleFilter
      ? (roleFilter === "Волонтёр" && p.role === "VOLUNTEER") ||
        (roleFilter === "Участник" && p.role === "PARTICIPANT")
      : true;

    const matchesStatus =
      statusFilter === "Пришёл"
        ? p.status === true
        : statusFilter === "Не пришёл"
        ? p.status === false
        : true;

    return matchesName && matchesRole && matchesStatus;
  });

  const getRoleLabel = (role?: EventParticipantResponseDTO.role) => {
    switch (role) {
      case "PARTICIPANT":
        return "Участник";
      case "VOLUNTEER":
        return "Волонтёр";
      default:
        return "Участник (гость)";
    }
  };

  const handleScan = (data: string) => {
    alert(`Считан QR-код: ${data}`);
    setScannerOpen(false);

    // QR
  };

  if (loading) {
    return (
      <Box>
        <Header />
        <Container py="xl">
          <Center>
            <Loader />
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <Header />
      <Container size="lg" py="xl">
        <Title order={2} mb="lg">
          Участники
        </Title>

        <Group mb="md" wrap="wrap">
          <TextInput
            placeholder="Найти по ФИО"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            radius="xl"
            className="flex-1"
          />
          <Button radius="xl">
            <FaSearch />
          </Button>
          <Button
            variant="outline"
            radius="xl"
            onClick={() => {
              setSearch("");
              setRoleFilter(null);
              setStatusFilter(null);
            }}
          >
            Сбросить фильтры
          </Button>
        </Group>

        <Group wrap="wrap" gap="sm" mb="xl" justify="space-between">
          <Group gap="sm">
            <Menu shadow="md" width={200} radius="md" withArrow>
              <Menu.Target>
                <Button variant="default" radius="xl">
                  {roleFilter || "Все роли"}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => setRoleFilter("Участник")}>
                  Участник
                </Menu.Item>
                <Menu.Item onClick={() => setRoleFilter("Волонтёр")}>
                  Волонтёр
                </Menu.Item>
                <Menu.Item onClick={() => setRoleFilter(null)}>
                  Сбросить
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <Menu shadow="md" width={200} radius="md" withArrow>
              <Menu.Target>
                <Button variant="default" radius="xl">
                  {statusFilter || "Все статусы"}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => setStatusFilter("Пришёл")}>
                  Пришёл
                </Menu.Item>
                <Menu.Item onClick={() => setStatusFilter("Не пришёл")}>
                  Не пришёл
                </Menu.Item>
                <Menu.Item onClick={() => setStatusFilter(null)}>
                  Сбросить
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>

          <Button
            color="green.10"
            radius="xl"
            onClick={() => setScannerOpen(true)}
          >
            Сканировать
          </Button>
        </Group>

        <Stack>
          {filtered.map((p) => (
            <Paper key={p.id} withBorder p="md" radius="md">
              <Group justify="space-between" wrap="wrap">
                <Text>{p.fullName || "Без имени"}</Text>
                <Group gap="sm" wrap="wrap">
                  <PillBadge label={getRoleLabel(p.role)} />
                  <PillBadge
                    label={p.status ? "Пришёл" : "Не пришёл"}
                    color={p.status ? "green.6" : "gray.6"}
                    bgColor={p.status ? "green.0" : "gray.0"}
                    borderColor={p.status ? "#51cf66" : "#adb5bd"}
                  />
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Container>

      {/* QR */}
      <Modal
        opened={scannerOpen}
        onClose={() => setScannerOpen(false)}
        title="Сканируйте QR-код"
        size="lg"
        centered
      >
        <QRScanner
          onScanSuccess={handleScan}
          onClose={() => setScannerOpen(false)}
        />
      </Modal>
    </Box>
  );
}
