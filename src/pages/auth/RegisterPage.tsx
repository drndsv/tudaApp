import { Button, Group, Radio, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AuthControllerService,
  JwtSignUpRequestDTO,
  OpenAPI,
} from "../../api/generated";
import AuthLayout from "../../components/AuthLayout";
import { leftAlignedLabel } from "../../styles/formStyles";
import { isValidEmail, isValidPhone } from "../../utils/validators";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<"USER" | "ORGANIZER">("USER");

  const form = useForm({
    initialValues: {
      login: "",
      password: "",
      lastName: "",
      firstName: "",
      patronymic: "",
      phoneNumber: "",
      orgName: "",
      coordinatorName: "",
      coordinatorPhone: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.login) {
        errors.login = "Введите email";
      } else if (!isValidEmail(values.login)) {
        errors.login = "Некорректный email";
      }

      if (!values.password) errors.password = "Введите пароль";

      if (accountType === "USER") {
        if (!values.lastName) errors.lastName = "Введите фамилию";
        if (!values.firstName) errors.firstName = "Введите имя";
        if (!values.patronymic) errors.patronymic = "Введите отчество";
        if (!values.phoneNumber) {
          errors.phoneNumber = "Введите номер телефона";
        } else if (!isValidPhone(values.phoneNumber)) {
          errors.phoneNumber = "Формат: +7XXXXXXXXXX";
        }
      } else {
        if (!values.orgName) errors.orgName = "Введите название организации";
        if (!values.coordinatorName)
          errors.coordinatorName = "Введите ФИО координатора";
        if (!values.coordinatorPhone) {
          errors.coordinatorPhone = "Введите телефон координатора";
        } else if (!isValidPhone(values.coordinatorPhone)) {
          errors.coordinatorPhone = "Формат: +7XXXXXXXXXX";
        }
      }

      return errors;
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    const payload: JwtSignUpRequestDTO = {
      login: values.login,
      password: values.password,
      name: accountType === "USER" ? values.firstName : undefined,
      lastName: accountType === "USER" ? values.lastName : undefined,
      patronymic: accountType === "USER" ? values.patronymic : undefined,
      phoneNumber:
        accountType === "USER"
          ? values.phoneNumber
          : accountType === "ORGANIZER"
          ? values.coordinatorPhone
          : undefined,
      organizationName:
        accountType === "ORGANIZER" ? values.orgName : undefined,
      organizationPhoneNumber:
        accountType === "ORGANIZER" ? values.coordinatorPhone : undefined,
    };

    try {
      const prevToken = OpenAPI.TOKEN;
      OpenAPI.TOKEN = ""; // убрать токен, если он был

      await AuthControllerService.signUp(payload);

      OpenAPI.TOKEN = prevToken; // вернуть, если нужно

      navigate("/login");
    } catch (error) {
      console.error("Ошибка регистрации", error);
    }
  };

  return (
    <AuthLayout title="Создание учётной записи">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="sm">
          <TextInput
            label="email"
            placeholder="example@mail.com"
            radius="xl"
            {...form.getInputProps("login")}
            styles={{ label: leftAlignedLabel }}
          />
          <TextInput
            mb={8}
            label="Пароль"
            placeholder="Введите пароль"
            type="password"
            radius="xl"
            {...form.getInputProps("password")}
            styles={{ label: leftAlignedLabel }}
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
                placeholder="Введите фамилию"
                radius="xl"
                {...form.getInputProps("lastName")}
                styles={{ label: leftAlignedLabel }}
              />
              <TextInput
                label="Имя"
                placeholder="Введите имя"
                radius="xl"
                {...form.getInputProps("firstName")}
                styles={{ label: leftAlignedLabel }}
              />
              <TextInput
                label="Отчество"
                placeholder="Введите отчество"
                radius="xl"
                {...form.getInputProps("patronymic")}
                styles={{ label: leftAlignedLabel }}
              />
              <TextInput
                label="Номер телефона"
                placeholder="+7XXXXXXXXXX"
                radius="xl"
                {...form.getInputProps("phoneNumber")}
                styles={{ label: leftAlignedLabel }}
              />
            </>
          ) : (
            <>
              <TextInput
                label="Название организации"
                placeholder="Введите название организации"
                radius="xl"
                {...form.getInputProps("orgName")}
                styles={{ label: leftAlignedLabel }}
              />
              <TextInput
                label="ФИО координатора"
                placeholder="Введите ФИО координатора"
                radius="xl"
                {...form.getInputProps("coordinatorName")}
                styles={{ label: leftAlignedLabel }}
              />
              <TextInput
                label="Телефон координатора"
                placeholder="+7XXXXXXXXXX"
                radius="xl"
                {...form.getInputProps("coordinatorPhone")}
                styles={{ label: leftAlignedLabel }}
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
