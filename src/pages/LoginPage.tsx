import { Button, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import AuthLayout from "../components/AuthLayout";
import { AuthControllerService } from "../api/generated/services/AuthControllerService";
import { JwtRequestDTO } from "../api/generated/models/JwtRequestDTO";
import { useAuth } from "../context/AuthContext"; // Импортируем хук для работы с контекстом

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Получаем функцию login из контекста

  const form = useForm({
    initialValues: { login: "", password: "" },
    validate: {
      login: (value) => (value ? null : "Введите логин"),
      password: (value) => (value ? null : "Введите пароль"),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const response = await AuthControllerService.authenticate({
        login: values.login,
        password: values.password,
      } as JwtRequestDTO);

      const token = response.token;
      if (!token) throw new Error("Токен не получен");

      // Сохраняем токен через контекст
      login(token);

      // Перенаправляем на главную страницу
      navigate("/");
    } catch (error: any) {
      // Проверяем тип ошибки
      if (error.response?.status === 401) {
        // Неверный логин или пароль
        showNotification({
          title: "Ошибка входа",
          message: "Неверный логин или пароль",
          color: "red",
        });
      } else {
        // Обработка других ошибок
        showNotification({
          title: "Ошибка",
          message: "Произошла непредвиденная ошибка. Попробуйте позже.",
          color: "red",
        });
      }
    }
  };

  return (
    <AuthLayout title="Войти">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <TextInput
            placeholder="Введите логин"
            radius="xl"
            {...form.getInputProps("login")}
            styles={{
              label: {
                textAlign: "left",
                display: "block",
                width: "100%",
                paddingLeft: 16,
              },
            }}
          />
          <TextInput
            placeholder="Введите пароль"
            type="password"
            radius="xl"
            {...form.getInputProps("password")}
            styles={{
              label: {
                textAlign: "left",
                display: "block",
                width: "100%",
                paddingLeft: 16,
              },
            }}
          />
          <Button type="submit" fullWidth radius="xl" color="green.10">
            Войти
          </Button>
          <Text
            mt="xs"
            onClick={() => navigate("/register")}
            style={{
              textAlign: "center",
              cursor: "pointer",
              color: "#568857",
            }}
          >
            Нет аккаунта? Создать учётную запись
          </Text>
        </Stack>
      </form>
    </AuthLayout>
  );
}
