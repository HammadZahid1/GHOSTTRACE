"use client";

import { cn } from "@/utils/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-cyan/12 text-cyan border-cyan/40 hover:bg-cyan/22 hover:border-cyan/70 hover:shadow-[0_0_24px_rgba(0,213,255,0.18)]",
  secondary:
    "bg-panel-elevated text-text-primary border-panel-border hover:border-cyan/40 hover:text-cyan",
  ghost:
    "bg-transparent text-text-secondary border-transparent hover:text-text-primary hover:bg-panel-elevated/70",
  danger:
    "bg-critical/10 text-critical border-critical/40 hover:bg-critical/20 hover:border-critical/70",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-[0.95rem] gap-2.5",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg border font-medium",
        "transition-all duration-200 select-none",
        "disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
