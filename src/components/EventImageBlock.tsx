import { Box, Center, Image, Text, rem } from "@mantine/core";

interface EventImageBlockProps {
  src?: string | null;
  alt?: string;
  height?: number | string;
  radius?: number | string;
}

export default function EventImageBlock({
  src,
  alt = "Изображение",
  height = 320,
  radius = rem(16),
}: EventImageBlockProps) {
  return (
    <Box
      h={height}
      style={{
        borderRadius: radius,
        overflow: "hidden",
        boxShadow: "8px 8px 16px #bcc4aa, -8px -8px 16px #ffffff",
      }}
    >
      {src ? (
        <Image src={src} alt={alt} h="100%" w="100%" fit="cover" />
      ) : (
        <Center h="100%" bg="gray.0">
          <Text c="gray.6">Без фото</Text>
        </Center>
      )}
    </Box>
  );
}
