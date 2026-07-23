import { AlignJustify } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  to?: string;
  variant?: "light" | "dark";
}

export default function Logo({ to = "/", variant = "light" }: LogoProps) {
  const textColor = variant === "light" ? "text-navy-950" : "text-white";

  return (
    <Link to={to} className="flex items-center gap-2.5 group">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-950">
        <AlignJustify className="h-[18px] w-[18px] text-gold-500" strokeWidth={2.5} />
      </span>
      <span className={`text-lg font-bold ${textColor}`}>
        eSuivi <span className="text-gold-500">— DGFP</span>
      </span>
    </Link>
  );
}
