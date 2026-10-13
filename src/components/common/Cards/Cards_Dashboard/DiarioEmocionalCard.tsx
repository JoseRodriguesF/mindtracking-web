"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import BaseCard from "./BaseCard";
import { getDiarios } from "@/lib/api/diario";
import { ArrowRight } from "lucide-react";

interface Consulta {
  id: string;
  paciente: string;
  data: string; // YYYY-MM-DD
  horario: string; // HH:mm
  observacao?: string;
  status: "agendada" | "cancelada";
}

interface DiarioEntrada {
  id?: string | number;
  titulo?: string;
  title?: string;
  texto?: string;
  data_hora?: string;
  createdAt?: string;
}

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function DiarioEmocionalCard() {
  const { theme } = useTheme();
  const router = useRouter();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [consultasHoje, setConsultasHoje] = useState<Consulta[]>([]);
  const [relatoriosEscritos, setRelatoriosEscritos] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const todayStr = getTodayString();

      // 1. Buscar consultas agendadas de hoje do localStorage
      let todayConsultas: Consulta[] = [];
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("mt_consultas_agendadas");
        if (stored) {
          try {
            const allConsultas: Consulta[] = JSON.parse(stored);
            todayConsultas = allConsultas.filter(
              (c) => c.data === todayStr && c.status === "agendada"
            );
          } catch (e) {
            console.error("Erro ao ler consultas:", e);
          }
        }
      }
      setConsultasHoje(todayConsultas);

      // 2. Buscar relatórios de diário/consultas
      let relatoriosTitulos: string[] = [];
      try {
        const resp = await getDiarios();
        const entradas: DiarioEntrada[] = Array.isArray(resp)
          ? resp
          : resp?.entradas || resp?.data || [];

        relatoriosTitulos = entradas.map(
          (e) => (e.titulo || e.title || "").toLowerCase().trim()
        );
      } catch (err) {
        console.error("Erro ao buscar relatórios:", err);
      }
      setRelatoriosEscritos(relatoriosTitulos);
      setLoading(false);
    };

    loadData();
  }, []);

  // Consultas de hoje que ainda NÃO possuem relatório escrito
  const relatoriosPendentesHoje = consultasHoje.filter((consulta) => {
    const nome = consulta.paciente.toLowerCase().trim();
    return !relatoriosEscritos.some((t) => t.includes(nome));
  });

  return (
    <BaseCard className="lg:h-full lg:min-h-0 w-full flex flex-col justify-between">
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Relatórios Pendentes
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {relatoriosPendentesHoje.length > 0
                ? `${relatoriosPendentesHoje.length} consulta(s) de hoje aguardando relatório.`
                : "Todos os relatórios de hoje estão em dia."}
            </p>
          </div>

          {/* Conteúdo principal */}
          {loading ? (
            <div className="py-8 text-center text-xs text-zinc-400">
              Carregando relatórios pendentes...
            </div>
          ) : relatoriosPendentesHoje.length > 0 ? (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[220px] overflow-y-auto pr-1 scrollbar-hide my-2">
              {relatoriosPendentesHoje.map((c) => {
                const initials = c.paciente
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <div key={c.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-900 dark:text-zinc-100 shrink-0">
                        {initials}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50 leading-none">
                          {c.paciente}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {c.observacao || "Consulta clínica"}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60">
                      {c.horario}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <p className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Tudo em dia!
              </p>
              <p className="text-xs mt-1 text-zinc-500 dark:text-zinc-400">
                {consultasHoje.length === 0
                  ? "Nenhuma consulta agendada para hoje."
                  : "Todas as consultas de hoje já possuem relatórios concluídos."}
              </p>
            </div>
          )}
        </div>

        {/* Botão de Redirecionamento para Relatórios */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={() => router.push("/relatorios")}
            className="w-full py-2.5 px-4 bg-black hover:bg-zinc-800 active:bg-zinc-900 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <span>Ir para Relatórios</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </BaseCard>
  );
}
