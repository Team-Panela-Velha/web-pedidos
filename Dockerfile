FROM node:20-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .

# Opcional: endereco da API visto pelo navegador. Vazio = usa o VITE_API_URL do .env.
ARG VITE_API_URL
RUN if [ -z "$VITE_API_URL" ]; then unset VITE_API_URL; fi && pnpm build

FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]