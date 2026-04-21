# ─── Stage 1: Build ───────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps (cached layer)
COPY package.json package-lock.json* ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# ─── Stage 2: Serve with nginx ────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config (SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
