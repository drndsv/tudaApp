import { useNavigate } from "react-router-dom";
import {
  Group,
  Text,
  Menu,
  ActionIcon,
  Button,
  Box,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { token, logout, user } = useAuth();

  const roles = user?.roles || [];
  const isOrganizer = roles.includes("ROLE_ORGANIZER");

  const handleLogout = () => {
    logout();
    // window.location.reload();
    navigate("/");
  };

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

        {token ? (
          <Menu shadow="md" width={220} radius="md" withArrow>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                size="xl"
                color={theme.colors.dark[0]}
              >
                <FaUserCircle size={28} color={theme.colors.dark[0]} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={() => navigate("/profile")}>
                Профиль
              </Menu.Item>

              <Menu.Item
                onClick={() =>
                  navigate(isOrganizer ? "/organizerEvents" : "/userEvents")
                }
              >
                Мои мероприятия
              </Menu.Item>

              {isOrganizer && (
                <Menu.Item onClick={() => navigate("/createEvent")}>
                  Создать мероприятие
                </Menu.Item>
              )}

              <Menu.Item onClick={handleLogout}>Выйти</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Button radius="xl" onClick={() => navigate("/login")}>
            Войти
          </Button>
        )}
      </Group>
    </Box>
  );
}
