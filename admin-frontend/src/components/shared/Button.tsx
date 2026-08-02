import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
}

export default function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base = "px-6 py-3 rounded font-body font-medium text-body-md transition-all duration-200";
  const variants = {
    primary: "bg-accent text-onSurface hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]",
    ghost: "bg-transparent text-onSurfaceVariant hover:text-onSurface",
    outline: "border border-white/20 text-onSurface hover:border-accent hover:text-accent",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}