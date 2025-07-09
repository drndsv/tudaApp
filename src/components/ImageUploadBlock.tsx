import { Box, Button, Text, rem } from "@mantine/core";

type ImageUploadBlockProps = {
  photoUploaded: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
};

export default function ImageUploadBlock({
  photoUploaded,
  onImageUpload,
}: ImageUploadBlockProps) {
  return (
    <Box
      h={320}
      style={{
        borderRadius: rem(16),
        overflow: "hidden",
        border: "1px dashed gray",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {photoUploaded ? (
        <Text c="green">Изображение загружено</Text>
      ) : (
        <Text>Изображение не выбрано</Text>
      )}

      <label htmlFor="file-upload">
        <Button component="span" mt="sm" radius="xl">
          Выбрать изображение
        </Button>
      </label>

      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        style={{ display: "none" }}
      />
    </Box>
  );
}
