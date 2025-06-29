import { Box, Title, rem } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function LogoBox() {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate("/")}
      px="md"
      py={rem(10)}
      mb="xl"
      style={{
        display: "inline-block",
        borderRadius: rem(16),
        backgroundColor: "var(--color-green)",
        color: "white",
        fontWeight: 700,
        fontSize: rem(24),
        textAlign: "center",
        boxShadow: `
          inset -4px -4px 8px rgba(255, 255, 255, 0.4),
          inset 4px 4px 8px rgba(0, 0, 0, 0.1),
          6px 6px 16px #bcc4aa,
          -6px -6px 16px #ffffff
        `,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <Title order={1} style={{ margin: 0, fontSize: rem(24), color: "white" }}>
        TUDA
      </Title>
    </Box>
  );
}
