import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Group,
  Stack,
  TextInput,
  Title,
  Text,
  Paper,
  Loader,
  Select,
} from "@mantine/core";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import { RequestControllerService } from "../../api/generated/services/RequestControllerService";
import { RequestResponseDTO } from "../../api/generated/models/RequestResponseDTO";
import { showNotification } from "@mantine/notifications";
import { AccountingAppUserControllerService } from "../../api/generated";

export default function EventRequestsPage() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const [requests, setRequests] = useState<RequestResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    if (!eventId) return;

    setLoading(true);
    RequestControllerService.getAllEventRequests(eventId)
      .then((res) => {
        if (!res.error && res.result) {
          setRequests(res.result);
        }
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleAccept = async (login: string) => {
    try {
      const res =
        await AccountingAppUserControllerService.saveAsVolunteerForEvent(
          eventId,
          login
        );
      if (!res.error) {
        showNotification({
          title: "Заявка принята",
          message: "",
          color: "green",
        });
        updateStatus(login, true);
      }
    } catch {
      showNotification({
        title: "Ошибка",
        message: "Не удалось принять заявку",
        color: "red",
      });
    }
  };

  const handleReject = async (login: string) => {
    try {
      const res = await RequestControllerService.rejectRequest(eventId, login);
      if (!res.error) {
        showNotification({
          title: "Заявка отклонена",
          message: "",
          color: "orange",
        });
        updateStatus(login, false);
      }
    } catch {
      showNotification({
        title: "Ошибка",
        message: "Не удалось отклонить заявку",
        color: "red",
      });
    }
  };

  const updateStatus = (login: string, status: boolean) => {
    setRequests((prev) =>
      prev.map((r) => (r.appUser?.login === login ? { ...r, status } : r))
    );
  };

  const filteredRequests = requests
    .filter((r) =>
      `${r.appUser?.lastName} ${r.appUser?.name} ${r.appUser?.patronymic}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.date || "").getTime();
      const dateB = new Date(b.date || "").getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <Box>
      <Header />
      <Container size="lg" py="xl">
        <Title order={2} mb="lg">
          Заявки
        </Title>

        <Stack gap="md">
          <TextInput
            placeholder="Найти по ФИО"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />

          <Select
            data={[
              { value: "newest", label: "Сначала новые ⬆" },
              { value: "oldest", label: "Сначала старые ⬇" },
            ]}
            value={sortOrder}
            onChange={(val) => setSortOrder(val as "newest" | "oldest")}
            w={200}
          />

          {loading ? (
            <Loader />
          ) : filteredRequests.length === 0 ? (
            <Text>Заявок нет.</Text>
          ) : (
            filteredRequests.map((req) => {
              const user = req.appUser;
              const fullName = `${user?.lastName || ""} ${user?.name || ""} ${
                user?.patronymic || ""
              }`;

              return (
                <Paper key={req.id} withBorder p="md" radius="md">
                  <Group justify="space-between">
                    <TextInput value={fullName} readOnly style={{ flex: 1 }} />
                    <Group>
                      <Button
                        color="green"
                        onClick={() => handleAccept(user!.login!)}
                        disabled={req.status === true}
                        radius="xl"
                      >
                        Принять
                      </Button>
                      <Button
                        color="red"
                        onClick={() => handleReject(user!.login!)}
                        disabled={req.status === false}
                        radius="xl"
                      >
                        Отклонить
                      </Button>
                    </Group>
                  </Group>
                </Paper>
              );
            })
          )}
        </Stack>
      </Container>
    </Box>
  );
}
