"use client";

import { useState, useEffect } from "react";
import BaseCard from "./BaseCard";
import { getDiarios } from "@/lib/api/diario";
import { FileText } from "lucide-react";

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
    <BaseCard className="w-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Status dos Relatórios
        </span>
        <FileText className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          +{relatoriosConcluidos}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-normal">
          {relatoriosPendentes} consulta(s) aguardando relatório
        </p>
      </div>
    </BaseCard>
  );
}