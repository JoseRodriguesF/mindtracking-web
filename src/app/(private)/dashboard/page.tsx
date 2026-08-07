"use client";
import { useEffect } from "react";
import QuestionarioCard from "@/components/common/Cards/Cards_Dashboard/QuestionarioCard";
import EstadoEmocionalCard from "@/components/common/Cards/Cards_Dashboard/EstadoEmocionalCard";
import RecomendacoesCard from "@/components/common/Cards/Cards_Dashboard/RecomendacoesCard";
import DiarioEmocionalCard from "@/components/common/Cards/Cards_Dashboard/DiarioEmocionalCard";
import dynamic from "next/dynamic";

const CalendarioCard = dynamic(
  () => import("@/components/common/Cards/Cards_Dashboard/CalendarioCard"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[360px] w-full animate-pulse bg-gray-100 dark:bg-slate-800 rounded-2xl" />
    ),
  }
);

import { setAuthToken } from "@/lib/api/axios";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading || !user) return;

    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("mt_token");
      if (token) setAuthToken(token);
    }
  }, [user, authLoading]);

  return (
    <div className="ml-0 lg:ml-[150px] min-h-screen lg:h-screen overflow-y-auto scrollbar-hide lg:overflow-hidden">
      <div className="ml-0 lg:ml-[50px] flex flex-col h-full min-h-0 pb-5 lg:pb-0">
        <div className="flex-shrink-0">
          <h2 className="text-[30px] font-semibold mb-2 mt-2 ml-6 md:ml-0 md:text-center lg:text-start">
            Seu resumo de saúde mental semanal
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 max-w-[92%] mx-auto lg:mx-0 lg:max-w-[98%] flex-shrink-0">
          <QuestionarioCard />
          <EstadoEmocionalCard />
          <RecomendacoesCard />
        </div>

        {/* Segunda linha de cards: Calendário de Consultas (2/3 da largura) e Relatórios de Consultas (1/3 da largura) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 max-w-[92%] mx-auto lg:mx-0 my-4 lg:my-4 lg:max-w-[98%] lg:flex-1 lg:min-h-0 lg:overflow-hidden">
          <div className="lg:col-span-2 h-full min-h-0">
            <CalendarioCard />
          </div>
          <div className="lg:col-span-1 h-full min-h-0">
            <DiarioEmocionalCard />
          </div>
        </div>
      </div>
    </div>
  );
}
