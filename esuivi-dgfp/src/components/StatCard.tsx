import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface StatCardProps {
  icon: LucideIcon;
  iconBg: string;
  label: string;
  value: ReactNode;
  onClick?: () => void;
}

export default function StatCard({
  icon: Icon,
  iconBg,
  label,
  value,
  onClick,
}: StatCardProps) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      className={`flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-sm ${
        onClick ? "cursor-pointer transition-shadow hover:shadow-md" : ""
      }`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
      >
        <Icon className="h-5 w-5 text-white" />
      </span>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-navy-950">{value}</p>
      </div>
    </Tag>
  );
}
