// TODO: разобраться почему в режиме отладке при сохранении выкидывает в debugger
import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  Loader,
  Center,
} from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { UserControllerService } from "../api/generated/services/UserControllerService";
import { AppUserRequestDTO } from "../api/generated/models/AppUserRequestDTO";

export default function ProfilePage() {
  const { user } = useAuth(); // sub (login) и id из токена
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<AppUserRequestDTO>({
    login: "",
    password: "",
    name: "",
    lastName: "",
    patronymic: "",
    phoneNumber: "",
  });

  const originalData = useRef<AppUserRequestDTO | null>(null); // для сброса при отмене

  // Загрузка данных с бэка
  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id) return;
      try {
        const res = await UserControllerService.getUser(user.id);
        if (!res.error && res.result) {
          const u = res.result;
          const dto: AppUserRequestDTO = {
            login: u.login || "",
            password: "",
            name: u.name || "",
            lastName: u.lastName || "",
            patronymic: u.patronymic || "",
            phoneNumber: u.phoneNumber || "",
          };
          setFormData(dto);
          originalData.current = dto;
        } else {
          console.error("Ошибка получения пользователя:", res.errorMassage);
        }
      } catch (err) {
        console.error("Ошибка при запросе пользователя:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user?.id]);

  const handleChange = (field: keyof AppUserRequestDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    if (originalData.current) {
      setFormData(originalData.current);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    console.log("handleSave вызван");
    console.log("user.sub (login):", user?.sub);

    if (!user?.sub) {
      console.warn("Нет логина (sub), выходим");
      return;
    }

    try {
      const payload: AppUserRequestDTO = {
        ...formData,
        login: user.sub, // из токена
      };

      console.log("Отправка:", JSON.stringify(payload, null, 2));
      const res = await UserControllerService.changeUserRefs(user.sub, payload);
      console.log("Ответ от сервера:", res);

      if (!res.error) {
        alert("Изменения сохранены");
        setIsEditing(false);
        originalData.current = formData;
      } else {
        alert("Ошибка при сохранении: " + res.errorMassage);
      }
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      alert("Ошибка при сохранении");
    }
  };

  if (loading) {
    return (
      <Box>
        <Header />
        <Container size="md" py="xl">
          <Center>
            <Loader />
          </Center>
        </Container>
      </Box>
    );
  }

  return (
    <Box style={{ minHeight: "100vh" }}>
      <Header />
      <Container size="md" py="xl">
        <Title order={2} mb="lg">
          Ваши данные
        </Title>

        <Paper shadow="md" radius="xl" p="xl" withBorder bg="white">
          <Group justify="space-between" mb="lg">
            <Title order={3}>Идентификационные данные</Title>
            {!isEditing && (
              <Button
                radius="xl"
                color="green.10"
                onClick={() => setIsEditing(true)}
                type="button"
              >
                Редактировать
              </Button>
            )}
          </Group>

          <Stack gap="sm" mb="lg">
            <Box
              mb="sm"
              p="sm"
              style={{ border: "1px solid #ccc", borderRadius: "8px" }}
            >
              <Group align="center" gap="md" wrap="nowrap">
                <Text w={100} fw={500}>
                  Логин
                </Text>
                <Text size="sm" c="dimmed">
                  {formData.login}
                </Text>
              </Group>
            </Box>

            {isEditing && (
              <Box
                mb="sm"
                p="sm"
                style={{ border: "1px solid #ccc", borderRadius: "8px" }}
              >
                <Group align="center" gap="md" wrap="nowrap">
                  <Text w={100} fw={500}>
                    Новый пароль
                  </Text>
                  <TextInput
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleChange("password", e.currentTarget.value)
                    }
                    radius="md"
                    style={{ flex: 1 }}
                  />
                </Group>
              </Box>
            )}
          </Stack>

          <Title order={3} mb="sm" style={{ textAlign: "left" }}>
            Личные данные
          </Title>

          <Stack gap="sm">
            {[
              { field: "lastName", label: "Фамилия" },
              { field: "name", label: "Имя" },
              { field: "patronymic", label: "Отчество" },
              { field: "phoneNumber", label: "Телефон" },
            ].map(({ field, label }) => (
              <Box
                key={field}
                mb="sm"
                p="sm"
                style={{ border: "1px solid #ccc", borderRadius: "8px" }}
              >
                <Group align="center" gap="md" wrap="nowrap">
                  <Text w={100} fw={500}>
                    {label}
                  </Text>
                  {isEditing ? (
                    <TextInput
                      value={formData[field as keyof AppUserRequestDTO] || ""}
                      onChange={(e) =>
                        handleChange(
                          field as keyof AppUserRequestDTO,
                          e.currentTarget.value
                        )
                      }
                      radius="md"
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <Text size="sm" c="dimmed">
                      {formData[field as keyof AppUserRequestDTO]}
                    </Text>
                  )}
                </Group>
              </Box>
            ))}
          </Stack>

          {isEditing && (
            <Group justify="end" gap="sm" mt="xl">
              <Button
                type="button"
                radius="xl"
                variant="default"
                onClick={handleCancel}
              >
                Отмена
              </Button>
              <Button
                type="button"
                radius="xl"
                color="green.10"
                onClick={handleSave}
              >
                Сохранить
              </Button>
            </Group>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
