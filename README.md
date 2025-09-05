# NestJS + Directus Starter

Стартовый проект на основе NestJS с админкой на Directus.

## Описание

Этот проект представляет собой полнофункциональный стартер, который включает:

- **NestJS** - основной backend фреймворк
- **Directus** - админка и сервис авторизации
- **PostgreSQL** - база данных

## Структура проекта

- `server/` - NestJS приложение
- `directus/` - Directus CMS и админка

## Возможности

- Готовая настройка NestJS
- Админка на Directus для управления контентом
- Directus как сервис авторизации
- Настроенная база данных PostgreSQL
- Docker контейнеризация

## Быстрый старт

1. Запустите Directus:
   ```bash
   cd directus
   docker-compose up -d
   ```

2. Запустите NestJS сервер:
   ```bash
   cd server
   npm install
   npm run start:dev
   ```
