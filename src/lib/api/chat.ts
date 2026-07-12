// src/lib/api/chat.ts
import api from "./axios";

export const sendChat = async (payload: { message: string; context?: unknown }) => {
  // endpoint da Athena; body exato: {"message": "..."}
  // garante que o JWT seja enviado no header Authorization
  let token: string | null = null;
  if (typeof window !== "undefined") {
    try {
      token = sessionStorage.getItem("mt_token");
    } catch {}
  }

  if (!token) {
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  const { data } = await api.post("/api/chat", { message: payload.message }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data;
};
