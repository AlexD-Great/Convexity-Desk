import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        default:
          "border border-[#1f2937] bg-[#0b1020] text-[#9ca3af]",
        primary:
          "border border-[#7cffb2]/20 bg-[#7cffb2]/10 text-[#7cffb2]",
        blue:
          "border border-[#60a5fa]/20 bg-[#60a5fa]/10 text-[#60a5fa]",
        success:
          "border border-[#22c55e]/20 bg-[#22c55e]/10 text-[#22c55e]",
        warning:
          "border border-[#f59e0b]/20 bg-[#f59e0b]/10 text-[#f59e0b]",
        danger:
          "border border-[#ef4444]/20 bg-[#ef4444]/10 text-[#ef4444]",
        live:
          "border border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]",
        fallback:
          "border border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#f59e0b]",
        mock:
          "border border-[#1f2937] bg-[#111827] text-[#9ca3af]",
        demo:
          "border border-[#7cffb2]/30 bg-[#7cffb2]/10 text-[#7cffb2]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ children, variant, className, dot }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {dot && (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  );
}
