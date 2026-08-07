"use client";

import React, { useState, useEffect } from "react";
import { getDiarios } from "@/lib/api/diario";
import ModalDiario from "@/components/common/Modals/Diario/ModalEscreverDiario";
import ModalLeituraDiario from "@/components/common/Modals/Diario/ModalLeituraDiario";
import { useSearchParams, useRouter } from "next/navigation";
import { useTheme } from "../../../contexts/ThemeContext";
import { ChevronDown, ChevronRight, User, FileText } from "lucide-react";

interface Analysis {
  message: string;
  emotion: string;
  intensity: string;
  athena: string;
}

interface Card {
  id: string | number;
  title: string;
  date: string;
  description: string;
  analysis?: Analysis;
}

interface DiarioEntry {
  id?: string | number;
  _id?: string | number;
  titulo?: string;
  title?: string;
  texto?: string;
  text?: string;
  descricao?: string;
  mensagem?: string;
  data_hora?: string;
  createdAt?: string;
  date?: string;
  emocao_predominante?: string;
  emocao?: string;
  intensidade_emocional?: string;
  intensidade?: string;
  comentario_athena?: string;
  comentario?: string;
  athena?: string;
}

interface DiarioResponse {
  entradas?: DiarioEntry[];
  data?: DiarioEntry[];
}

export default function RelatoriosClient() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const formatDate = (iso?: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} - ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  };

  const [cards, setCards] = useState<Card[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Modais
  const [openWriteModal, setOpenWriteModal] = useState(false);
  const [selectedCardForReading, setSelectedCardForReading] = useState<Card | null>(null);

  // Controle de grupos de datas expandidos
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

  const [tituloModal, setTituloModal] = useState("");
  const [textoModal, setTextoModal] = useState("");

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const resp = await getDiarios();
        let entradas: DiarioEntry[] = [];
        if (Array.isArray(resp)) entradas = resp as DiarioEntry[];
        else if ((resp as DiarioResponse)?.entradas)
          entradas = (resp as DiarioResponse).entradas || [];
        else if ((resp as DiarioResponse)?.data)
          entradas = (resp as DiarioResponse).data || [];

        const mapped = entradas.map((e: DiarioEntry) => {
          const titulo = e.titulo ?? e.title ?? "Paciente";
          const texto = e.texto ?? e.text ?? e.descricao ?? e.mensagem ?? "";
          const data_hora = e.data_hora ?? e.createdAt ?? e.date ?? null;

          const emocao = (e.emocao_predominante ?? e.emocao) || null;
          const intensidade = (e.intensidade_emocional ?? e.intensidade) || null;
          const comentarioAthena = (e.comentario_athena ?? e.comentario ?? e.athena) || null;
          const hasAnalysis = Boolean(comentarioAthena || emocao || intensidade);

          const analysis = hasAnalysis
            ? {
                message: texto,
                emotion: emocao ?? "",
                intensity: intensidade ?? "",
                athena: comentarioAthena ?? "",
              }
            : undefined;

          return {
            id: e.id ?? e._id ?? Math.random(),
            title: titulo,
            date: data_hora ? formatDate(data_hora) : "",
            description: texto,
            analysis,
          } as Card;
        });

        setCards(mapped as Card[]);
        setFetchError(null);

        // Inicializar todas as datas como expandidas por padrão
        const datesMap: Record<string, boolean> = {};
        mapped.forEach((c) => {
          const dKey = c.date ? c.date.split(" - ")[0].trim() : "Outros";
          datesMap[dKey] = true;
        });
        setExpandedDates(datesMap);
      } catch (error) {
        setFetchError(String(error ?? "Erro desconhecido"));
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  useEffect(() => {
    const open = searchParams?.get?.("openModal");
    if (open === "1") {
      setOpenWriteModal(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("openModal");
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, router]);

  // Agrupamento dos relatórios por DATA (ex: "06/08/2026")
  const groupedByDate = React.useMemo(() => {
    const groups: { dateKey: string; cards: Card[] }[] = [];
    const map = new Map<string, Card[]>();

    cards.forEach((card) => {
      const dateKey = card.date ? card.date.split(" - ")[0].trim() : "Outros";
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(card);
    });

    map.forEach((cardsInDate, dateKey) => {
      groups.push({ dateKey, cards: cardsInDate });
    });

    return groups;
  }, [cards]);

  const toggleDateExpand = (dateKey: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [dateKey]: !prev[dateKey],
    }));
  };

  return (
    <div className="h-screen min-h-0 flex flex-col">
      <div className="flex flex-col min-h-0 h-full p-4 sm:p-6 md:p-10 lg:ml-37.5 overflow-hidden">
        {/* Header da Página */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1
              className={`text-xl sm:text-2xl font-bold font-inter ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Relatórios de Consultas
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Visualize e registre relatórios clínicos agrupados por data
            </p>
          </div>

          <button
            onClick={() => {
              setTituloModal("");
              setTextoModal("");
              setOpenWriteModal(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>+ Novo Relatório</span>
          </button>
        </div>

        {/* Container Principal */}
        <div
          className={`flex-1 min-h-0 flex flex-col rounded-2xl p-4 sm:p-6 ${
            isDark
              ? "border-2 border-blue-600 bg-slate-900"
              : "bg-white border-2 border-slate-200 shadow-md"
          } transition-all duration-300 overflow-hidden`}
        >
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide pr-1 space-y-4">
            {loading ? (
              <p className="text-center font-inter text-sm py-12 text-gray-400">
                Carregando relatórios...
              </p>
            ) : cards.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <FileText size={40} className="text-gray-400 mb-3 opacity-50" />
                <p
                  className={`text-base font-semibold ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Nenhum relatório de consulta cadastrado.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                  Clique no botão abaixo para criar o primeiro relatório clínico de atendimento.
                </p>
                <button
                  onClick={() => {
                    setTituloModal("");
                    setTextoModal("");
                    setOpenWriteModal(true);
                  }}
                  className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Criar Relatório de Consulta
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pb-2 border-b border-gray-200 dark:border-slate-800">
                  <span>
                    Total de relatórios:{" "}
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {cards.length}
                    </span>
                  </span>
                  {fetchError && (
                    <span className="text-red-500 font-semibold">Erro: {fetchError}</span>
                  )}
                </div>

                {/* AGRUPADOS POR DATA */}
                <div className="space-y-4">
                  {groupedByDate.map((group) => {
                    const isExpanded = expandedDates[group.dateKey] ?? true;
                    return (
                      <div
                        key={group.dateKey}
                        className={`rounded-2xl border transition-all ${
                          isDark
                            ? "bg-slate-800/60 border-slate-700"
                            : "bg-slate-50/80 border-gray-200 shadow-sm"
                        }`}
                      >
                        {/* Header da Data */}
                        <button
                          onClick={() => toggleDateExpand(group.dateKey)}
                          className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          <div className="flex items-center gap-2.5">
                            <div>
                              <h3 className="font-bold text-sm sm:text-base">
                                Relatórios de {group.dateKey}
                              </h3>
                              <span className="text-xs text-gray-400">
                                {group.cards.length} paciente(s) com atendimento registrado
                              </span>
                            </div>
                          </div>

                          <div className="text-gray-400">
                            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                          </div>
                        </button>

                        {/* Pacientes que possuem relatório nessa data */}
                        {isExpanded && (
                          <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 border-t border-gray-200 dark:border-slate-700/60 mt-1">
                            {group.cards.map((card) => (
                              <div
                                key={card.id}
                                onClick={() => setSelectedCardForReading(card)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between hover:scale-[1.01] ${
                                  isDark
                                    ? "bg-slate-800 border-slate-700 hover:border-blue-500 text-white"
                                    : "bg-white border-gray-200 hover:border-blue-400 text-gray-900 shadow-sm"
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-sm flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                                      <User size={15} />
                                      {card.title}
                                    </h4>
                                    <span className="text-[11px] text-gray-400 font-medium">
                                      {card.date.split(" - ")[1] || ""}
                                    </span>
                                  </div>

                                  <p className="text-xs text-gray-500 dark:text-gray-300 line-clamp-3 leading-relaxed mb-3">
                                    {card.description}
                                  </p>
                                </div>

                                <div className="pt-2 border-t border-gray-100 dark:border-slate-700/50 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                                  <span>Abrir Relatório Completo</span>
                                  <span>→</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Leitura de Relatório */}
      <ModalLeituraDiario
        isOpen={!!selectedCardForReading}
        onClose={() => setSelectedCardForReading(null)}
        card={selectedCardForReading}
      />

      {/* Modal de Escrita de Relatório */}
      <ModalDiario
        isOpen={openWriteModal}
        onClose={() => setOpenWriteModal(false)}
        value={textoModal}
        onChange={(v: string) => setTextoModal(v)}
        title={tituloModal}
        onTitleChange={(t: string) => setTituloModal(t)}
        onSave={(created: DiarioEntry | undefined) => {
          if (created) {
            const titulo = created.titulo ?? created.title ?? "Paciente";
            const texto = created.texto ?? created.text ?? created.descricao ?? "";
            const data_hora = created.data_hora ?? created.createdAt ?? new Date().toISOString();

            const newCard = {
              id: created.id ?? created._id ?? Math.random(),
              title: titulo,
              date: data_hora ? formatDate(data_hora) : "",
              description: texto,
            };

            setCards((prev) => [newCard, ...prev]);
            setOpenWriteModal(false);
          }
        }}
      />
    </div>
  );
}
