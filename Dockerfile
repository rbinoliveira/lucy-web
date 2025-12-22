FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY . .

ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_FRONTEND_NAME
ARG NEXT_PUBLIC_BACKEND_NAME

ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_PUBLIC_FRONTEND_NAME=${NEXT_PUBLIC_FRONTEND_NAME}
ENV NEXT_PUBLIC_BACKEND_NAME=${NEXT_PUBLIC_BACKEND_NAME}

RUN npm install -g pnpm && pnpm run build:web

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

CMD node apps/web/server.js