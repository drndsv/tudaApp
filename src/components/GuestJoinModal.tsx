import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { useState } from "react";

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
      alert("Заполните все поля");
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
    >
      <Stack>
        <TextInput
          label="ФИО"
          value={fullName}
          onChange={(e) => setFullName(e.currentTarget.value)}
        />
        <TextInput
          label="Email"
          value={mail}
          onChange={(e) => setMail(e.currentTarget.value)}
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
