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
  const textColor = isDark ? "text-white" : "text-slate-800";
  const secondaryText = isDark ? "text-slate-300" : "text-slate-600";

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
    <BaseCard className="lg:h-full lg:min-h-0 w-full flex flex-col justify-between p-4 sm:p-5">
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="border-b border-gray-200 dark:border-slate-700 pb-3 mb-3">
            <h2 className={`text-[19px] font-bold ${textColor}`}>
              Relatórios não escritos no dia
            </h2>
          </div>

          {/* Conteúdo principal */}
          {loading ? (
            <div className="py-6 text-center text-sm opacity-60">
              Carregando relatórios pendentes...
            </div>
          ) : relatoriosPendentesHoje.length > 0 ? (
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-hide">
              <p className={`text-xs font-medium mb-2 ${secondaryText}`}>
                Consultas de hoje aguardando elaboração de relatório:
              </p>
              {relatoriosPendentesHoje.map((c) => (
                <div
                  key={c.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-medium ${
                    isDark
                      ? "bg-slate-700/50 border-slate-600/50 text-white"
                      : "bg-slate-100 border-slate-200 text-slate-800"
                  }`}
                >
                  <span className="font-bold">{c.paciente}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-semibold">
                    {c.horario}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 flex flex-col items-center justify-center text-center">
              <p className={`text-sm font-semibold ${textColor}`}>
                Todos os relatórios de hoje estão em dia!
              </p>
              <p className={`text-xs mt-1 ${secondaryText}`}>
                {consultasHoje.length === 0
                  ? "Nenhuma consulta agendada para hoje."
                  : "Todas as consultas de hoje já possuem relatórios salvos."}
              </p>
            </div>
          )}
        </div>

        {/* Botão de Redirecionamento para Relatórios */}
        <div className="mt-4 pt-2">
          <button
            onClick={() => router.push("/relatorios")}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Ir para Relatórios</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </BaseCard>
  );
}
