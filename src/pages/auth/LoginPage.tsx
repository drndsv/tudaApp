import { Button, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import AuthLayout from "../../components/AuthLayout";
import {
  AuthControllerService,
  JwtSignInRequestDTO,
} from "../../api/generated";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm({
    initialValues: { login: "", password: "" },
    validate: {
      login: (value) => (value ? null : "Введите логин"),
      password: (value) => (value ? null : "Введите пароль"),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const response = await AuthControllerService.signIn({
        login: values.login,
        password: values.password,
      } as JwtSignInRequestDTO);

      const accessToken = response.accessToken;
      const refreshToken = response.refreshToken;

      if (!accessToken || !refreshToken) {
        throw new Error("Токены не получены");
      }

      login(accessToken, refreshToken);
      navigate("/");
    } catch (error: any) {
      console.error("Ошибка входа:", error);

      const status = error?.response?.status;

      let message = "Произошла ошибка при попытке входа";

      if (status === 401) {
        message = "Неверный логин или пароль";
      } else if (status === 404) {
        message = "Сервер не отвечает или маршрут /auth/login не найден";
      }

      showNotification({
        title: "Ошибка входа",
        message,
        color: "red",
      });
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
          />
          <TextInput
            placeholder="Введите пароль"
            type="password"
            radius="xl"
            {...form.getInputProps("password")}
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
