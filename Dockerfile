# ============================================================
# STAGE 1: Build the React app
# ============================================================
FROM node:22-alpine AS build

WORKDIR /app

# Enable pnpm (comes bundled with Node 22 via corepack)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files first (for dependency caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies. --frozen-lockfile ensures we use
# exact versions from pnpm-lock.yaml (reproducible builds)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build argument: the API URL that the frontend should call.
# Vite bakes env variables into the JS at BUILD TIME, so we
# pass it here (not at runtime).
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL

# Build the app → produces dist/ folder with static files
RUN pnpm build

# ============================================================
# STAGE 2: Serve with Nginx
# ============================================================
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy our built files into nginx's serving directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom nginx config (handles SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx listens on port 80
EXPOSE 80

# Start nginx in foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]
