import { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function PrimaryButton({
  children,
  disabled,
  ...rest // захватываем onClick и прочие props
}: PrimaryButtonProps) {
  return (
    <button
      className="text-white py-2 px-4 rounded-xl disabled:opacity-50"
      style={{ backgroundColor: "var(--color-green)" }}
      disabled={disabled}
      {...rest} // пробрасываем onClick и другие props
    >
      {children}
    </button>
  );
}
