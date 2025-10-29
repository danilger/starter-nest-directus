# 🛠️ Backend - Разработка в Dev режиме

## 📋 Быстрый старт

### 1. Запустите БД и Directus

```bash
# Из корня проекта
docker-compose -f docker-compose.dev.yml up -d
```

Это запустит PostgreSQL и Directus с пробросом портов:
- PostgreSQL → `localhost:5432`
- Directus → `localhost:8055`

### 2. Убедитесь что `.env` настроен для dev

```env
# В корневом .env должно быть:
DB_HOST=localhost
NODE_ENV=development
```

### 3. Установите зависимости

```bash
cd server
npm install
```

### 4. Запустите dev сервер с hot reload

```bash
npm run start:dev
```

Backend запустится на http://localhost:3000

---

## 🌐 Доступные URL в dev режиме

- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/docs
- **Directus Swagger**: http://localhost:3000/directus (если Directus был доступен при старте)
- **OpenAPI JSON**: http://localhost:3000/api/openapi.json

---

## 📝 Работа с переменными окружения

### Где находится `.env` файл?

✅ **Правильно:** `\.env` (корень проекта)  
❌ **НЕ используется:** `\server\.env`

Backend читает `.env` из корня проекта благодаря настройке:

```typescript
// src/app.module.ts
ConfigModule.forRoot({
  envFilePath: '../.env',  // путь к .env из корня проекта
  isGlobal: true,
})
```

### Структура проекта:

```
\
├── .env                    ← Backend читает отсюда!
├── docker-compose.dev.yml  ← Для запуска БД + Directus
├── server/
│   ├── src/
│   │   └── app.module.ts   ← читает ../.env
│   └── package.json
└── ...
```

---

## 🔧 Полезные команды

### Запуск и остановка

```bash
# Dev сервер с watch-режимом
npm run start:dev

# Dev с debug
npm run start:debug

# Production build
npm run build
npm run start:prod
```

### Миграции БД

```bash
# Создать новую миграцию
npm run migration:create

# Сгенерировать миграцию из изменений entities
npm run migration:generate

# Выполнить миграции
npm run migration:run

# Показать статус миграций
npm run migration:show

# Откатить последнюю миграцию
npm run typeorm migration:revert -d ./database/data-source.ts
```

### TypeORM утилиты

```bash
# Синхронизация схемы (ОСТОРОЖНО в продакшене!)
npm run schema:sync

# Очистка кэша
npm run typeorm:cache
```

---

## 🐛 Решение проблем

### Не подключается к базе данных

**1. Проверьте что PostgreSQL запущен:**

```bash
# Из корня проекта
docker-compose -f docker-compose.dev.yml ps postgres
```

Должен быть статус `Up` и `healthy`.

**2. Проверьте настройки в `.env` (в корне проекта!):**

```env
DB_HOST=localhost  # для dev режима
DB_PORT=5432
DB_NAME=app_db
DB_USER=postgres
DB_PASSWORD=postgres
```

**3. Проверьте подключение вручную:**

```bash
# Из корня проекта
docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d app_db -c "SELECT 1"
```

**4. Проверьте что порт 5432 проброшен:**

```bash
docker-compose -f docker-compose.dev.yml ps postgres
# Должно быть: 0.0.0.0:5432->5432/tcp
```

### Не загружается Directus OpenAPI

**В dev режиме** Directus должен быть доступен на `localhost:8055`.

**Проблема:** В `main.ts` URL захардкожен для Docker:
```typescript
'http://directus:8055/server/specs/oas'  // не работает вне Docker
```

**Решение:** Измените на:
```typescript
const directusUrl = process.env.DIRECTUS_URL || 'http://localhost:8055';
directusDocument = await fetch(`${directusUrl}/server/specs/oas`, ...)
```

И добавьте в `.env`:
```env
DIRECTUS_URL=http://localhost:8055  # для dev
```

### Переменные окружения не подхватываются

**1. Убедитесь что `.env` в корне проекта:**

```bash
# Windows PowerShell
Test-Path D:\projects\chemical\.env
# Должно вернуть: True
```

**2. Убедитесь что НЕТ `server/.env`:**

```bash
Test-Path D:\projects\chemical\server\.env
# Должно вернуть: False
```

**3. Перезапустите dev сервер** (Ctrl+C и `npm run start:dev`)

### Порт уже занят

```bash
# Windows - найти процесс на порту 3000
netstat -ano | findstr :3000

# Убить процесс по PID
taskkill /PID <номер_процесса> /F
```

---

## 📖 См. также

- [README.md](../README.md) - Главная документация проекта
- [docker-compose.dev.yml](../docker-compose.dev.yml) - Dev конфигурация

---

## 💡 Советы

1. **Всегда запускайте `docker-compose.dev.yml`** перед локальной разработкой
2. **Убедитесь что `DB_HOST=localhost`** в `.env` для dev
3. **Используйте hot reload** - все изменения применяются автоматически
4. **Логи в реальном времени** помогают отлавливать ошибки
5. **Не забывайте миграции** после изменения entities
