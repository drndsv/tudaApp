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
import { OrganizationControllerService } from "../api/generated";
import { useFullUser } from "../hooks/useFullUser";
import { showNotification } from "@mantine/notifications";
import { isValidEmail, isValidPhone } from "../utils/validators";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fullUser = useFullUser();
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [isOrgEditing, setIsOrgEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<AppUserRequestDTO>({
    login: "",
    password: "",
    name: "",
    lastName: "",
    patronymic: "",
    phoneNumber: "",
  });

  const [organizationData, setOrganizationData] = useState<{
    id?: number;
    name: string;
    phone: string;
  }>({
    id: undefined,
    name: "",
    phone: "",
  });

  const [passwordInput, setPasswordInput] = useState("");

  const originalUserData = useRef<AppUserRequestDTO | null>(null);
  const originalOrgData = useRef<{
    id?: number;
    name: string;
    phone: string;
  } | null>(null);

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
      originalUserData.current = dto;

      if (fullUser.organization) {
        const org = {
          id: fullUser.organization.id,
          name: fullUser.organization.name || "",
          phone: fullUser.organization.phoneNumber || "",
        };
        setOrganizationData(org);
        originalOrgData.current = org;
      }
      setLoading(false);
    }
  }, [fullUser]);

  const handleUserChange = (field: keyof AppUserRequestDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOrgChange = (
    field: keyof typeof organizationData,
    value: string
  ) => {
    setOrganizationData((prev) => ({ ...prev, [field]: value }));
  };

  const isUserFormFilled = () => {
    return (
      (formData.login ?? "").trim() !== "" &&
      passwordInput.trim() !== "" &&
      (formData.name ?? "").trim() !== "" &&
      (formData.lastName ?? "").trim() !== "" &&
      (formData.patronymic ?? "").trim() !== "" &&
      (formData.phoneNumber ?? "").trim() !== ""
    );
  };

  const isOrgFormFilled = () => {
    return (
      (organizationData.name ?? "").trim() !== "" &&
      (organizationData.phone ?? "").trim() !== ""
    );
  };

  const canSaveUser = isUserFormFilled;
  const canSaveOrg = isOrgFormFilled;

  const handleUserCancel = () => {
    if (originalUserData.current) {
      setFormData(originalUserData.current);
    }
    setPasswordInput("");
    setIsUserEditing(false);
  };

  const handleOrgCancel = () => {
    if (originalOrgData.current) {
      setOrganizationData(originalOrgData.current);
    }
    setIsOrgEditing(false);
  };

  const handleUserSave = async () => {
    if (!isUserFormFilled()) {
      showNotification({
        title: "Ошибка",
        message: "Пожалуйста, заполните все обязательные поля, включая пароль",
        color: "red",
      });
      return;
    }

    if (!isValidEmail(formData.login ?? "")) {
      showNotification({
        title: "Некорректный email",
        message:
          "Пожалуйста, введите корректный email (пример: example@mail.ru)",
        color: "red",
      });
      return;
    }

    if (!isValidPhone(formData.phoneNumber ?? "")) {
      showNotification({
        title: "Некорректный номер телефона",
        message:
          "Пожалуйста, введите корректный телефон (пример: +7XXXXXXXXXX)",
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
        setIsUserEditing(false);
        originalUserData.current = formData;
        setPasswordInput("");

        //изменился ли логин или пароль
        if (
          formData.login !== user.sub ||
          (passwordInput.trim() !== "" && passwordInput !== formData.password)
        ) {
          showNotification({
            title: "Изменение данных пользователя",
            message:
              "Данные были изменены, пожалуйста, выполните повторный вход",
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

  const handleOrgSave = async () => {
    if (!isOrgFormFilled()) {
      showNotification({
        title: "Ошибка",
        message: "Пожалуйста, заполните все обязательные поля организации",
        color: "red",
      });
      return;
    }

    if (!isValidPhone(organizationData.phone ?? "")) {
      showNotification({
        title: "Некорректный номер телефона организации",
        message:
          "Пожалуйста, введите корректный телефон (пример: +7XXXXXXXXXX)",
        color: "red",
      });
      return;
    }

    if (!organizationData.id) {
      showNotification({
        title: "Ошибка",
        message: "Не найдена организация для обновления",
        color: "red",
      });
      return;
    }

    try {
      const res = await OrganizationControllerService.updateOrganization(
        organizationData.id,
        {
          name: organizationData.name,
          phoneNumber: organizationData.phone,
        }
      );

      if (!res.error) {
        showNotification({
          title: "Успех",
          message: "Данные организации обновлены",
          color: "green",
        });
        setIsOrgEditing(false);
        originalOrgData.current = organizationData;
      } else {
        showNotification({
          title: "Ошибка при сохранении организации",
          message: res.errorMassage,
          color: "red",
        });
      }
    } catch (err) {
      console.error("Ошибка при сохранении организации:", err);
      showNotification({
        title: "Ошибка",
        message: "Ошибка при сохранении данных организации",
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

        <Paper shadow="md" radius="xl" p="xl" withBorder bg="white" mb="xl">
          <Group justify="space-between" mb="lg">
            <Title order={3}>Идентификационные данные</Title>
            {!isUserEditing && (
              <Button
                radius="xl"
                color="green.10"
                onClick={() => {
                  setIsUserEditing(true);
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
                  email
                </Text>
                {isUserEditing ? (
                  <TextInput
                    value={formData.login}
                    onChange={(e) =>
                      handleUserChange("login", e.currentTarget.value)
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

            {isUserEditing && (
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
                  {isUserEditing ? (
                    <TextInput
                      value={formData[field as keyof AppUserRequestDTO] || ""}
                      onChange={(e) =>
                        handleUserChange(
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

          {isUserEditing && (
            <Group justify="end" gap="sm" mt="xl">
              <Button
                type="button"
                radius="xl"
                variant="default"
                onClick={handleUserCancel}
              >
                Отмена
              </Button>
              <Button
                type="button"
                radius="xl"
                color="green.10"
                onClick={handleUserSave}
                disabled={!canSaveUser()}
              >
                Сохранить
              </Button>
            </Group>
          )}
        </Paper>

        {user?.roles?.includes("ROLE_ORGANIZER") && (
          <Paper shadow="md" radius="xl" p="xl" withBorder bg="white">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Организация</Title>
              {!isOrgEditing && (
                <Button
                  radius="xl"
                  color="green.10"
                  onClick={() => setIsOrgEditing(true)}
                  type="button"
                >
                  Редактировать
                </Button>
              )}
            </Group>
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
                    {isOrgEditing ? (
                      <TextInput
                        value={
                          organizationData[
                            field as keyof typeof organizationData
                          ] || ""
                        }
                        onChange={(e) =>
                          handleOrgChange(
                            field as keyof typeof organizationData,
                            e.currentTarget.value
                          )
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
            {isOrgEditing && (
              <Group justify="end" gap="sm" mt="xl">
                <Button
                  type="button"
                  radius="xl"
                  variant="default"
                  onClick={handleOrgCancel}
                >
                  Отмена
                </Button>
                <Button
                  type="button"
                  radius="xl"
                  color="green.10"
                  onClick={handleOrgSave}
                  disabled={!canSaveOrg()}
                >
                  Сохранить
                </Button>
              </Group>
            )}
          </Paper>
        )}
      </Container>
    </Box>
  );
}
