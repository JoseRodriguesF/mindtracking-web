"use client";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import BaseCard from "./BaseCard";

export default function QuestionarioCard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <BaseCard>
      <div className="flex justify-between items-center">
        <h1
          className={`text-[20px] font-semibold ${isDark ? "text-white" : "text-slate-800"}`}
        >
          Questionário diário
        </h1>
        <Image
          src={
            isDark
              ? "/images/icons/IconeQuestionario.svg"
              : "/images/icons/IconeQuestionario-black.svg"
          }
          alt="Logo"
          width={54}
          height={51}
          className="w-9 h-auto"
        />
      </div>

      <div className={`pt-4 pb-2 text-[15px] ${isDark ? "text-gray-300" : "text-slate-600"}`}>
        Não há questionários ativos. Use o Diário Emocional para registrar como você está se sentindo hoje.
      </div>
    </BaseCard>
  );
}