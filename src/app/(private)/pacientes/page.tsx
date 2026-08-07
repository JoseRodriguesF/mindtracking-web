"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { getDiarios } from "@/lib/api/diario";
import {
  UserPlus,
  Search,
  Pencil,
  Trash2,
  Calendar,
  FileText,
  UserCheck,
  X,
  AlertCircle,
  Phone,
} from "lucide-react";

export interface Paciente {
  id: string;
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  dataNascimento: string; // YYYY-MM-DD
  observacoes: string;
  createdAt: string;
}

interface Consulta {
  id: string;
  paciente: string;
  data: string; // YYYY-MM-DD
  horario: string; // HH:mm
  status: "agendada" | "cancelada";
}

interface DiarioEntrada {
  id?: string | number;
  titulo?: string;
  title?: string;
}

const DEFAULT_PACIENTES: Paciente[] = [
  {
    id: "1",
    nomeCompleto: "Ana Paula Silva",
    cpf: "123.456.789-00",
    telefone: "(11) 98765-4321",
    dataNascimento: "1992-05-14",
    observacoes: "Paciente em acompanhamento quinzenal.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    nomeCompleto: "Carlos Eduardo Souza",
    cpf: "987.654.321-11",
    telefone: "(21) 97654-3210",
    dataNascimento: "1985-11-20",
    observacoes: "Avaliação inicial e anamnese.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    nomeCompleto: "Mariana Oliveira",
    cpf: "456.789.123-22",
    telefone: "(31) 99876-5432",
    dataNascimento: "1998-03-08",
    observacoes: "Estratégias de regulação emocional.",
    createdAt: new Date().toISOString(),
  },
];

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper para máscara CPF
const formatCPF = (val: string) => {
  const digits = val.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

// Helper para máscara Telefone
const formatTelefone = (val: string) => {
  const digits = val.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
};

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

export default function PacientesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [consultasHoje, setConsultasHoje] = useState<Consulta[]>([]);
  const [relatoriosTitulos, setRelatoriosTitulos] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null);

  // Form State
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mt_pacientes");
      if (stored) {
        try {
          setPacientes(JSON.parse(stored));
        } catch {
          setPacientes(DEFAULT_PACIENTES);
        }
      } else {
        setPacientes(DEFAULT_PACIENTES);
        localStorage.setItem("mt_pacientes", JSON.stringify(DEFAULT_PACIENTES));
      }

      // Carregar consultas para checar consulta hoje
      const storedConsultas = localStorage.getItem("mt_consultas_agendadas");
      if (storedConsultas) {
        try {
          const list: Consulta[] = JSON.parse(storedConsultas);
          setConsultasHoje(list.filter((c) => c.status === "agendada"));
        } catch (e) {
          console.error("Erro ao carregar consultas:", e);
        }
      }
    }

    // Carregar diários para checar relatório pendente
    async function loadDiarios() {
      try {
        const resp = await getDiarios();
        const entradas: DiarioEntrada[] = Array.isArray(resp)
          ? resp
          : resp?.entradas || resp?.data || [];
        const titulos = entradas.map(
          (e) => (e.titulo || e.title || "").toLowerCase().trim()
        );
        setRelatoriosTitulos(titulos);
      } catch (err) {
        console.error("Erro ao carregar diários:", err);
      }
    }
    loadDiarios();
  }, []);

  const savePacientes = (list: Paciente[]) => {
    setPacientes(list);
    if (typeof window !== "undefined") {
      localStorage.setItem("mt_pacientes", JSON.stringify(list));
    }
  };

  const handleOpenNewModal = () => {
    setEditingPaciente(null);
    setNomeCompleto("");
    setCpf("");
    setTelefone("");
    setDataNascimento("");
    setObservacoes("");
    setFormError(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (p: Paciente) => {
    setEditingPaciente(p);
    setNomeCompleto(p.nomeCompleto);
    setCpf(p.cpf);
    setTelefone(p.telefone || "");
    setDataNascimento(p.dataNascimento);
    setObservacoes(p.observacoes || "");
    setFormError(null);
    setShowModal(true);
  };

  const handleSavePaciente = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedNome = nomeCompleto.trim();
    if (!trimmedNome) {
      setFormError("O nome completo é obrigatório.");
      return;
    }

    const cleanCPF = cpf.replace(/\D/g, "");
    if (cleanCPF.length !== 11) {
      setFormError("Informe um CPF válido com 11 dígitos.");
      return;
    }

    const cleanTel = telefone.replace(/\D/g, "");
    if (cleanTel.length < 10) {
      setFormError("Informe um número de telefone com DDD válido.");
      return;
    }

    if (!dataNascimento) {
      setFormError("A data de nascimento é obrigatória.");
      return;
    }

    if (editingPaciente) {
      const updated = pacientes.map((p) =>
        p.id === editingPaciente.id
          ? {
              ...p,
              nomeCompleto: trimmedNome,
              cpf: formatCPF(cleanCPF),
              telefone: formatTelefone(cleanTel),
              dataNascimento,
              observacoes: observacoes.trim(),
            }
          : p
      );
      savePacientes(updated);
    } else {
      const novo: Paciente = {
        id: Date.now().toString(),
        nomeCompleto: trimmedNome,
        cpf: formatCPF(cleanCPF),
        telefone: formatTelefone(cleanTel),
        dataNascimento,
        observacoes: observacoes.trim(),
        createdAt: new Date().toISOString(),
      };
      savePacientes([novo, ...pacientes]);
    }

    setShowModal(false);
  };

  const handleDeletePaciente = (id: string) => {
    if (confirm("Tem certeza que deseja remover este paciente?")) {
      const updated = pacientes.filter((p) => p.id !== id);
      savePacientes(updated);
    }
  };

  const todayStr = getTodayString();

  const filteredPacientes = pacientes.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      p.nomeCompleto.toLowerCase().includes(q) ||
      p.cpf.includes(q) ||
      (p.telefone && p.telefone.includes(q)) ||
      (p.observacoes && p.observacoes.toLowerCase().includes(q))
    );
  });

  return (
    <div className="h-screen min-h-0 flex flex-col">
      <div className="flex flex-col min-h-0 h-full p-4 sm:p-6 md:p-10 lg:ml-37.5 overflow-hidden">
        {/* Header da Página */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 shrink-0">
          <div>
            <h1
              className={`text-xl sm:text-2xl font-bold font-inter ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Registro de Pacientes
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Cadastre e acompanhe o status de consultas e relatórios dos seus pacientes
            </p>
          </div>

          <button
            onClick={handleOpenNewModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <UserPlus size={18} />
            <span>Cadastrar Paciente</span>
          </button>
        </div>

        {/* Container Principal */}
        <div
          className={`flex-1 min-h-0 flex flex-col rounded-2xl p-4 sm:p-6 ${
            isDark
              ? "border-2 border-blue-600 bg-slate-900"
              : "bg-white border-2 border-slate-200 shadow-md"
          } transition-all duration-300`}
        >
          {/* Barra de Pesquisa */}
          <div className="mb-5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div
              className={`relative w-full sm:w-80 flex items-center rounded-xl border px-3 py-2 ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-slate-50 border-gray-200 text-gray-900"
              }`}
            >
              <Search size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar paciente por nome, CPF ou telefone..."
                className="w-full bg-transparent text-xs sm:text-sm outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total de pacientes:{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {filteredPacientes.length}
              </span>
            </div>
          </div>

          {/* Lista de Pacientes */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide pr-1">
            {filteredPacientes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <UserCheck size={40} className="text-gray-400 mb-3 opacity-50" />
                <p
                  className={`text-base font-semibold ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Nenhum paciente encontrado.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                  {searchQuery
                    ? "Tente buscar com outro termo."
                    : "Cadastre seu primeiro paciente usando o botão acima."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPacientes.map((p) => {
                  const nomeLower = p.nomeCompleto.toLowerCase().trim();

                  // Checa se tem consulta hoje
                  const consultaHoje = consultasHoje.find(
                    (c) =>
                      c.paciente.toLowerCase().trim() === nomeLower &&
                      c.data === todayStr
                  );

                  // Checa se tem relatório pendente (consulta agendada ativa sem relatório)
                  const temRelatorioPendente = consultasHoje.some(
                    (c) =>
                      c.paciente.toLowerCase().trim() === nomeLower &&
                      !relatoriosTitulos.some((t) => t.includes(nomeLower))
                  );

                  return (
                    <div
                      key={p.id}
                      className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-200 ${
                        isDark
                          ? "bg-slate-800/90 border-slate-700 text-gray-200 hover:border-blue-500"
                          : "bg-slate-50 border-gray-200 text-gray-800 hover:border-blue-400 shadow-sm"
                      }`}
                    >
                      <div>
                        {/* Nome do Paciente & Idade */}
                        <div className="mb-4">
                          <h3
                            className={`font-bold text-lg leading-tight ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {p.nomeCompleto}
                          </h3>
                          <span className="text-xs font-medium text-gray-400 dark:text-gray-400 mt-0.5 block">
                            {calcularIdade(p.dataNascimento) || "Idade não informada"}
                          </span>
                        </div>

                        {/* Status: Consulta agendada hoje & Relatório pendente */}
                        <div className="space-y-2 mb-4">
                          {/* Consulta Hoje */}
                          <div className="flex items-center">
                            {consultaHoje ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                                <Calendar size={14} />
                                <span>Consulta hoje às {consultaHoje.horario}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-slate-600">
                                <Calendar size={14} />
                                <span>Sem consulta hoje</span>
                              </span>
                            )}
                          </div>

                          {/* Relatório Pendente */}
                          <div className="flex items-center">
                            {temRelatorioPendente ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                                <FileText size={14} />
                                <span>Relatório pendente</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
                                <FileText size={14} />
                                <span>Relatórios em dia</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-slate-700 mt-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          title="Editar Paciente"
                          className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <Pencil size={13} />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDeletePaciente(p.id)}
                          title="Excluir Paciente"
                          className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 size={13} />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Cadastro / Edição de Paciente */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-[480px] rounded-2xl p-6 shadow-2xl relative ${
              isDark ? "bg-slate-900 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 dark:border-slate-800">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <UserPlus size={20} className="text-blue-500" />
                {editingPaciente ? "Editar Paciente" : "Novo Cadastro de Paciente"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSavePaciente} className="space-y-3.5">
              {/* Nome Completo */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  placeholder="Ex: Maria das Dores Silva"
                  className={`w-full rounded-xl p-3 text-sm border outline-none transition-all ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                  }`}
                />
              </div>

              {/* Telefone & CPF */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                    <Phone size={12} />
                    <span>Telefone *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={15}
                    value={telefone}
                    onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                    placeholder="(11) 98765-4321"
                    className={`w-full rounded-xl p-3 text-sm border outline-none transition-all ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    CPF *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={14}
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    className={`w-full rounded-xl p-3 text-sm border outline-none transition-all ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              {/* Data de Nascimento */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Data de Nascimento *
                </label>
                <input
                  type="date"
                  required
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className={`w-full rounded-xl p-3 text-sm border outline-none transition-all ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                  }`}
                />
              </div>

              {/* Observações */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Observações Clínicas
                </label>
                <textarea
                  rows={2}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Anotações sobre históricos, preferências ou encaminhamentos..."
                  className={`w-full rounded-xl p-3 text-sm border outline-none transition-all ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                  }`}
                />
              </div>

              {/* Botões do Modal */}
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gray-400 hover:bg-gray-500 text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md cursor-pointer"
                >
                  {editingPaciente ? "Salvar Alterações" : "Cadastrar Paciente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
