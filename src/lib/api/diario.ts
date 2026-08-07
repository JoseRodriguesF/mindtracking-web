// src/lib/api/diario.ts
import api from "./axios";

export const createDiario = async (payload: { titulo: string; texto: string }) => {
  const { data } = await api.post("/api/diario", payload);
  return data;
};

export const getDiarios = async () => {
  const { data } = await api.get("/api/diario");
  return data;
};

export const getDiarioById = async (id: string) => {
  const { data } = await api.get(`/api/diario/${id}`);
  return data;
};

// Aliases para Relatórios de Consultas
export const createRelatorio = createDiario;
export const getRelatorios = getDiarios;
export const getRelatorioById = getDiarioById;
