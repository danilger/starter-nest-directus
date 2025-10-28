# 🛠️ Разработка Backend (Dev режим)

## 📋 Настройка окружения для разработки

### 1. Убедитесь, что `.env` существует в корне проекта

```bash
# Из корня проекта (D:\projects\chemical\)
cp .env_example .env
```

### 2. Отредактируйте `.env` для локальной разработки

Для локальной разработки измените:

```env
# База данных (если используете локальный PostgreSQL)
DB_HOST=localhost  # или postgres для Docker
DB_PORT=5432
DB_NAME=app_db
DB_USER=postgres
DB_PASSWORD=postgres

# Backend
NODE_ENV=development
PORT=3000
```

### 3. Запуск базы данных (если нужно)

#### Вариант А: Использовать PostgreSQL из Docker
```bash
# Из корня проекта
docker-compose up -d postgres
```

#### Вариант Б: Использовать локальный PostgreSQL
Установите PostgreSQL локально и создайте БД:
```sql
CREATE DATABASE app_db;
```

### 4. Установка зависимостей

```bash
cd server
npm install
```

### 5. Запуск миграций

```bash
npm run migration:run
```

### 6. Запуск dev сервера

```bash
npm run start:dev
```

Backend будет доступен на http://localhost:3000

## 📝 Важно!

### Где находится `.env` файл?

✅ **Правильно:** `D:\projects\chemical\.env` (корень проекта)  
❌ **НЕ используется:** `D:\projects\chemical\server\.env`

Backend всегда использует `.env` из корня проекта благодаря настройке:

```typescript
ConfigModule.forRoot({
  envFilePath: '../.env', // путь к .env из корня проекта
  isGlobal: true,
})
```

### Структура проекта:

```
D:\projects\chemical\
├── .env                    ← ВСЕ переменные здесь!
├── .env_example            ← Шаблон
├── docker-compose.yml
├── server/
│   ├── src/
│   │   └── app.module.ts   ← читает ../.env
│   └── package.json
└── ...
```

## 🔧 Полезные команды

```bash
# Запуск с watch-режимом
npm run start:dev

# Запуск в debug режиме
npm run start:debug

# Создать миграцию
npm run migration:create

# Сгенерировать миграцию из изменений в entities
npm run migration:generate

# Выполнить миграции
npm run migration:run

# Показать статус миграций
npm run migration:show

# Откатить последнюю миграцию
npm run typeorm migration:revert -d ./database/data-source.ts
```

## 🐛 Решение проблем

### Не подключается к базе данных

1. Проверьте что PostgreSQL запущен:
   ```bash
   docker-compose ps postgres
   # или для локального:
   # pg_isready -U postgres
   ```

2. Проверьте настройки в `.env` файле (в корне проекта!)
   ```env
   DB_HOST=localhost  # или postgres для Docker
   DB_PORT=5432
   ```

3. Убедитесь, что база данных создана:
   ```bash
   docker-compose exec postgres psql -U postgres -c "\l"
   ```

### Переменные окружения не подхватываются

1. Убедитесь, что `.env` находится в корне проекта:
   ```bash
   ls D:\projects\chemical\.env
   ```

2. Перезапустите dev сервер (Ctrl+C и `npm run start:dev`)

3. Проверьте что нет файла `server/.env` который может конфликтовать

