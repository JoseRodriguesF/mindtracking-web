"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import BaseCard from "./BaseCard";
import { getDiarios } from "@/lib/api/diario";

interface Consulta {
  id: string;
  paciente: string;
  data: string;
  horario: string;
  status: "agendada" | "cancelada" | "concluida";
}

interface DiarioEntrada {
  id?: string | number;
  titulo?: string;
  title?: string;
}

export default function EstadoEmocionalCard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const textColor = isDark ? "text-white" : "text-slate-800";
  const labelColor = isDark ? "text-slate-300" : "text-slate-600";

  const [relatoriosConcluidos, setRelatoriosConcluidos] = useState(0);
  const [relatoriosPendentes, setRelatoriosPendentes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      let writtenCount = 0;
      let writtenTitles: string[] = [];

      try {
        const resp = await getDiarios();
        const entradas: DiarioEntrada[] = Array.isArray(resp)
          ? resp
          : resp?.entradas || resp?.data || [];
        writtenCount = entradas.length;
        writtenTitles = entradas.map(
          (e) => (e.titulo || e.title || "").toLowerCase().trim()
        );
      } catch (e) {
        console.error("Erro ao carregar relatórios:", e);
      }
      setRelatoriosConcluidos(writtenCount);

      // Calcular não concluídos baseando-se nas consultas agendadas sem relatório
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("mt_consultas_agendadas");
        if (stored) {
          try {
            const list: Consulta[] = JSON.parse(stored);
            const activeConsultas = list.filter((c) => c.status === "agendada");

            const pending = activeConsultas.filter((c) => {
              const nome = c.paciente.toLowerCase().trim();
              return !writtenTitles.some((t) => t.includes(nome));
            }).length;

            setRelatoriosPendentes(pending);
          } catch {
            setRelatoriosPendentes(0);
          }
        }
      }
    };

    fetchData();
  }, []);

  return (
    <BaseCard className="w-full flex flex-col justify-between p-4">
      <div className="mb-2">
        <h1 className={`text-[19px] font-bold ${textColor}`}>
          Status dos Relatórios
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 my-2">
        {/* Concluídos */}
        <div className="flex flex-col">
          <span className={`text-sm font-semibold mb-1 ${labelColor}`}>
            Concluídos
          </span>
          <span className={`text-3xl font-bold ${textColor}`}>
            {relatoriosConcluidos}
          </span>
        </div>

        {/* Não Concluídos / Pendentes */}
        <div className="flex flex-col">
          <span className={`text-sm font-semibold mb-1 ${labelColor}`}>
            Não Concluídos
          </span>
          <span className={`text-3xl font-bold ${textColor}`}>
            {relatoriosPendentes}
          </span>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 dark:text-gray-400 mt-2 font-medium">
        Relatórios elaborados para pacientes e sessões.
      </p>
    </BaseCard>
  );
}