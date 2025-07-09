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
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { UserControllerService, AppUserRequestDTO } from "../api/generated";
import { useFullUser } from "../hooks/useFullUser";
import { showNotification } from "@mantine/notifications";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fullUser = useFullUser();
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

  const [organizationData, setOrganizationData] = useState({
    name: "",
    phone: "",
  });

  const [passwordInput, setPasswordInput] = useState("");

  const originalData = useRef<AppUserRequestDTO | null>(null);
  const originalOrgData = useRef<{ name: string; phone: string } | null>(null);

  useEffect(() => {
    if (fullUser) {
      const dto: AppUserRequestDTO = {
        login: fullUser.login || "",
        password: "",
        name: fullUser.name || "",
        lastName: fullUser.lastName || "",
        patronymic: fullUser.patronymic || "",
        phoneNumber: fullUser.phoneNumber || "",
      };
      setFormData(dto);
      originalData.current = dto;

      if (fullUser.organization) {
        const org = {
          name: fullUser.organization.name || "",
          phone: fullUser.organization.phoneNumber || "",
        };
        setOrganizationData(org);
        originalOrgData.current = org;
      }
      setLoading(false);
    }
  }, [fullUser]);

  const handleChange = (field: keyof AppUserRequestDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    if (originalData.current) {
      setFormData(originalData.current);
    }
    if (originalOrgData.current) {
      setOrganizationData(originalOrgData.current);
    }
    setPasswordInput("");
    setIsEditing(false);
  };

  const canSave = () => {
    return (
      (formData.login ?? "").trim() !== "" &&
      passwordInput.trim() !== "" &&
      (formData.name ?? "").trim() !== "" &&
      (formData.lastName ?? "").trim() !== "" &&
      (formData.patronymic ?? "").trim() !== "" &&
      (formData.phoneNumber ?? "").trim() !== ""
    );
  };

  const handleSave = async () => {
    if (!canSave()) {
      showNotification({
        title: "Ошибка",
        message: "Пожалуйста, заполните все обязательные поля, включая пароль",
        color: "red",
      });
      return;
    }

    if (!user?.sub) {
      showNotification({
        title: "Ошибка",
        message: "Пользователь не авторизован",
        color: "red",
      });
      return;
    }

    const payload: AppUserRequestDTO = {
      ...formData,
      password: passwordInput.trim(),
    };

    try {
      const res = await UserControllerService.changeUserRefs(user.sub, payload);

      if (!res.error) {
        showNotification({
          title: "Успех",
          message: "Изменения сохранены",
          color: "green",
        });
        setIsEditing(false);
        originalData.current = formData;
        originalOrgData.current = organizationData;
        setPasswordInput("");

        // Проверка, изменился ли логин или пароль
        if (
          formData.login !== user.sub ||
          (passwordInput.trim() !== "" && passwordInput !== formData.password)
        ) {
          showNotification({
            title: "Изменение данных пользователя",
            message:
              "Логин или пароль были изменены, пожалуйста, выполните повторный вход",
            color: "yellow",
          });
          logout();
          navigate("/login");
        }
      } else {
        showNotification({
          title: "Ошибка при сохранении",
          message: res.errorMassage,
          color: "red",
        });
      }
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      showNotification({
        title: "Ошибка",
        message: "Ошибка при сохранении",
        color: "red",
      });
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
                onClick={() => {
                  setIsEditing(true);
                  setPasswordInput("");
                }}
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
                {isEditing ? (
                  <TextInput
                    value={formData.login}
                    onChange={(e) =>
                      handleChange("login", e.currentTarget.value)
                    }
                    radius="md"
                    style={{ flex: 1 }}
                  />
                ) : (
                  <Text size="sm" c="dimmed">
                    {formData.login}
                  </Text>
                )}
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
                    Пароль*
                  </Text>
                  <TextInput
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.currentTarget.value)}
                    radius="md"
                    style={{ flex: 1 }}
                    placeholder="Для сохранения изменений обязательно введите пароль"
                    required
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

          {user?.roles?.includes("ROLE_ORGANIZER") && (
            <>
              <Title order={3} mt="xl" mb="sm" style={{ textAlign: "left" }}>
                Организация
              </Title>
              <Stack gap="sm">
                {[
                  { field: "name", label: "Название организации" },
                  { field: "phone", label: "Телефон организации" },
                ].map(({ field, label }) => (
                  <Box
                    key={field}
                    mb="sm"
                    p="sm"
                    style={{ border: "1px solid #ccc", borderRadius: "8px" }}
                  >
                    <Group align="center" gap="md" wrap="nowrap">
                      <Text w={160} fw={500}>
                        {label}
                      </Text>
                      {isEditing ? (
                        <TextInput
                          value={
                            organizationData[
                              field as keyof typeof organizationData
                            ] || ""
                          }
                          onChange={(e) =>
                            setOrganizationData((prev) => ({
                              ...prev,
                              [field]: e.currentTarget.value,
                            }))
                          }
                          radius="md"
                          style={{ flex: 1 }}
                        />
                      ) : (
                        <Text size="sm" c="dimmed">
                          {
                            organizationData[
                              field as keyof typeof organizationData
                            ]
                          }
                        </Text>
                      )}
                    </Group>
                  </Box>
                ))}
              </Stack>
            </>
          )}

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
                disabled={!canSave()}
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
