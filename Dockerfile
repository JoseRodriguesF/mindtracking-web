# =========================
# STAGE 1 — BUILDER
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# === VARIÁVEIS PARA BUILD DO NEXT.JS ===
ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Dependências
COPY package*.json ./
RUN npm install

# Código-fonte
COPY . .

# Build Next.js
RUN npm run build

# =========================
# STAGE 2 — RUNNER
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80
ENV HOSTNAME=0.0.0.0

# Copia apenas o necessário para rodar standalone
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 80

CMD ["node", "server.js"]
