import { Button, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function LoginPage() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: { login: "", password: "" },
    validate: {
      login: (value) => (value ? null : "Введите логин"),
      password: (value) => (value ? null : "Введите пароль"),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
    // логика входа
  };

  return (
    <AuthLayout title="Войти">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="Логин"
            placeholder="Введите логин"
            radius="xl"
            {...form.getInputProps("login")}
          />
          <TextInput
            label="Пароль"
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
