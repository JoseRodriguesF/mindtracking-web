"use client";
import { ReactNode } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface BaseCardProps {
  children: ReactNode;
  className?: string;
}

export default function BaseCard({ children, className }: BaseCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`
        rounded-2xl
        p-6
        w-full flex flex-col
        transition-colors
        border
        ${
          isDark
            ? "bg-zinc-900 border-zinc-800 text-zinc-50 shadow-sm"
            : "bg-white border-zinc-200/80 text-zinc-950 shadow-sm"
        }
        ${className ?? ""}
      `}
    >
      {children}
    </div>
  );
}

