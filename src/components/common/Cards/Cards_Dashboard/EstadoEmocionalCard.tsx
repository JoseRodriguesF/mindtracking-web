"use client";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import BaseCard from "./BaseCard";

export default function EstadoEmocionalCard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const mainText = isDark ? "text-white" : "text-slate-800";
  const secondaryText = isDark ? "text-white" : "text-slate-700";

  return (
    <BaseCard>
      <div className="flex justify-between items-center">
        <h1 className={`text-[20px] font-semibold ${mainText}`}>
          Estado Emocional Médio
        </h1>
        <Image
          src={
            isDark
              ? "/images/icons/IconeGrafico.svg"
              : "/images/icons/IconeGrafico-black.svg"
          }
          alt="Ícone gráfico"
          width={54}
          height={51}
          className="w-9 h-auto"
        />
      </div>

      <p className={`mt-3 text-[15px] font-medium ${secondaryText}`}>
        Não há questionários ativos para analisar o estado emocional médio.
      </p>
    </BaseCard>
  );
}