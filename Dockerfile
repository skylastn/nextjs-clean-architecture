# ---------- deps ----------
FROM oven/bun:1.4.2-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---------- builder ----------
FROM oven/bun:1.4.2-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Build-time args (di-inject dari docker-compose)
ARG APP_ENV
ARG NEXT_PUBLIC_ENDPOINT_URL

# Set jadi ENV supaya kebaca saat `bun run build`
ENV APP_ENV=$APP_ENV
ENV NEXT_PUBLIC_ENDPOINT_URL=$NEXT_PUBLIC_ENDPOINT_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run build


# ---------- runner ----------
FROM oven/bun:1.4.2-alpine AS runner
WORKDIR /app

# Runtime args (opsional, tapi kita set lagi biar aman)
ARG APP_ENV
ARG NEXT_PUBLIC_ENDPOINT_URL
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ENV APP_ENV=$APP_ENV
ENV NEXT_PUBLIC_ENDPOINT_URL=$NEXT_PUBLIC_ENDPOINT_URL

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["bun", "server.js"]
