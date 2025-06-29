import { useNavigate } from "react-router-dom";
import {
  Group,
  Text,
  Menu,
  ActionIcon,
  Box,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  return (
    <Box
      bg={theme.colors.green[10]}
      px="lg"
      py="md"
      style={{
        borderRadius: rem(16),
        marginBottom: rem(40),
        boxShadow: "8px 8px 16px #bcc4aa, -8px -8px 16px #ffffff",
      }}
    >
      <Group justify="space-between" align="center">
        <Text
          fw={700}
          fz="xl"
          c={theme.colors.dark[0]}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          TUDA
        </Text>

        <Menu shadow="md" width={220} radius="md" withArrow>
          <Menu.Target>
            <ActionIcon variant="subtle" size="xl" color={theme.colors.dark[0]}>
              <FaUserCircle size={28} color={theme.colors.dark[0]} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={() => navigate("/profile")}>
              Управление профилем
            </Menu.Item>
            <Menu.Item onClick={() => navigate("/my-events")}>
              Мои мероприятия
            </Menu.Item>
            <Menu.Item onClick={() => console.log("Выход из аккаунта")}>
              Выход из аккаунта
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Box>
  );
}
