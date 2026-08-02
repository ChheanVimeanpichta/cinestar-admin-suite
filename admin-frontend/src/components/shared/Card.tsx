import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  glass?: boolean; // apply glassmorphism style
  className?: string;
}

export default function Card({ children, glass = false, className = "" }: CardProps) {
  const base = "rounded p-6";
  const surface = glass ? "glass-surface" : "bg-surface-variant";
  return <div className={`${base} ${surface} ${className}`}>{children}</div>;
}