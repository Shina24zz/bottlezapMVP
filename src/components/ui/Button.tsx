"use client";

import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  loading?: boolean;
};

export function Button({
  variant = "primary",
  loading,
  disabled,
  className = "",
  type = "button",
  children,
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-bz-primary text-white shadow-md shadow-bz-primary/20 hover:bg-bz-primary-hover focus-visible:outline-bz-accent-bright"
      : variant === "outline"
        ? "border-2 border-bz-border-strong bg-bz-surface text-bz-primary hover:border-bz-primary/40 hover:bg-bz-accent-wash focus-visible:outline-bz-primary"
        : "text-bz-primary hover:bg-bz-accent-soft";

  return (
    <button
      type={type}
      className={`${base} ${styles} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
