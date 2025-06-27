interface PrimaryButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
}

export default function PrimaryButton({
  children,
  disabled,
}: PrimaryButtonProps) {
  return (
    <button
      className="text-white py-2 px-4 rounded-xl disabled:opacity-50"
      style={{ backgroundColor: "var(--color-green)" }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
