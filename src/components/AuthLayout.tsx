import { Box, Container, Paper, Title, rem } from "@mantine/core";
import LogoBox from "./LogoBox";

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container size={420}>
        <Paper
          shadow="md"
          radius="xl"
          p="xl"
          style={{
            backgroundColor: "var(--color-cream)",
            borderRadius: rem(24),
            boxShadow: "10px 10px 30px #bcc4aa, -10px -10px 30px #ffffff",
          }}
        >
          <Box style={{ display: "flex", justifyContent: "center" }}>
            <LogoBox />
          </Box>

          <Title
            order={3}
            style={{ textAlign: "center", marginBottom: rem(20) }}
          >
            {title}
          </Title>

          {children}
        </Paper>
      </Container>
    </Box>
  );
}
