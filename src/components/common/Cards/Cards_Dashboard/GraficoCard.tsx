"use client";
import { useTheme } from "@/contexts/ThemeContext";
import BaseCard from "./BaseCard";

export default function GraficoCard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const mainText = isDark ? "text-white" : "text-slate-800";
  const secondaryText = isDark ? "text-gray-400" : "text-slate-500";

  return (
    <BaseCard className="min-h-[350px] md:min-h-[380px] lg:h-full lg:min-h-0 w-full flex flex-col justify-center items-center">
      <div className="text-center p-6">
        <div className={`text-[20px] font-semibold mb-2 ${mainText}`}>Seu Bem-Estar Essa Semana</div>
        <div className={`text-[15px] ${secondaryText}`}>
          Não há questionários respondidos para exibir no gráfico semanal.
        </div>
      </div>
    </BaseCard>
  );
}