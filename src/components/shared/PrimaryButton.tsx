"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const sizeClasses = {
  sm: "h-8 px-4 text-sm",
  md: "h-10 px-6 text-sm",
  lg: "h-12 px-8 text-base",
} as const;

interface BaseProps {
  children: ReactNode;
  className?: string;
  size?: keyof typeof sizeClasses;
  disabled?: boolean;
}

interface ButtonProps extends BaseProps {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
}

interface LinkProps extends BaseProps {
  href: string;
  onClick?: never;
  type?: never;
}

type PrimaryButtonProps = ButtonProps | LinkProps;

const buttonClasses = (size: keyof typeof sizeClasses, disabled?: boolean, className?: string) =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold",
    "bg-[#7cffb2] text-[#05070d]",
    "hover:bg-[#5cefaa] active:bg-[#4cde9a]",
    "transition-colors duration-150",
    sizeClasses[size],
    disabled && "cursor-not-allowed opacity-50",
    className
  );

export function PrimaryButton(props: PrimaryButtonProps) {
  const { children, className, size = "md", disabled } = props;
  const classes = buttonClasses(size, disabled, className);

  if (props.href !== undefined) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex">
        <Link href={props.href} className={classes}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </motion.button>
  );
}
