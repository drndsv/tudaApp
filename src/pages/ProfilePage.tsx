// TODO: не сохраняются изменения в пользователе
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
  const { user } = useAuth(); // login и id из токена
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
      // if (!user?.id) return;
      try {
        // const res = await UserControllerService.getUser(user.id);
        const res = await UserControllerService.getUser(51);
        if (!res.error && res.result) {
          const u = res.result;
          const dto: AppUserRequestDTO = {
            login: u.login || "",
            password: "", // не загружаем старый пароль
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
    // }, [user?.id]);
  }, [51]);

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
    if (!user?.login) return;

    try {
      const res = await UserControllerService.changeUserRefs(
        user.login,
        formData
      );
      if (!res.error) {
        setIsEditing(false);
        originalData.current = formData;
      } else {
        console.error("Ошибка при сохранении:", res.errorMassage);
      }
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
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

        <Paper
          shadow="md"
          radius="xl"
          p="xl"
          withBorder
          style={{ backgroundColor: "white" }}
        >
          {/* Идентификационные данные */}
          <Group justify="space-between" mb="lg">
            <Title order={3}>Идентификационные данные</Title>
            {!isEditing && (
              <Button
                radius="xl"
                color="green.10"
                onClick={() => setIsEditing(true)}
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

          {/* Личные данные */}
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
              <Button radius="xl" variant="default" onClick={handleCancel}>
                Отмена
              </Button>
              <Button radius="xl" color="green.10" onClick={handleSave}>
                Сохранить
              </Button>
            </Group>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
