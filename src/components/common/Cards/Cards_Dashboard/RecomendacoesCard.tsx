"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BaseCard from "./BaseCard";
import { Sparkles } from "lucide-react";

export default function RecomendacoesCard() {
  const router = useRouter();
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
    <BaseCard className="w-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Assistente IA Athena
        </span>
        <Sparkles className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      </div>

      <div className="mt-3">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2.5 font-normal">
          Suporte clínico e orientações terapêuticas em tempo real.
        </p>

        <form onSubmit={handleAskHelp} className="flex gap-2 items-center">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Como a Athena pode ajudar?..."
            className="flex-1 rounded-lg px-3 py-1.5 text-xs border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-200 transition-colors"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-black hover:bg-zinc-800 active:bg-zinc-900 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            Ajuda
          </button>
        </form>
      </div>
    </BaseCard>
  );
}