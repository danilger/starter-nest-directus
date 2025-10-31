FROM node:20-alpine AS build
WORKDIR /app

# Копируем .env в корень /app
COPY .env ./

# Создаем структуру frontend/
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci

# Копируем остальной код frontend
WORKDIR /app
COPY frontend/ ./frontend/

# Собираем проект из /app/frontend
WORKDIR /app/frontend
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html