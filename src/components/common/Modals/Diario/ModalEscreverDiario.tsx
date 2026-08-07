"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createDiario } from "@/lib/api/diario";
import { sendChat } from "@/lib/api/chat";
import { User, Phone, FileText, UserCheck, AlertCircle } from "lucide-react";

interface Paciente {
  id: string;
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  observacoes: string;
}

interface Consulta {
  id: string;
  paciente: string;
  data: string;
  horario: string;
  observacao?: string;
  status: string;
}

interface DiarioCreated {
  id?: string | number;
  _id?: string | number;
  titulo?: string;
  title?: string;
  texto?: string;
  text?: string;
  descricao?: string;
  data_hora?: string;
  createdAt?: string;
  comentario_athena?: string;
  comentario?: string;
  athena?: string;
  emocao_predominante?: string;
  emocao?: string;
  intensidade_emocional?: string;
  intensidade?: string;
}

interface ModalDiarioProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
  title?: string;
  onTitleChange?: (t: string) => void;
  onSave?: (created?: DiarioCreated) => void;
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

// Helper para formatar data BR
const formatarDataBR = (dataIso: string) => {
  if (!dataIso) return "";
  const parts = dataIso.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dataIso;
};

export default function ModalDiario({
  isOpen,
  onClose,
  value,
  onChange,
  title = "",
  onTitleChange = () => {},
  onSave,
}: ModalDiarioProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const isDark = theme === "dark";

  const [saving, setSaving] = useState(false);
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados de Pacientes e Sessões
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [consultasDoPaciente, setConsultasDoPaciente] = useState<Consulta[]>([]);
  const [selectedSessao, setSelectedSessao] = useState<string>("Sessão de Rotina");

  useEffect(() => {
    if (typeof window !== "undefined" && isOpen) {
      // Carregar pacientes cadastrados
      const storedPacientes = localStorage.getItem("mt_pacientes");
      let listPacientes: Paciente[] = [];
      if (storedPacientes) {
        try {
          listPacientes = JSON.parse(storedPacientes);
          setPacientes(listPacientes);
        } catch (e) {
          console.error("Erro ao carregar pacientes:", e);
        }
      }

      // Tentar selecionar paciente inicial (por title ou primeiro da lista)
      if (listPacientes.length > 0) {
        const found = listPacientes.find(
          (p) => p.nomeCompleto.toLowerCase().trim() === title.toLowerCase().trim()
        );
        const active = found || listPacientes[0];
        setSelectedPaciente(active);
        onTitleChange(active.nomeCompleto);
      }
    }
  }, [isOpen]);

  // Atualiza consultas e sessões quando o paciente selecionado muda
  useEffect(() => {
    if (selectedPaciente && typeof window !== "undefined") {
      const storedConsultas = localStorage.getItem("mt_consultas_agendadas");
      if (storedConsultas) {
        try {
          const allConsultas: Consulta[] = JSON.parse(storedConsultas);
          const doPaciente = allConsultas.filter(
            (c) =>
              c.paciente.toLowerCase().trim() ===
              selectedPaciente.nomeCompleto.toLowerCase().trim()
          );
          setConsultasDoPaciente(doPaciente);
          if (doPaciente.length > 0) {
            setSelectedSessao(`Consulta de ${formatarDataBR(doPaciente[0].data)} às ${doPaciente[0].horario}`);
          } else {
            setSelectedSessao("Sessão de Rotina");
          }
        } catch (e) {
          console.error("Erro ao carregar consultas do paciente:", e);
        }
      }
    }
  }, [selectedPaciente]);

  if (!isOpen) return null;

  const handleSelectPacienteChange = (nome: string) => {
    const found = pacientes.find((p) => p.nomeCompleto === nome);
    if (found) {
      setSelectedPaciente(found);
      onTitleChange(found.nomeCompleto);
      setError(null);
    }
  };

  const handleRefineAI = async () => {
    if (!value || value.trim().length === 0) {
      setError("Escreva algo no relatório antes de estruturar o texto.");
      return;
    }
    setRefining(true);
    setError(null);
    try {
      const prompt = `Você é um assistente especializado em formatação de relatórios clínicos. Sua ÚNICA função é ESTRUTURAR o texto do relatório abaixo para melhorar a leitura, visibilidade e entendimento, sem alterar o sentido do texto original e alterando o mínimo possível as palavras escritas pelo usuário.

Regras Estritas:
1. MANTENHA EXATAMENTE O SENTIDO E CONTEÚDO ORIGINAL. Não invente nem adicione novas informações.
2. Altere o MÍNIMO POSSÍVEL o texto em si, mantendo o tom e vocabulário do autor.
3. Apenas organize em parágrafos e tópicos claros (ex: Queixa Principal, Observações Clínicas, Conduta Terapêutica) para facilitar a leitura.

Texto original:
${value}`;

      const response = await sendChat({ message: prompt });
      if (response && (response.resposta || response.message || response.reply)) {
        const refinedText = response.resposta || response.message || response.reply;
        onChange(refinedText);
      } else {
        const structuredFallback = `📋 RELATÓRIO DE CONSULTA CLÍNICA\n👤 Paciente: ${selectedPaciente?.nomeCompleto || title}\n📌 Sessão: ${selectedSessao}\n\n${value}`;
        onChange(structuredFallback);
      }
    } catch (err) {
      console.warn("Erro ao estruturar texto com IA, mantendo texto original formatado:", err);
      const structuredFallback = `📋 RELATÓRIO DE CONSULTA CLÍNICA\n👤 Paciente: ${selectedPaciente?.nomeCompleto || title}\n📌 Sessão: ${selectedSessao}\n\n${value}`;
      onChange(structuredFallback);
    } finally {
      setRefining(false);
    }
  };

  const handleSave = async () => {
    if (!title || !title.trim()) {
      setError("Selecione um paciente cadastrado para o relatório.");
      return;
    }
    if (!value || !value.trim()) {
      setError("Texto do relatório é obrigatório.");
      return;
    }
    setSaving(true);
    setError(null);

    // Formata o texto final incluindo identificação da sessão
    const textoComSessao = `[Referente a: ${selectedSessao}]\n\n${value}`;

    try {
      const resp = await createDiario({ texto: textoComSessao, titulo: title });
      const created = (resp && (resp.entrada ?? resp)) as DiarioCreated;
      if (resp && typeof resp.success !== "undefined" && !resp.success) {
        throw new Error(resp.message || "Erro ao salvar relatório");
      }
      onSave?.(created);
      onClose();
    } catch (err: unknown) {
      console.error("Erro ao salvar relatório de consulta:", err);
      setError("Não foi possível salvar o relatório de consulta. Por favor, tente novamente.");
    } finally {
      setSaving(false);
    }
  };

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
          <Image
            src={isDark ? "/images/icons/fechar_b.svg" : "/images/icons/fechar.svg"}
            alt="Fechar"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </button>

        {/* Modal dividido em DUAS PARTES (Grid Responsivo 2 Colunas) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
          {/* PARTE 1 (Lado Esquerdo): Ficha do Paciente Selecionado */}
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

              {selectedPaciente ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-gray-400 font-semibold block">Nome Completo</span>
                    <p className="font-bold text-sm text-blue-600 dark:text-blue-400">
                      {selectedPaciente.nomeCompleto}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-400 font-semibold block">Idade</span>
                      <p className="font-semibold">{calcularIdade(selectedPaciente.dataNascimento) || "N/A"}</p>
                    </div>

                    <div>
                      <span className="text-gray-400 font-semibold block">CPF</span>
                      <p className="font-semibold">{selectedPaciente.cpf}</p>
                    </div>
                  </div>

                  {selectedPaciente.telefone && (
                    <div>
                      <span className="text-gray-400 font-semibold block flex items-center gap-1">
                        <Phone size={11} /> Telefone
                      </span>
                      <p className="font-semibold">{selectedPaciente.telefone}</p>
                    </div>
                  )}

                  {selectedPaciente.observacoes && (
                    <div>
                      <span className="text-gray-400 font-semibold block flex items-center gap-1 mb-1">
                        <FileText size={11} /> Observações Clínicas
                      </span>
                      <p className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-[11px] italic line-clamp-4">
                        &quot;{selectedPaciente.observacoes}&quot;
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-gray-400">
                  <User size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Selecione um paciente cadastrado para carregar os dados clínicos.</p>
                </div>
              )}
            </div>

            {pacientes.length === 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-700 text-center">
                <button
                  onClick={() => {
                    onClose();
                    router.push("/pacientes");
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  + Cadastrar Paciente
                </button>
              </div>
            )}
          </div>

          {/* PARTE 2 (Lado Direito): Form de Seleção da Sessão & Escrita do Relatório */}
          <div className="md:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src={isDark ? "/images/icons/IconeDiario.svg" : "/images/icons/IconeDiarioDark.svg"}
                  alt="Ícone Relatório"
                  width={28}
                  height={28}
                />
                <h2 className="text-lg sm:text-xl font-bold">Relatório de Consulta</h2>
              </div>

              {/* 1. Seleção do Paciente */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Selecione o Paciente *
                </label>
                {pacientes.length > 0 ? (
                  <select
                    value={selectedPaciente?.nomeCompleto || ""}
                    onChange={(e) => handleSelectPacienteChange(e.target.value)}
                    className={`w-full rounded-xl p-2.5 text-sm border-2 border-blue-600 outline-none ${
                      isDark ? "bg-slate-800 text-white" : "bg-white text-gray-900"
                    }`}
                  >
                    {pacientes.map((p) => (
                      <option key={p.id} value={p.nomeCompleto}>
                        {p.nomeCompleto} {p.telefone ? `(${p.telefone})` : ""}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 text-xs font-semibold flex items-center justify-between">
                    <span>Nenhum paciente registrado na plataforma.</span>
                    <button
                      onClick={() => {
                        onClose();
                        router.push("/pacientes");
                      }}
                      className="px-2.5 py-1 bg-amber-600 text-white rounded-lg hover:bg-amber-700 cursor-pointer"
                    >
                      Cadastrar
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Seleção da Sessão Referente */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Sessão / Consulta Referente *
                </label>
                <select
                  value={selectedSessao}
                  onChange={(e) => setSelectedSessao(e.target.value)}
                  className={`w-full rounded-xl p-2.5 text-sm border-2 border-blue-600 outline-none ${
                    isDark ? "bg-slate-800 text-white" : "bg-white text-gray-900"
                  }`}
                >
                  {consultasDoPaciente.map((c) => (
                    <option key={c.id} value={`Consulta de ${formatarDataBR(c.data)} às ${c.horario}`}>
                      Consulta de {formatarDataBR(c.data)} às {c.horario} {c.observacao ? `(${c.observacao})` : ""}
                    </option>
                  ))}
                  <option value="Sessão de Rotina">Sessão de Rotina</option>
                  <option value="Sessão 1 (Anamnese)">Sessão 1 (Anamnese)</option>
                  <option value="Sessão 2 (Acompanhamento)">Sessão 2 (Acompanhamento)</option>
                  <option value="Sessão 3 (Avaliação TCC)">Sessão 3 (Avaliação TCC)</option>
                  <option value="Sessão de Encerramento">Sessão de Encerramento</option>
                </select>
              </div>

              {/* 3. Textarea Anotações e Relatório */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-400">
                    Anotações e Relatório da Consulta *
                  </label>

                  {/* Botão Estruturar Texto (Azul, sem ícone) */}
                  <button
                    type="button"
                    onClick={handleRefineAI}
                    disabled={refining || !value.trim()}
                    className="flex items-center justify-center px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {refining ? "Estruturando..." : "Estruturar texto"}
                  </button>
                </div>
                <textarea
                  className={`w-full h-[140px] resize-none rounded-xl p-3 text-sm leading-relaxed outline-none border-2 border-blue-600 ${
                    isDark
                      ? "bg-slate-800 text-white placeholder:text-slate-400"
                      : "bg-white text-gray-900 placeholder:text-slate-400"
                  }`}
                  placeholder="Escreva livremente sobre a consulta, queixas do paciente, observações e conduta..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value);
                    if (error) setError(null);
                  }}
                />
              </div>

              {error && (
                <div className="mt-2 text-xs font-semibold text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gray-400 hover:bg-gray-500 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !selectedPaciente || value.trim().length === 0}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving ? "Salvando..." : "Salvar Relatório"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
