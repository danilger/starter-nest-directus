# NestJS + Directus Starter

Стартовый проект на основе NestJS с админкой на Directus.

## Описание

Этот проект представляет собой полнофункциональный стартер, который включает:

- **NestJS** - основной backend фреймворк с PostgreSQL в Docker
- **Directus** - админка для управления контентом (подключается к базе NestJS)
- **PostgreSQL** - база данных с volume в git
- **Единая база данных** - NestJS и Directus используют одну БД

## Архитектура

```
starter/
├── server/                    # NestJS Backend + PostgreSQL
│   ├── docker-compose.yml    # PostgreSQL контейнер
│   ├── database/postgres/    # Данные БД (volume в git)
│   └── ...
├── directus/                 # Directus CMS (Админка)
│   ├── docker-compose.yaml  # Directus контейнер
│   └── ...
└── README.md                 # Этот файл
```

## Структура проекта

- `server/` - NestJS приложение + PostgreSQL в Docker
- `directus/` - Directus CMS и админка (подключается к базе Server)

## Возможности

- **Готовая настройка NestJS** с TypeORM и миграциями
- **Админка на Directus** для управления контентом
- **Единая база данных** - NestJS и Directus используют одну PostgreSQL
- **Volume в git** - все данные БД сохраняются в репозитории
- **Docker контейнеризация** - простое развертывание
- **Настройки сохраняются** - цвета, темы, интерфейс в git

## Преимущества архитектуры

- ✅ **Простое развертывание** - клонирование + запуск контейнеров
- ✅ **Настройки сохраняются** - все изменения Directus в git
- ✅ **Единая база данных** - нет дублирования данных
- ✅ **Версионирование** - все изменения отслеживаются
- ✅ **Переносимость** - легко копировать между средами

## Быстрый старт

1. Запустите базу данных PostgreSQL:
   ```bash
   cd server
   docker-compose up -d
   ```

2. Запустите Directus:
   ```bash
   cd directus
   docker-compose up -d
   ```

3. Запустите NestJS сервер:
   ```bash
   cd server
   npm install
   npm run start:dev
   ```

## Доступ к сервисам

- **Directus админка**: http://localhost:8055
- **NestJS API**: http://localhost:5000
- **PostgreSQL**: localhost:5433
