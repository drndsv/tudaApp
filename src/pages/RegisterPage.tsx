import { Button, Group, Radio, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<"USER" | "ORGANIZER">("USER");

  const form = useForm({
    initialValues: {
      login: "",
      password: "",
      lastName: "",
      firstName: "",
      middleName: "",
      orgName: "",
      coordinatorName: "",
      coordinatorPhone: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.login) errors.login = "Введите логин";
      if (!values.password) errors.password = "Введите пароль";

      if (accountType === "USER") {
        if (!values.lastName) errors.lastName = "Введите фамилию";
        if (!values.firstName) errors.firstName = "Введите имя";
        if (!values.middleName) errors.middleName = "Введите отчество";
      } else {
        if (!values.orgName) errors.orgName = "Введите название организации";
        if (!values.coordinatorName)
          errors.coordinatorName = "Введите ФИО координатора";
        if (!values.coordinatorPhone)
          errors.coordinatorPhone = "Введите телефон";
      }

      return errors;
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
    // логика регистрации
  };

  return (
    <AuthLayout title="Создание учётной записи">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="Логин"
            placeholder="Введите логин"
            radius="xl"
            {...form.getInputProps("login")}
          />
          <TextInput
            mb={8}
            label="Пароль"
            placeholder="Введите пароль"
            type="password"
            radius="xl"
            {...form.getInputProps("password")}
          />

          <Radio.Group
            mb={8}
            label="Тип аккаунта"
            value={accountType}
            onChange={(value) => setAccountType(value as "USER" | "ORGANIZER")}
            styles={{ label: { marginBottom: 8 } }}
          >
            <Group>
              <Radio value="USER" label="Пользователь" />
              <Radio value="ORGANIZER" label="Организатор" />
            </Group>
          </Radio.Group>

          {accountType === "USER" ? (
            <>
              <TextInput
                label="Фамилия"
                radius="xl"
                {...form.getInputProps("lastName")}
              />
              <TextInput
                label="Имя"
                radius="xl"
                {...form.getInputProps("firstName")}
              />
              <TextInput
                label="Отчество"
                radius="xl"
                {...form.getInputProps("middleName")}
              />
            </>
          ) : (
            <>
              <TextInput
                label="Название организации"
                radius="xl"
                {...form.getInputProps("orgName")}
              />
              <TextInput
                label="ФИО координатора"
                radius="xl"
                {...form.getInputProps("coordinatorName")}
              />
              <TextInput
                label="Телефон координатора"
                radius="xl"
                {...form.getInputProps("coordinatorPhone")}
              />
            </>
          )}

          <Button type="submit" fullWidth radius="xl" color="green.10">
            Создать
          </Button>

          <Text
            mt="xs"
            onClick={() => navigate("/login")}
            style={{
              textAlign: "center",
              cursor: "pointer",
              color: "#568857",
            }}
          >
            Уже есть учётная запись? Войти
          </Text>
        </Stack>
      </form>
    </AuthLayout>
  );
}
