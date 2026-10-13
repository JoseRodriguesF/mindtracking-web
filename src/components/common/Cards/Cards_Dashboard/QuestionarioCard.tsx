"use client";

import { useState, useEffect } from "react";
import BaseCard from "./BaseCard";
import { Calendar } from "lucide-react";

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
    <BaseCard className="w-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Status de Consultas
        </span>
        <Calendar className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          +{naoConcluidas}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-normal">
          {concluidas} concluída(s) · {naoConcluidas} pendente(s) no total
        </p>
      </div>
    </BaseCard>
  );
}