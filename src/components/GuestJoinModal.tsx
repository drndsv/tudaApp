import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { isValidEmail } from "../utils/validators";

type Props = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (fullName: string, mail: string) => void;
};

export default function GuestJoinModal({ opened, onClose, onSubmit }: Props) {
  const [fullName, setFullName] = useState("");
  const [mail, setMail] = useState("");

  const handleSubmit = () => {
    if (!fullName || !mail) {
      showNotification({
        title: "Ошибка регистрации",
        message: "Заполните все поля",
        color: "red",
      });
      return;
    }

    if (!isValidEmail(mail)) {
      showNotification({
        title: "Некорректный email",
        message: "Проверьте правильность введённого email",
        color: "red",
      });
      return;
    }

    onSubmit(fullName, mail);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Регистрация участника"
      centered
      radius="lg"
    >
      <Stack>
        <TextInput
          label="ФИО"
          value={fullName}
          onChange={(e) => setFullName(e.currentTarget.value)}
          radius="xl"
        />
        <TextInput
          label="Email"
          value={mail}
          onChange={(e) => setMail(e.currentTarget.value)}
          radius="xl"
        />

        <Group justify="right" mt="md">
          <Button onClick={handleSubmit} color="green.10" radius="xl">
            Принять участие
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
