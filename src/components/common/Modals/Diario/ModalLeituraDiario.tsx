"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "../../../../contexts/ThemeContext";
import { UserCheck, Phone, FileText, Calendar as CalendarIcon, X } from "lucide-react";

interface Paciente {
  id: string;
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  observacoes: string;
}

interface Analysis {
  message: string;
  emotion: string;
  intensity: string;
  athena: string;
}

interface Card {
  id: string | number;
  title: string; // Nome do paciente
  date: string;
  description: string;
  analysis?: Analysis;
}

interface ModalLeituraDiarioProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card | null;
}

// Helper para calcular idade
const calcularIdade = (dataNascStr: string) => {
  if (!dataNascStr) return "";
  const nasc = new Date(dataNascStr + "T00:00:00");
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
    idade--;
  }
  return isNaN(idade) ? "" : `${idade} anos`;
};

export default function ModalLeituraDiario({
  isOpen,
  onClose,
  card,
}: ModalLeituraDiarioProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [paciente, setPaciente] = useState<Paciente | null>(null);

  useEffect(() => {
    if (isOpen && card && typeof window !== "undefined") {
      const stored = localStorage.getItem("mt_pacientes");
      if (stored) {
        try {
          const list: Paciente[] = JSON.parse(stored);
          const found = list.find(
            (p) => p.nomeCompleto.toLowerCase().trim() === card.title.toLowerCase().trim()
          );
          setPaciente(found || null);
        } catch (e) {
          console.error("Erro ao buscar paciente para leitura:", e);
        }
      }
    }
  }, [isOpen, card]);

  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-3 sm:px-4 py-4 overflow-y-auto">
      <div
        className={`p-5 sm:p-7 rounded-2xl w-full max-w-[920px] relative shadow-2xl transition-all duration-300 my-auto ${
          isDark ? "bg-slate-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 cursor-pointer z-10 text-gray-400 hover:text-gray-600 dark:hover:text-white"
          aria-label="Fechar modal"
        >
          <X size={24} />
        </button>

        {/* Modal em DUAS PARTES (Grid Responsivo 2 Colunas) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
          {/* PARTE 1 (Lado Esquerdo): Ficha do Paciente */}
          <div
            className={`md:col-span-4 rounded-xl p-4 border flex flex-col justify-between ${
              isDark
                ? "bg-slate-800/80 border-slate-700 text-gray-200"
                : "bg-slate-50 border-gray-200 text-gray-800"
            }`}
          >
            <div>
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-200 dark:border-slate-700">
                <UserCheck size={20} className="text-blue-500 shrink-0" />
                <h3 className="font-bold text-base">Ficha do Paciente</h3>
              </div>

              {paciente ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-gray-400 font-semibold block">Nome Completo</span>
                    <p className="font-bold text-sm text-blue-600 dark:text-blue-400">
                      {paciente.nomeCompleto}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-400 font-semibold block">Idade</span>
                      <p className="font-semibold">{calcularIdade(paciente.dataNascimento) || "N/A"}</p>
                    </div>

                    <div>
                      <span className="text-gray-400 font-semibold block">CPF</span>
                      <p className="font-semibold">{paciente.cpf}</p>
                    </div>
                  </div>

                  {paciente.telefone && (
                    <div>
                      <span className="text-gray-400 font-semibold block flex items-center gap-1">
                        <Phone size={11} /> Telefone
                      </span>
                      <p className="font-semibold">{paciente.telefone}</p>
                    </div>
                  )}

                  {paciente.observacoes && (
                    <div>
                      <span className="text-gray-400 font-semibold block flex items-center gap-1 mb-1">
                        <FileText size={11} /> Observações Clínicas
                      </span>
                      <p className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-[11px] italic line-clamp-4">
                        &quot;{paciente.observacoes}&quot;
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-gray-400 font-semibold block">Nome do Paciente</span>
                    <p className="font-bold text-sm text-blue-600 dark:text-blue-400">
                      {card.title}
                    </p>
                  </div>
                  <p className="text-gray-400 text-[11px]">
                    Cadastre a ficha completa deste paciente na aba Registro de Pacientes.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-700 text-xs text-gray-400 flex items-center gap-1.5">
              <CalendarIcon size={14} className="text-blue-500" />
              <span>Registrado em: {card.date || "Data não informada"}</span>
            </div>
          </div>

          {/* PARTE 2 (Lado Direito): Leitura Completa do Relatório */}
          <div className="md:col-span-8 flex flex-col justify-between min-h-[360px]">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image
                  src={isDark ? "/images/icons/IconeDiario.svg" : "/images/icons/IconeDiarioDark.svg"}
                  alt="Ícone Relatório"
                  width={26}
                  height={26}
                />
                <h2 className="text-lg sm:text-xl font-bold">Relatório de Consulta Registrado</h2>
              </div>

              {/* Box de Exibição do Texto */}
              <div className="mb-4">
                <span className="block text-xs font-semibold text-gray-400 mb-1.5">
                  Anotações Clínicas & Conduta Terapêutica
                </span>
                <div
                  className={`w-full max-h-[260px] overflow-y-auto scrollbar-hide rounded-xl p-4 text-sm leading-relaxed border ${
                    isDark
                      ? "bg-slate-800/90 border-slate-700 text-gray-100"
                      : "bg-slate-50 border-gray-200 text-gray-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{card.description}</p>
                </div>
              </div>

              {/* Análise da Athena se existir */}
              {card.analysis?.athena && (
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-xs space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    🧠 Parecer Assistido da Athena
                  </span>
                  <p className="italic">{card.analysis.athena}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer"
              >
                Fechar Leitura
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
