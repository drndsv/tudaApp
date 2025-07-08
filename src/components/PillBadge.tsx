import { Box, Text } from "@mantine/core";

type PillBadgeProps = {
  label: string;
  color?: string; // Цвет текста
  bgColor?: string; // Цвет фона
  borderColor?: string; // Цвет рамки
};

export default function PillBadge({
  label,
  color = "gray.8",
  bgColor = "gray.1",
  borderColor = "#ced4da",
}: PillBadgeProps) {
  return (
    <Box
      px="md"
      py={4}
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "999px",
      }}
    >
      <Text size="sm" fw={500} c={color}>
        {label}
      </Text>
    </Box>
  );
}
