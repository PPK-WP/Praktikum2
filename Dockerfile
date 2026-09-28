FROM node:22-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Prisma's query engine needs OpenSSL, which the slim image does not include.
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate && npm run build


FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

# node_modules is not pruned: the prisma CLI, @prisma/client and tsx (for the seed) are devDependencies.
COPY --from=builder --chown=node:node /app/package.json /app/next.config.ts ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/prisma ./prisma

USER node
EXPOSE 3000

# Apply pending migrations (upgrading a database left by the old pg setup), optionally create the demo account, then start the server.
CMD ["sh", "-c", "npm run db:deploy && if [ \"$SEED_DEMO_ACCOUNT\" = \"true\" ]; then npx prisma db seed; fi && npm start"]
