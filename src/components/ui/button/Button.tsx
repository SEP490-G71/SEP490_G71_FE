// src/components/ui/button/Button.tsx
import React, { ReactNode } from "react";

type Size = "sm" | "md";
type Variant = "primary" | "outline";

// Props riêng của Button
type ButtonOwnProps = {
  children: ReactNode;
  size?: Size;
  variant?: Variant;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  isLoading?: boolean;
  className?: string;
};

// 👉 Kế thừa toàn bộ props HTML của <button> (bao gồm type, onClick, disabled, ...)
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonOwnProps;

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-3 text-sm",
  md: "px-5 py-3.5 text-sm",
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
  outline:
    "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
};

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  isLoading = false,
  className = "",
  disabled,
  // ⬇️ mọi prop khác như type, onClick, aria-*, data-* ...
  ...rest
}) => {
  const isDisabled = Boolean(disabled || isLoading);

  return (
    <button
      {...rest} // ⬅️ forward type, onClick, v.v.
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        isDisabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {isLoading ? "Loading..." : children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
