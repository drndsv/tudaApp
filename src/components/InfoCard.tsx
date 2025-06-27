import { InfoCardProps } from "../types/models";
import clsx from "clsx";

interface Props extends InfoCardProps {
  className?: string;
}

export default function InfoCard({ title, children, className }: Props) {
  return (
    <div className={clsx("bg-white rounded-2xl p-4 shadow-md", className)}>
      <h2 className="text-sm font-semibold mb-2">{title}</h2>
      <div className="text-sm">{children}</div>
    </div>
  );
}
