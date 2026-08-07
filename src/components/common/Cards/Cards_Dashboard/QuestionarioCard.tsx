"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import BaseCard from "./BaseCard";

interface Consulta {
  id: string;
  paciente: string;
  data: string; // YYYY-MM-DD
  horario: string; // HH:mm
  observacao?: string;
  status: "agendada" | "cancelada" | "concluida";
}

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function QuestionarioCard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const textColor = isDark ? "text-white" : "text-slate-800";
  const labelColor = isDark ? "text-slate-300" : "text-slate-600";

  const [concluidas, setConcluidas] = useState(0);
  const [naoConcluidas, setNaoConcluidas] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const todayStr = getTodayString();
      const stored = localStorage.getItem("mt_consultas_agendadas");
      if (stored) {
        try {
          const list: Consulta[] = JSON.parse(stored);
          
          // Consultas passadas ativas ou marcadas como concluídas
          const done = list.filter(
            (c) => c.status === "concluida" || (c.status === "agendada" && c.data < todayStr)
          ).length;

          // Consultas agendadas para hoje ou futuro
          const pending = list.filter(
            (c) => c.status === "agendada" && c.data >= todayStr
          ).length;

          setConcluidas(done);
          setNaoConcluidas(pending);
        } catch {
          setConcluidas(0);
          setNaoConcluidas(0);
        }
      }
    }
  }, []);

  return (
    <BaseCard className="w-full flex flex-col justify-between p-4">
      <div className="mb-2">
        <h1 className={`text-[19px] font-bold ${textColor}`}>
          Status de Consultas
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 my-2">
        {/* Concluídas */}
        <div className="flex flex-col">
          <span className={`text-sm font-semibold mb-1 ${labelColor}`}>
            Concluídas
          </span>
          <span className={`text-3xl font-bold ${textColor}`}>
            {concluidas}
          </span>
        </div>

        {/* Pendentes */}
        <div className="flex flex-col">
          <span className={`text-sm font-semibold mb-1 ${labelColor}`}>
            Pendentes
          </span>
          <span className={`text-3xl font-bold ${textColor}`}>
            {naoConcluidas}
          </span>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 dark:text-gray-400 mt-2 font-medium">
        Total de {concluidas + naoConcluidas} consulta(s) no histórico.
      </p>
    </BaseCard>
  );
}