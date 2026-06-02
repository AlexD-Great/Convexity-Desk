import { cn } from "@/lib/utils";

const variantClasses = {
  default: "border border-[#1f2937] bg-[#0b1020]",
  elevated: "border border-[#1f2937] bg-[#111827]",
  glow: "border border-[#7cffb2]/20 bg-[#0b1020] shadow-[0_0_24px_rgba(124,255,178,0.06)]",
  danger: "border border-[#ef4444]/20 bg-[#0b1020]",
  warning: "border border-[#f59e0b]/20 bg-[#0b1020]",
} as const;

interface CardShellProps {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variantClasses;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function CardShell({
  children,
  className,
  variant = "default",
  padding = "md",
}: CardShellProps) {
  return (
    <div
      className={cn(
        "rounded-xl",
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}
