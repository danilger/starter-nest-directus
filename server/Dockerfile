# --- Стадия сборки ---
FROM node:20-alpine AS build

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci

# Копируем конфигурационные файлы и исходный код
COPY tsconfig*.json nest-cli.json ./
COPY src ./src

# Собираем проект
RUN npm run build
    

# --- Стадия запуска ---
FROM node:20-alpine AS production

WORKDIR /app

# Копируем package.json и устанавливаем production зависимости
COPY package*.json ./
RUN npm ci --omit=dev

# Копируем только собранный код
COPY --from=build /app/dist ./dist

CMD ["node", "dist/main.js"]