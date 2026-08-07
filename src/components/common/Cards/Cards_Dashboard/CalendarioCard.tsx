"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import BaseCard from "./BaseCard";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Pencil,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Video,
} from "lucide-react";

interface Consulta {
  id: string;
  paciente: string;
  data: string; // YYYY-MM-DD
  horario: string; // HH:mm
  observacao?: string;
  status: "agendada" | "cancelada";
}

interface Paciente {
  id: string;
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
}

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DEFAULT_CONSULTAS: Consulta[] = [
  {
    id: "1",
    paciente: "Ana Paula Silva",
    data: getTodayString(),
    horario: "09:00",
    observacao: "Consulta de acompanhamento quinzenal",
    status: "agendada",
  },
  {
    id: "2",
    paciente: "Carlos Eduardo Souza",
    data: getTodayString(),
    horario: "14:30",
    observacao: "Avaliação inicial e anamnese",
    status: "agendada",
  },
  {
    id: "3",
    paciente: "Mariana Oliveira",
    data: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    horario: "11:00",
    observacao: "Sessão de TCC",
    status: "agendada",
  },
];

export default function CalendarioCard() {
  const { theme } = useTheme();
  const router = useRouter();
  const isDark = theme === "dark";

  const todayStr = getTodayString();

  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pacientesCadastrados, setPacientesCadastrados] = useState<Paciente[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [viewMode, setViewMode] = useState<"dia" | "semana" | "mes">("dia");
  
  // Mes navegável
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());

  // Modal Agendamento / Edição
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingConsulta, setEditingConsulta] = useState<Consulta | null>(null);

  // Form inputs
  const [novoPaciente, setNovoPaciente] = useState("");
  const [novaData, setNovaData] = useState(todayStr);
  const [novoHorario, setNovoHorario] = useState("10:00");
  const [novaObs, setNovaObs] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Carregar consultas
      const stored = localStorage.getItem("mt_consultas_agendadas");
      if (stored) {
        try {
          setConsultas(JSON.parse(stored));
        } catch {
          setConsultas(DEFAULT_CONSULTAS);
        }
      } else {
        setConsultas(DEFAULT_CONSULTAS);
        localStorage.setItem(
          "mt_consultas_agendadas",
          JSON.stringify(DEFAULT_CONSULTAS)
        );
      }

      // 2. Carregar pacientes cadastrados
      const storedPacientes = localStorage.getItem("mt_pacientes");
      if (storedPacientes) {
        try {
          setPacientesCadastrados(JSON.parse(storedPacientes));
        } catch {
          setPacientesCadastrados([]);
        }
      }
    }
  }, []);

  const saveConsultas = (newList: Consulta[]) => {
    setConsultas(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem("mt_consultas_agendadas", JSON.stringify(newList));
    }
  };

  const openNewModal = (dateStr?: string) => {
    const targetDate = dateStr && dateStr >= todayStr ? dateStr : todayStr;
    setEditingConsulta(null);
    setNovaData(targetDate);
    setNovoHorario("10:00");
    setNovaObs("");
    setFormError(null);

    // Recarregar pacientes cadastrados atualizados
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mt_pacientes");
      if (stored) {
        try {
          const list: Paciente[] = JSON.parse(stored);
          setPacientesCadastrados(list);
          if (list.length > 0) {
            setNovoPaciente(list[0].nomeCompleto);
          } else {
            setNovoPaciente("");
          }
        } catch {
          setPacientesCadastrados([]);
        }
      }
    }

    setShowModal(true);
  };

  const openEditModal = (c: Consulta) => {
    setEditingConsulta(c);
    setNovoPaciente(c.paciente);
    setNovaData(c.data);
    setNovoHorario(c.horario);
    setNovaObs(c.observacao || "");
    setFormError(null);
    setShowModal(true);
  };

  const handleSaveConsulta = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedNome = novoPaciente.trim();
    if (!trimmedNome) {
      setFormError("Selecione um paciente cadastrado.");
      return;
    }

    if (novaData < todayStr) {
      setFormError("Não é possível agendar consultas para datas passadas.");
      return;
    }

    if (editingConsulta) {
      // Edição
      const updated = consultas.map((c) =>
        c.id === editingConsulta.id
          ? {
              ...c,
              paciente: trimmedNome,
              data: novaData,
              horario: novoHorario,
              observacao: novaObs.trim(),
            }
          : c
      );
      saveConsultas(updated);
    } else {
      // Novo Agendamento
      const novaConsulta: Consulta = {
        id: Date.now().toString(),
        paciente: trimmedNome,
        data: novaData,
        horario: novoHorario,
        observacao: novaObs.trim(),
        status: "agendada",
      };

      const updated = [...consultas, novaConsulta].sort((a, b) =>
        `${a.data} ${a.horario}`.localeCompare(`${b.data} ${b.horario}`)
      );
      saveConsultas(updated);
    }

    setShowModal(false);
  };

  const handleToggleCancel = (id: string) => {
    const updated = consultas.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          status: c.status === "cancelada" ? ("agendada" as const) : ("cancelada" as const),
        };
      }
      return c;
    });
    saveConsultas(updated);
  };

  // Função para iniciar a consulta e enviar convite do Google Meet para o paciente
  const handleStartSession = (c: Consulta) => {
    // 1. Abrir sala do Google Meet
    window.open("https://meet.google.com/new", "_blank", "noopener,noreferrer");

    // 2. Buscar dados do paciente cadastrado para envio do convite
    let pacienteObj: Paciente | undefined;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mt_pacientes");
      if (stored) {
        try {
          const list: Paciente[] = JSON.parse(stored);
          pacienteObj = list.find(
            (p) => p.nomeCompleto.toLowerCase().trim() === c.paciente.toLowerCase().trim()
          );
        } catch (e) {
          console.error("Erro ao ler pacientes:", e);
        }
      }
    }

    // 3. Enviar convite automático via WhatsApp se houver telefone cadastrado
    if (pacienteObj?.telefone) {
      const cleanPhone = pacienteObj.telefone.replace(/\D/g, "");
      if (cleanPhone) {
        const fullPhone = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
        const msg = `Olá ${pacienteObj.nomeCompleto}, sua consulta foi iniciada! Acesse a sala de atendimento no Google Meet pelo link: https://meet.google.com/new`;
        const waUrl = `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(msg)}`;

        setTimeout(() => {
          window.open(waUrl, "_blank", "noopener,noreferrer");
        }, 400);
      }
    }
  };

  // Helper de dias da semana atual
  const getWeekDays = () => {
    const curr = new Date(selectedDate + "T12:00:00");
    const first = curr.getDate() - curr.getDay(); // Domingo
    const week = [];
    for (let i = 0; i < 7; i++) {
      const next = new Date(curr);
      next.setDate(first + i);
      const iso = next.toISOString().split("T")[0];
      week.push({
        iso,
        dayNum: next.getDate(),
        dayName: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][next.getDay()],
        isToday: iso === todayStr,
      });
    }
    return week;
  };

  // Helper da matriz do mês
  const getMonthGrid = () => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDay.getDay(); // 0 = Domingo
    const totalDays = lastDay.getDate();

    const grid = [];
    // Dias em branco antes do inicio do mes
    for (let i = 0; i < startingDayOfWeek; i++) {
      grid.push(null);
    }
    // Dias do mes
    for (let d = 1; d <= totalDays; d++) {
      const mStr = String(month + 1).padStart(2, "0");
      const dStr = String(d).padStart(2, "0");
      const iso = `${year}-${mStr}-${dStr}`;
      grid.push({
        dayNum: d,
        iso,
        isToday: iso === todayStr,
        isPast: iso < todayStr,
        consultasCount: consultas.filter((c) => c.data === iso && c.status === "agendada").length,
      });
    }
    return grid;
  };

  const weekDays = getWeekDays();
  const consultasDoDia = consultas.filter((c) => c.data === selectedDate);
  const consultasDaSemana = consultas.filter((c) =>
    weekDays.some((w) => w.iso === c.data)
  );

  const prevMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)
    );
  };

  const nomeMesAno = currentMonthDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <BaseCard className="min-h-[420px] lg:h-full lg:min-h-0 w-full flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
      {/* Header do Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2.5">
          <div>
            <h2
              className={`text-lg sm:text-xl font-bold ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              Calendário de Consultas
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Gerencie os agendamentos dos pacientes cadastrados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode("dia")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                viewMode === "dia"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
              }`}
            >
              Dia
            </button>
            <button
              onClick={() => setViewMode("semana")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                viewMode === "semana"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode("mes")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                viewMode === "mes"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
              }`}
            >
              Mês
            </button>
          </div>

          <button
            onClick={() => openNewModal(selectedDate)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            <span>Agendar</span>
          </button>
        </div>
      </div>

      {/* Navegação da Semana */}
      {viewMode !== "mes" && (
        <div className="my-3 flex items-center justify-between gap-1 overflow-x-auto scrollbar-hide py-1">
          {weekDays.map((day) => {
            const isSelected = day.iso === selectedDate;
            return (
              <button
                key={day.iso}
                onClick={() => setSelectedDate(day.iso)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[44px] sm:min-w-[54px] transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : day.isToday
                    ? "border border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-slate-800"
                    : isDark
                    ? "bg-slate-800/60 text-gray-300 hover:bg-slate-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="text-[10px] font-medium uppercase">
                  {day.dayName}
                </span>
                <span className="text-sm font-bold mt-0.5">{day.dayNum}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="flex-1 min-h-[220px] overflow-y-auto scrollbar-hide pr-1 space-y-2.5">
        {viewMode === "dia" && (
          consultasDoDia.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-6 text-gray-400">
              <Clock size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">
                Nenhuma consulta agendada para este dia ({selectedDate.split("-").reverse().join("/")}).
              </p>
              {selectedDate >= todayStr && (
                <button
                  onClick={() => openNewModal(selectedDate)}
                  className="mt-2 text-xs text-blue-500 underline font-semibold cursor-pointer"
                >
                  Clique aqui para agendar
                </button>
              )}
            </div>
          ) : (
            consultasDoDia.map((c) => (
              <div
                key={c.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                  c.status === "cancelada"
                    ? isDark
                      ? "bg-slate-800/40 border-slate-700 opacity-60"
                      : "bg-gray-100 border-gray-200 opacity-60"
                    : isDark
                    ? "bg-slate-800/80 border-slate-700 text-white"
                    : "bg-slate-50 border-gray-200 text-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                      c.status === "cancelada"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    <Clock size={12} />
                    {c.horario}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold flex items-center gap-1.5 ${c.status === "cancelada" ? "line-through" : ""}`}>
                      <User size={14} className="text-gray-400" />
                      {c.paciente}
                    </h4>
                    {c.observacao && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {c.observacao}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {c.status !== "cancelada" && (
                    <button
                      onClick={() => handleStartSession(c)}
                      title="Iniciar Consulta e Enviar Convite"
                      className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white transition-all cursor-pointer shadow-sm shrink-0"
                    >
                      <Video size={13} />
                      <span className="hidden sm:inline">Iniciar Consulta</span>
                    </button>
                  )}

                  <button
                    onClick={() => openEditModal(c)}
                    title="Editar Horário/Consulta"
                    className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    onClick={() => handleToggleCancel(c.id)}
                    title={c.status === "cancelada" ? "Reativar Consulta" : "Desmarcar Consulta"}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                      c.status === "cancelada"
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-200"
                        : "bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400"
                    }`}
                  >
                    {c.status === "cancelada" ? (
                      <>
                        <CheckCircle2 size={13} /> Reativar
                      </>
                    ) : (
                      <>
                        <XCircle size={13} /> Desmarcar
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )
        )}

        {viewMode === "semana" && (
          consultasDaSemana.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-6 text-gray-400">
              <CalendarIcon size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">
                Nenhuma consulta agendada para esta semana.
              </p>
            </div>
          ) : (
            consultasDaSemana.map((c) => (
              <div
                key={c.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                  c.status === "cancelada"
                    ? isDark
                      ? "bg-slate-800/40 border-slate-700 opacity-60"
                      : "bg-gray-100 border-gray-200 opacity-60"
                    : isDark
                    ? "bg-slate-800/80 border-slate-700 text-white"
                    : "bg-slate-50 border-gray-200 text-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 rounded-lg bg-purple-600/10 text-purple-600 dark:text-purple-400 text-xs font-bold">
                    {c.data.split("-").reverse().slice(0, 2).join("/")} às {c.horario}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${c.status === "cancelada" ? "line-through" : ""}`}>{c.paciente}</h4>
                    {c.observacao && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {c.observacao}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {c.status !== "cancelada" && (
                    <button
                      onClick={() => handleStartSession(c)}
                      title="Iniciar Consulta e Enviar Convite"
                      className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white transition-all cursor-pointer shadow-sm shrink-0"
                    >
                      <Video size={13} />
                      <span className="hidden sm:inline">Iniciar Consulta</span>
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(c)}
                    title="Editar Horário/Consulta"
                    className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleToggleCancel(c.id)}
                    title={c.status === "cancelada" ? "Reativar Consulta" : "Desmarcar Consulta"}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      c.status === "cancelada"
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-200"
                        : "bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400"
                    }`}
                  >
                    {c.status === "cancelada" ? "Reativar" : "Desmarcar"}
                  </button>
                </div>
              </div>
            ))
          )
        )}

        {/* Visão Mensal */}
        {viewMode === "mes" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-sm font-bold capitalize">
                {nomeMesAno}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={prevMonth}
                  className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 text-center text-[11px] font-bold text-gray-400 uppercase">
              <span>Dom</span>
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {getMonthGrid().map((cell, idx) => {
                if (!cell) {
                  return <div key={idx} className="h-10" />;
                }
                const isSelected = cell.iso === selectedDate;
                return (
                  <button
                    key={cell.iso}
                    onClick={() => {
                      setSelectedDate(cell.iso);
                      if (!cell.isPast) {
                        openNewModal(cell.iso);
                      } else {
                        setViewMode("dia");
                      }
                    }}
                    className={`h-10 rounded-xl relative flex flex-col items-center justify-center transition-all cursor-pointer text-xs font-semibold ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-md font-bold"
                        : cell.isToday
                        ? "border-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-slate-800"
                        : cell.isPast
                        ? "text-gray-400 dark:text-gray-600 bg-gray-100/50 dark:bg-slate-800/30 cursor-not-allowed"
                        : isDark
                        ? "bg-slate-800/70 text-gray-200 hover:bg-slate-700"
                        : "bg-slate-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    <span>{cell.dayNum}</span>
                    {cell.consultasCount > 0 && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Agendamento e Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-[440px] rounded-2xl p-5 shadow-2xl relative ${
              isDark ? "bg-slate-900 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <CalendarIcon size={18} className="text-blue-500" />
                {editingConsulta ? "Editar Consulta" : "Agendar Consulta"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mb-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            {pacientesCadastrados.length === 0 && !editingConsulta ? (
              <div className="py-4 text-center space-y-3">
                <p className="text-xs text-amber-500 font-semibold bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                  Nenhum paciente cadastrado. Só é possível agendar consultas com pacientes registrados na plataforma.
                </p>
                <button
                  onClick={() => {
                    setShowModal(false);
                    router.push("/pacientes");
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Ir para Registro de Pacientes
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveConsulta} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    Selecione o Paciente Cadastrado *
                  </label>
                  <select
                    required
                    value={novoPaciente}
                    onChange={(e) => setNovoPaciente(e.target.value)}
                    className={`w-full rounded-lg p-2.5 text-sm border border-blue-500 outline-none ${
                      isDark
                        ? "bg-slate-800 text-white"
                        : "bg-gray-50 text-gray-900"
                    }`}
                  >
                    {pacientesCadastrados.length > 0 ? (
                      pacientesCadastrados.map((p) => (
                        <option key={p.id} value={p.nomeCompleto}>
                          {p.nomeCompleto} {p.telefone ? `(${p.telefone})` : ""}
                        </option>
                      ))
                    ) : (
                      <option value={novoPaciente}>{novoPaciente}</option>
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                      Data *
                    </label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={novaData}
                      onChange={(e) => {
                        setNovaData(e.target.value);
                        if (e.target.value < todayStr) {
                          setFormError("Não é possível escolher datas passadas.");
                        } else {
                          setFormError(null);
                        }
                      }}
                      className={`w-full rounded-lg p-2.5 text-sm border border-blue-500 outline-none ${
                        isDark
                          ? "bg-slate-800 text-white"
                          : "bg-gray-50 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                      Horário *
                    </label>
                    <input
                      type="time"
                      required
                      value={novoHorario}
                      onChange={(e) => setNovoHorario(e.target.value)}
                      className={`w-full rounded-lg p-2.5 text-sm border border-blue-500 outline-none ${
                        isDark
                          ? "bg-slate-800 text-white"
                          : "bg-gray-50 text-gray-900"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    Observações / Tipo de Consulta
                  </label>
                  <input
                    type="text"
                    value={novaObs}
                    onChange={(e) => setNovaObs(e.target.value)}
                    placeholder="Ex: Primeira consulta TCC"
                    className={`w-full rounded-lg p-2.5 text-sm border border-blue-500 outline-none ${
                      isDark
                        ? "bg-slate-800 text-white"
                        : "bg-gray-50 text-gray-900"
                    }`}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-gray-400 hover:bg-gray-500 text-white transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                  >
                    {editingConsulta ? "Salvar Alterações" : "Confirmar Agendamento"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </BaseCard>
  );
}
