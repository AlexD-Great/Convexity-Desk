import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "space-y-4",
        align === "center" && "mx-auto max-w-2xl text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-widest text-[#7cffb2]">
          {eyebrow}
        </p>
      )}
      <h2
        className="text-3xl font-bold text-white sm:text-4xl"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-base leading-relaxed text-[#9ca3af]">{subtitle}</p>
      )}
    </div>
  );
}
