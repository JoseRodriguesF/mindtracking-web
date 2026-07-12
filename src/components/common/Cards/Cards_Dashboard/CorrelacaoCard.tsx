"use client";
import { useTheme } from "@/contexts/ThemeContext";
import BaseCard from "./BaseCard";

export default function CorrelacoesCard() {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "text-white" : "text-slate-800";
  const secondaryText = theme === "dark" ? "text-gray-400" : "text-slate-500";

  return (
    <BaseCard className="min-h-[520px] lg:h-full lg:min-h-0 w-full flex flex-col justify-center items-center text-center">
      <div className="p-6">
        <h1 className={`text-[20px] font-semibold mb-4 ${textColor}`}>
          Respostas frequentes:
        </h1>
        <div className={`text-[15px] ${secondaryText}`}>
          Não há respostas ou padrões de questionários disponíveis no momento.
        </div>
      </div>
    </BaseCard>
  );
}
