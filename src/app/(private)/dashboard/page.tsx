"use client";
import { useState, useEffect } from "react";
import QuestionarioCard from "@/components/common/Cards/Cards_Dashboard/QuestionarioCard";
import EstadoEmocionalCard from "@/components/common/Cards/Cards_Dashboard/EstadoEmocionalCard";
import RecomendacoesCard from "@/components/common/Cards/Cards_Dashboard/RecomendacoesCard";
import DiarioEmocionalCard from "@/components/common/Cards/Cards_Dashboard/DiarioEmocionalCard";
import dynamic from "next/dynamic";

const GraficoCard = dynamic(() => import("@/components/common/Cards/Cards_Dashboard/GraficoCard"), {
  ssr: false,
  loading: () => <div className="h-[360px] w-full animate-pulse bg-gray-100 dark:bg-slate-800 rounded-2xl" />
});

const CorrelacaoCard = dynamic(() => import("@/components/common/Cards/Cards_Dashboard/CorrelacaoCard"), {
  ssr: false,
  loading: () => <div className="h-[250px] w-full animate-pulse bg-gray-100 dark:bg-slate-800 rounded-2xl" />
});

const AthenaCard = dynamic(() => import("@/components/common/Cards/Cards_Dashboard/AthenaCard"), {
  ssr: false,
  loading: () => <div className="h-[250px] w-full animate-pulse bg-gray-100 dark:bg-slate-800 rounded-2xl" />
});
import api, { setAuthToken } from "@/lib/api/axios";
import { verificarDiario, historico } from "@/lib/api/questionario";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [questionarioStatus, setQuestionarioStatus] = useState({
    respondeuHoje: false,
    respondidos: 0,
    loading: true,
  });
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [historicoData, setHistoricoData] = useState(null);

  useEffect(() => {
    if (authLoading || !user) return;

    const id = user.id;
    if (!id) return;
    setUsuarioId(String(id));

    const init = async () => {
      if (typeof window !== "undefined") {
        const token = sessionStorage.getItem("mt_token");
        if (token) setAuthToken(token);
      }

      try {
        const [respVerif, respHistorico, estatisticasResponse] = await Promise.all([
          verificarDiario(String(id)),
          historico(String(id)),
          api.get(`/questionario/estatisticas/${id}`)
        ]);

        const jaRespondido =
          respVerif?.ja_respondido === true ||
          respVerif?.data?.ja_respondido === true;

        // Buscar e guardar histórico no estado
        setHistoricoData(respHistorico);

        setQuestionarioStatus({
          respondeuHoje: jaRespondido,
          respondidos:
            estatisticasResponse?.data?.estatisticas?.total_questionarios || 0,
          loading: false,
        });
      } catch {
        setQuestionarioStatus({
          respondeuHoje: false,
          respondidos: 0,
          loading: false,
        });
      }
    };

    init();
  }, [user, authLoading]);

  return (
    <div className="ml-0 lg:ml-[150px] min-h-screen lg:h-screen overflow-y-auto lg:overflow-hidden">
      <div className="ml-0 lg:ml-[50px] flex flex-col h-full min-h-0 pb-5 lg:pb-0">
        <div className="flex-shrink-0">
          <h2 className="text-[30px] font-semibold mb-2 mt-2 ml-6 md:ml-0 md:text-center lg:text-start">
            Seu resumo de saúde mental semanal
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 max-w-[92%] mx-auto lg:mx-0 lg:max-w-[98%] flex-shrink-0">
          <QuestionarioCard
            respondidos={questionarioStatus.respondidos}
            respondeuHoje={questionarioStatus.respondeuHoje}
            loading={questionarioStatus.loading}
          />
          {usuarioId && <EstadoEmocionalCard usuarioId={usuarioId} />}
          <RecomendacoesCard />
        </div>

        {/* Segunda linha de cards (gráfico, diário, correlações, Athena) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 max-w-[92%] mx-auto lg:mx-0 my-4 lg:my-4 lg:max-w-[98%] lg:flex-1 lg:min-h-0 lg:overflow-hidden">
          <div className="h-full min-h-0">
            <GraficoCard historicoData={historicoData} />
          </div>
          <div className="h-full min-h-0">
            <DiarioEmocionalCard />
          </div>

          <div className="flex flex-col gap-4 md:gap-6 lg:h-full lg:min-h-0 lg:justify-between">
            <div className="lg:flex-1 lg:min-h-0">
              <CorrelacaoCard />
            </div>
            <div className="lg:flex-1 lg:min-h-0">
              <AthenaCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
