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
} from "@mantine/core";
import { useState } from "react";
import Header from "../components/Header";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    login: "ivanov",
    password: "●●●●●●●",
    surname: "Иванов",
    name: "Иван",
    patronymic: "Иванович",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCancel = () => {
    setFormData({
      login: "ivanov",
      password: "●●●●●●●",
      surname: "Иванов",
      name: "Иван",
      patronymic: "Иванович",
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    // Тут будет запрос на бэкенд
    setIsEditing(false);
  };

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
            {["login", "password"].map((field) => (
              <Box
                key={field}
                mb="sm"
                p="sm"
                style={{ border: "1px solid #ccc", borderRadius: "8px" }}
              >
                <Group align="center" gap="md" wrap="nowrap">
                  <Text w={100} fw={500}>
                    {field === "login" ? "Логин" : "Пароль"}
                  </Text>
                  {isEditing ? (
                    <TextInput
                      type={field === "password" ? "password" : "text"}
                      value={formData[field as keyof typeof formData]}
                      onChange={(e) =>
                        handleChange(field, e.currentTarget.value)
                      }
                      radius="md"
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <Text size="sm" c="dimmed">
                      {formData[field as keyof typeof formData]}
                    </Text>
                  )}
                </Group>
              </Box>
            ))}
          </Stack>

          {/* Личные данные */}
          <Title order={3} mb="sm" style={{ textAlign: "left" }}>
            Личные данные
          </Title>

          <Stack gap="sm">
            {["surname", "name", "patronymic"].map((field, idx) => (
              <Box
                key={field}
                mb="sm"
                p="sm"
                style={{ border: "1px solid #ccc", borderRadius: "8px" }}
              >
                <Group align="center" gap="md" wrap="nowrap">
                  <Text w={100} fw={500}>
                    {["Фамилия", "Имя", "Отчество"][idx]}
                  </Text>
                  {isEditing ? (
                    <TextInput
                      value={formData[field as keyof typeof formData]}
                      onChange={(e) =>
                        handleChange(field, e.currentTarget.value)
                      }
                      radius="md"
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <Text size="sm" c="dimmed">
                      {formData[field as keyof typeof formData]}
                    </Text>
                  )}
                </Group>
              </Box>
            ))}
          </Stack>

          {/* Кнопки */}
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
