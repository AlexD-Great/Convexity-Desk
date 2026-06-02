import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  sublabel?: string;
  accent?: string;
  icon?: LucideIcon;
  className?: string;
}

export function MetricCard({
  label,
  value,
  sublabel,
  accent = "#f9fafb",
  icon: Icon,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-[#1f2937] bg-[#0b1020] p-5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#6b7280]">
          {label}
        </p>
        {Icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[#1f2937] bg-[#111827]">
            <Icon className="h-3.5 w-3.5 text-[#9ca3af]" />
          </div>
        )}
      </div>
      <p
        className="text-2xl font-bold leading-none"
        style={{ fontFamily: "var(--font-space-grotesk)", color: accent }}
      >
        {value}
      </p>
      {sublabel && (
        <p className="text-xs text-[#6b7280]">{sublabel}</p>
      )}
    </div>
  );
}
