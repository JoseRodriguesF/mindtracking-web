"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import BaseCard from "./BaseCard";

export default function RecomendacoesCard() {
  const { theme } = useTheme();
  const router = useRouter();
  const isDark = theme === "dark";
  const textColor = isDark ? "text-white" : "text-slate-800";

  const [prompt, setPrompt] = useState("");

  const handleAskHelp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (prompt.trim()) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("athena_initial_prompt", prompt.trim());
      }
    }
    router.push("/athena");
  };

  return (
    <BaseCard className="w-full flex flex-col justify-between p-4">
      <div className="mb-2">
        <h1 className={`text-[19px] font-bold ${textColor}`}>
          Assistente IA Athena
        </h1>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-300 font-medium mb-3">
        Precisa de auxílio clínico, sugestão de conduta ou suporte emocional? Peça ajuda à Athena.
      </p>

      <form onSubmit={handleAskHelp} className="flex gap-2 items-center">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Como posso te ajudar hoje?..."
          className={`flex-1 rounded-xl px-3 py-2.5 text-xs border outline-none transition-all ${
            isDark
              ? "bg-slate-700/50 border-slate-600/50 text-white focus:border-blue-500"
              : "bg-slate-100 border-slate-200 text-slate-900 focus:border-blue-500"
          }`}
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
        >
          Ajuda
        </button>
      </form>
    </BaseCard>
  );
}