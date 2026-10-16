FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root configurations
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy package manifests
COPY apps/playr/package.json ./apps/playr/
COPY packages/nectar-core/package.json ./packages/nectar-core/
COPY packages/ui/package.json ./packages/ui/

RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/playr/node_modules ./apps/playr/node_modules
COPY --from=deps /app/packages/nectar-core/node_modules ./packages/nectar-core/node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules
COPY . .

# Build arguments for Next.js compile-time static inlining
ARG NEXT_PUBLIC_SUPABASE_URL=https://sayxtpglwjiinnrftifq.supabase.co
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNheXh0cGdsd2ppaW5ucmZ0aWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyODQxMzksImV4cCI6MjA5Mzg2MDEzOX0.NiT5r6z4HABTfP7LXYihnkic8xSLqldEoJ6KK4HLDVU
ARG NEXT_PUBLIC_SITE_URL=https://playr.in
ARG NEXT_PUBLIC_BRAND_ID=playr

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_BRAND_ID=$NEXT_PUBLIC_BRAND_ID
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN pnpm --filter playr build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets and standalone build output
COPY --from=builder /app/apps/playr/public ./apps/playr/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/playr/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/playr/.next/static ./apps/playr/.next/static

USER nextjs

EXPOSE 8080

CMD ["node", "apps/playr/server.js"]
